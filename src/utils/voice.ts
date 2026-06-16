import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState, VoiceConnectionStatus, getVoiceConnection, demuxProbe } from '@discordjs/voice';
import { request } from 'undici';
import gTTS from 'google-tts-api';
import { VoiceBasedChannel, GuildMember } from 'discord.js';

const player = createAudioPlayer();

export async function join(channel: VoiceBasedChannel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator as any,
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
    connection.subscribe(player);
    return connection;
  } catch (err) {
    connection.destroy();
    throw err;
  }
}

export async function leave(guildId: string) {
  const conn = getVoiceConnection(guildId);
  if (conn) conn.destroy();
}

export async function playTTS(channel: VoiceBasedChannel, text: string, lang = 'id') {
  const connection = getVoiceConnection(channel.guild.id) ?? await join(channel);
  const url = gTTS.getAudioUrl(text, { lang, slow: false });
  const res = await request(url);
  const { stream, type } = await demuxProbe(res.body);
  const resource = createAudioResource(stream, { inputType: type });
  player.play(resource);
  try {
    await entersState(player, AudioPlayerStatus.Playing, 5_000);
  } catch (err) {
    // ignore
  }
  // wait until finished
  return new Promise<void>((resolve) => {
    const onEnd = (status: AudioPlayerStatus) => {
      if (status === AudioPlayerStatus.Idle) {
        player.removeListener('stateChange', onState);
        resolve();
      }
    };
    const onState = (oldState: any, newState: any) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        player.removeListener('stateChange', onState);
        resolve();
      }
    };
    player.on('stateChange', onState);
  });
}

export async function playUrl(channel: VoiceBasedChannel, url: string) {
  const connection = getVoiceConnection(channel.guild.id) ?? await join(channel);
  const res = await request(url);
  const { stream, type } = await demuxProbe(res.body);
  const resource = createAudioResource(stream, { inputType: type });
  player.play(resource);
}
