import { promises as fs } from 'fs';
import path from 'path';

const filePath = process.env.WHITELIST_FILE || path.join(__dirname, '../../data/whitelist.json');

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify([]), 'utf8');
  }
}

export async function load(): Promise<string[]> {
  await ensureFile();
  const raw = await fs.readFile(filePath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    return [];
  }
}

export async function save(list: string[]) {
  await ensureFile();
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), 'utf8');
}

export async function has(userId: string) {
  const list = await load();
  return list.includes(userId);
}

export async function add(userId: string) {
  const list = await load();
  if (!list.includes(userId)) {
    list.push(userId);
    await save(list);
    return true;
  }
  return false;
}

export async function remove(userId: string) {
  const list = await load();
  const idx = list.indexOf(userId);
  if (idx !== -1) {
    list.splice(idx, 1);
    await save(list);
    return true;
  }
  return false;
}

export async function listAll() {
  return await load();
}
