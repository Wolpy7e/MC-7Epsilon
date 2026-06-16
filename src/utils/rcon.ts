import { Rcon } from 'rcon-client';
import { EventEmitter } from 'events';

export const emitter = new EventEmitter();

const host = process.env.RCON_HOST ?? '127.0.0.1';
const port = Number(process.env.RCON_PORT ?? 19132);
const password = process.env.RCON_PASSWORD ?? '';

export async function sendRcon(command: string) {
  if (!password) throw new Error('RCON_PASSWORD not set');
  emitter.emit('rcon:send', { command });
  const conn = await Rcon.connect({ host, port, password });
  try {
    const res = await conn.send(command);
    emitter.emit('rcon:response', { command, response: res });
    await conn.end();
    return res;
  } catch (err) {
    emitter.emit('rcon:error', { command, error: err });
    await conn.end();
    throw err;
  }
}

export async function getStatus() {
  try {
    const res = await sendRcon('list');
    return res;
  } catch (err) {
    return 'Offline or RCON unavailable';
  }
}

export async function startServer() {
  // For hosted providers you may need to call their API or start a process via SSH.
  // Placeholder: try to send a simple RCON command to wake server.
  try {
    await sendRcon('say Server starting (placeholder)');
    return 'Command sent (placeholder)';
  } catch (err) {
    return 'Failed to send start command via RCON';
  }
}

export async function stopServer() {
  try {
    await sendRcon('stop');
    return 'Stop command sent';
  } catch (err) {
    return 'Failed to send stop command via RCON';
  }
}

export async function restartServer() {
  // Placeholder: stop then start; real implementation depends on host.
  try {
    await sendRcon('stop');
    // wait and attempt start placeholder
    return 'Restart command issued (placeholder)';
  } catch (err) {
    return 'Failed to restart via RCON';
  }
}
