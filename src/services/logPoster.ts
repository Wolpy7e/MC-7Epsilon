import { Client, TextChannel } from 'discord.js';
import { emitter } from '../utils/rcon';

export function startLogService(client: Client) {
  const channelId = process.env.LOG_CHANNEL_ID;
  if (!channelId) {
    console.log('LOG_CHANNEL_ID not set; log service disabled');
    return;
  }

  const ch = () => client.channels.cache.get(channelId) as TextChannel | undefined;

  emitter.on('rcon:send', ({ command }) => {
    const c = ch();
    if (c) c.send(`[RCON SEND] ${command}`);
  });

  emitter.on('rcon:response', ({ command, response }) => {
    const c = ch();
    if (c) c.send(`[RCON RESP] ${command} -> ${response}`);
  });

  emitter.on('rcon:error', ({ command, error }) => {
    const c = ch();
    if (c) c.send(`[RCON ERR] ${command} -> ${String(error)}`);
  });

  console.log('Log service started');
}

export async function postLog(message: string, client: Client) {
  const channelId = process.env.LOG_CHANNEL_ID;
  if (!channelId) return;
  const ch = client.channels.cache.get(channelId) as TextChannel | undefined;
  if (!ch) return;
  await ch.send(message);
}
