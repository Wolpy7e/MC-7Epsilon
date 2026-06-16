import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { getStatus, emitter } from '../utils/rcon';

const INTERVAL = Number(process.env.STATUS_INTERVAL_SECONDS ?? 60) * 1000;

export function startNotifications(client: Client) {
  const channelId = process.env.NOTIFICATION_CHANNEL_ID;
  const notifyRole = process.env.NOTIFY_ROLE_ID;
  if (!channelId) {
    console.log('NOTIFICATION_CHANNEL_ID not set; notifications disabled');
    return;
  }

  const ch = () => client.channels.cache.get(channelId) as TextChannel | undefined;

  // Relay RCON errors as notifications
  emitter.on('rcon:error', ({ command, error }) => {
    const c = ch();
    if (!c) return;
    const embed = new EmbedBuilder().setTitle('RCON Error').addFields(
      { name: 'Command', value: String(command).slice(0, 1900) },
      { name: 'Error', value: String(error).slice(0, 1900) }
    ).setColor('Red').setTimestamp();
    const content = notifyRole ? `<@&${notifyRole}>` : '';
    c.send({ content, embeds: [embed] });
  });

  emitter.on('rcon:response', ({ command, response }) => {
    // small notifications for important commands
    if (String(command).toLowerCase().includes('stop') || String(command).toLowerCase().includes('start')) {
      const c = ch();
      if (!c) return;
      const embed = new EmbedBuilder().setTitle('RCON Response').setDescription(String(response)).addFields({ name: 'Command', value: String(command).slice(0, 1900) }).setTimestamp();
      const content = notifyRole ? `<@&${notifyRole}>` : '';
      c.send({ content, embeds: [embed] });
    }
  });

  // Status change detector
  let lastStatus: string | null = null;

  async function checkStatus() {
    try {
      const status = String(await getStatus());
      if (lastStatus === null) {
        lastStatus = status;
        return;
      }
      if (status !== lastStatus) {
        const c = ch();
        if (!c) return;
        const isOnline = !/offline|unavailable/i.test(status);
        const embed = new EmbedBuilder()
          .setTitle('Server Status Changed')
          .addFields({ name: 'Previous', value: String(lastStatus).slice(0, 1024) }, { name: 'Now', value: String(status).slice(0, 1024) })
          .setColor(isOnline ? 'Green' : 'Red')
          .setTimestamp();
        const content = notifyRole ? `<@&${notifyRole}>` : '';
        await c.send({ content, embeds: [embed] });
        lastStatus = status;
      }
    } catch (err) {
      console.error('Notification checkStatus error', err);
    }
  }

  // initial
  checkStatus();
  setInterval(checkStatus, INTERVAL);
  console.log('Notifications started');
}
