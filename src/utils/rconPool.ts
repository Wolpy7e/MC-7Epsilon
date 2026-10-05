import { Rcon } from 'rcon-client';
import { EventEmitter } from 'events';

export const emitter = new EventEmitter();

interface RconConfig {
  host: string;
  port: number;
  password: string;
}

class RconConnectionPool {
  private pool: Rcon[] = [];
  private config: RconConfig;
  private poolSize: number;
  private maxAttempts: number = 3;

  constructor(config: RconConfig, poolSize: number = 3) {
    this.config = config;
    this.poolSize = poolSize;
  }

  async getConnection(): Promise<Rcon> {
    if (this.pool.length > 0) {
      const conn = this.pool.pop()!;
      try {
        // Verify connection is still alive
        await conn.send('help');
        return conn;
      } catch (err) {
        // Connection is dead, try to get another
        await conn.end().catch(() => {});
        return this.getConnection();
      }
    }

    // Create new connection
    return await this.createConnection();
  }

  private async createConnection(): Promise<Rcon> {
    let lastError: Error | null = null;
    for (let i = 0; i < this.maxAttempts; i++) {
      try {
        const conn = await Rcon.connect(this.config);
        return conn;
      } catch (err) {
        lastError = err as Error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
    throw lastError || new Error('Failed to create RCON connection');
  }

  async returnConnection(conn: Rcon): Promise<void> {
    if (this.pool.length < this.poolSize) {
      this.pool.push(conn);
    } else {
      await conn.end().catch(() => {});
    }
  }

  async closeAll(): Promise<void> {
    const promises = this.pool.map((conn) => conn.end().catch(() => {}));
    await Promise.all(promises);
    this.pool = [];
  }
}

let pool: RconConnectionPool | null = null;

export function initializeRconPool(): void {
  const host = process.env.RCON_HOST ?? '127.0.0.1';
  const port = Number(process.env.RCON_PORT ?? 19132);
  const password = process.env.RCON_PASSWORD ?? '';
  const poolSize = Number(process.env.RCON_POOL_SIZE ?? 3);

  if (!password) {
    console.warn('RCON_PASSWORD not set; RCON commands will fail');
  }

  pool = new RconConnectionPool({ host, port, password }, poolSize);
}

export async function sendRcon(command: string): Promise<string> {
  if (!pool) {
    throw new Error('RCON pool not initialized. Call initializeRconPool() first.');
  }

  const conn = await pool.getConnection();
  try {
    emitter.emit('rcon:send', { command });
    const res = await conn.send(command);
    emitter.emit('rcon:response', { command, response: res });
    return res;
  } catch (err) {
    emitter.emit('rcon:error', { command, error: err });
    throw err;
  } finally {
    await pool.returnConnection(conn);
  }
}

export async function getStatus(): Promise<string> {
  try {
    const res = await sendRcon('list');
    return res;
  } catch (err) {
    return 'Offline or RCON unavailable';
  }
}

export async function startServer(): Promise<string> {
  try {
    const res = await sendRcon('say Server starting...');
    return `Server start initiated: ${res}`;
  } catch (err) {
    return `Failed to send start command: ${String(err)}`;
  }
}

export async function stopServer(): Promise<string> {
  try {
    const res = await sendRcon('stop');
    return `Stop command sent: ${res}`;
  } catch (err) {
    return `Failed to send stop command: ${String(err)}`;
  }
}

export async function restartServer(): Promise<string> {
  try {
    await sendRcon('stop');
    // Wait 5 seconds before restart
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const res = await sendRcon('say Server restarting...');
    return `Restart initiated: ${res}`;
  } catch (err) {
    return `Failed to restart: ${String(err)}`;
  }
}

export async function closeRconPool(): Promise<void> {
  if (pool) {
    await pool.closeAll();
    pool = null;
  }
}
