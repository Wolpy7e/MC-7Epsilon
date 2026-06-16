import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getStatus } from '../utils/rcon';

const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Control Minecraft Bedrock server')
  .addSubcommand((s) => s.setName('start').setDescription('Start the server'))
  .addSubcommand((s) => s.setName('stop').setDescription('Stop the server'))
  .addSubcommand((s) => s.setName('restart').setDescription('Restart the server'))
  .addSubcommand((s) => s.setName('status').setDescription('Get server status'))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

async function execute(interaction: ChatInputCommandInteraction) {
  // Channel restriction: prefer CONTROL_CHANNEL_ID; otherwise check name
  const allowedChannel = process.env.CONTROL_CHANNEL_ID;
  if (allowedChannel && interaction.channelId !== allowedChannel) {
    await interaction.reply({ content: 'Perintah hanya bisa dijalankan di control-panel.', ephemeral: true });
    return;
  }

  const sub = interaction.options.getSubcommand();

  try {
    if (sub === 'status') {
      const status = await getStatus();
      await interaction.reply({ content: `Status: ${status}`, ephemeral: true });
      return;
    }

    // For start/stop/restart: send ephemeral confirmation buttons
    if (sub === 'start' || sub === 'stop' || sub === 'restart') {
      const confirmId = `server:confirm:${sub}:${interaction.user.id}`;
      const cancelId = `server:cancel:${sub}:${interaction.user.id}`;

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(confirmId).setLabel('Confirm').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId(cancelId).setLabel('Cancel').setStyle(ButtonStyle.Secondary)
      );

      await interaction.reply({ content: `Are you sure you want to ${sub} the server?`, components: [row], ephemeral: true });
      return;
    }
  } catch (err: any) {
    console.error(err);
    await interaction.reply({ content: `Error: ${String(err.message ?? err)}`, ephemeral: true });
  }
}

export default { data, execute };
