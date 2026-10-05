import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { getStatus } from '../utils/rconPool';

const INTERVAL = Number(process.env.STATUS_INTERVAL_SECONDS ?? 60) * 1000;
const messageCache = new Map<string, string>();

export function startStatusPoster(client: Client) {
  const channelId = process.env.STATUS_CHANNEL_ID;
  if (!channelId) {
    console.log('STATUS_CHANNEL_ID not set; status poster disabled');
    return;
  }

  async function postStatus() {
    try {
      const status = await getStatus();
      const ch = client.channels.cache.get(channelId) as TextChannel | undefined;
      if (!ch) return;

      const embed = new EmbedBuilder()
        .setTitle('🎮 Minecraft Bedrock Server Status')
        .setDescription(String(status) || 'No status available')
        .setColor(String(status).toLowerCase().includes('offline') ? 'Red' : 'Green')
        .setTimestamp();

      const cacheKey = `status-${channelId}`;
      const lastMessageId = messageCache.get(cacheKey);

      try {
        if (lastMessageId) {
          const message = await ch.messages.fetch(lastMessageId).catch(() => null);
          if (message) {
            await message.edit({ embeds: [embed] });
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to update status message, posting new one:', err);
      }

      const newMsg = await ch.send({ embeds: [embed] });
      messageCache.set(cacheKey, newMsg.id);
    } catch (err) {
      console.error('Status poster error:', err);
    }
  }

  postStatus();
  setInterval(postStatus, INTERVAL);
  console.log(`Status poster started (interval: ${INTERVAL}ms)`);
}
