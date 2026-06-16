import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import * as voice from '../utils/voice';

const data = new SlashCommandBuilder()
  .setName('voice')
  .setDescription('Voice functions: join, leave, tts, play')
  .addSubcommand((s) => s.setName('join').setDescription('Bot joins your voice channel'))
  .addSubcommand((s) => s.setName('leave').setDescription('Bot leaves voice channel'))
  .addSubcommand((s) => s.setName('tts').setDescription('Bot speaks a TTS message').addStringOption((o) => o.setName('text').setDescription('Text to speak').setRequired(true)))
  .addSubcommand((s) => s.setName('play').setDescription('Play an audio URL').addStringOption((o) => o.setName('url').setDescription('Audio URL').setRequired(true)))
  .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);

async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  const member = interaction.member;
  const guild = interaction.guild;
  if (!guild) return await interaction.reply({ content: 'This command must be used in a guild.', ephemeral: true });

  // find member voice channel
  const m = await guild.members.fetch(interaction.user.id);
  const channel = m.voice.channel;
  if (sub === 'join') {
    if (!channel) return await interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    try {
      await voice.join(channel);
      await interaction.reply({ content: 'Joined your voice channel.', ephemeral: true });
    } catch (err: any) {
      await interaction.reply({ content: `Failed to join: ${String(err.message ?? err)}`, ephemeral: true });
    }
    return;
  }

  if (sub === 'leave') {
    await voice.leave(guild.id);
    await interaction.reply({ content: 'Left voice channel.', ephemeral: true });
    return;
  }

  if (sub === 'tts') {
    if (!channel) return await interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    const text = interaction.options.getString('text', true);
    await interaction.deferReply({ ephemeral: true });
    try {
      await voice.playTTS(channel, text);
      await interaction.editReply({ content: 'Spoken.' });
    } catch (err: any) {
      await interaction.editReply({ content: `Failed to speak: ${String(err.message ?? err)}` });
    }
    return;
  }

  if (sub === 'play') {
    if (!channel) return await interaction.reply({ content: 'You must be in a voice channel.', ephemeral: true });
    const url = interaction.options.getString('url', true);
    try {
      await voice.playUrl(channel, url);
      await interaction.reply({ content: 'Playing URL.', ephemeral: true });
    } catch (err: any) {
      await interaction.reply({ content: `Failed to play: ${String(err.message ?? err)}`, ephemeral: true });
    }
    return;
  }
}

export default { data, execute };
