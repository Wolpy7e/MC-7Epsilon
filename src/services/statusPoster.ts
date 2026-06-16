import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { getStatus } from '../utils/rcon';

const INTERVAL = Number(process.env.STATUS_INTERVAL_SECONDS ?? 60) * 1000;

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
      const embed = new EmbedBuilder().setTitle('Server Status').setDescription(String(status)).setTimestamp();
      await ch.send({ embeds: [embed] });
    } catch (err) {
      console.error('Status poster error', err);
    }
  }

  // initial post
  postStatus();
  setInterval(postStatus, INTERVAL);
  console.log('Status poster started');
}
