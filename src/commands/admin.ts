import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import * as whitelist from '../utils/whitelist';
import { sendRcon, getStatus } from '../utils/rcon';

const data = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('Admin panel and tools')
  .addSubcommand((s) => s.setName('broadcast').setDescription('Broadcast message to status channel').addStringOption((o) => o.setName('message').setDescription('Message').setRequired(true)))
  .addSubcommand((s) => s.setName('whitelist-add').setDescription('Add user to whitelist').addUserOption((o) => o.setName('user').setDescription('User to add').setRequired(true)))
  .addSubcommand((s) => s.setName('whitelist-remove').setDescription('Remove user from whitelist').addUserOption((o) => o.setName('user').setDescription('User to remove').setRequired(true)))
  .addSubcommand((s) => s.setName('whitelist-list').setDescription('List whitelisted users'))
  .addSubcommand((s) => s.setName('rcon').setDescription('Execute raw RCON command').addStringOption((o) => o.setName('command').setDescription('RCON command').setRequired(true)))
  .addSubcommand((s) => s.setName('players').setDescription('Get player list from server'))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

async function execute(interaction: ChatInputCommandInteraction) {
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  const member = interaction.member;

  // Simple permission: either ManageGuild, admin role, or whitelisted
  const allowedByRole = adminRoleId && 'roles' in (member as any) && (member as any).roles.cache.has(adminRoleId);
  const allowedByWhitelist = await whitelist.has(interaction.user.id);
  const allowedByPerm = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
  if (!allowedByRole && !allowedByWhitelist && !allowedByPerm) {
    await interaction.reply({ content: 'Anda tidak memiliki izin untuk menggunakan perintah admin.', ephemeral: true });
    return;
  }

  const sub = interaction.options.getSubcommand();
  await interaction.deferReply({ ephemeral: true });

  try {
    if (sub === 'broadcast') {
      const msg = interaction.options.getString('message', true);
      const statusChannelId = process.env.STATUS_CHANNEL_ID;
      if (!statusChannelId) return await interaction.editReply('STATUS_CHANNEL_ID tidak dikonfigurasi.');
      const ch = await interaction.client.channels.fetch(statusChannelId as string);
      if (!ch || !ch.isTextBased()) return await interaction.editReply('Status channel tidak ditemukan atau bukan text channel.');
      await ch.send(msg);
      await interaction.editReply('Broadcast terkirim.');
      return;
    }

    if (sub === 'whitelist-add') {
      const u = interaction.options.getUser('user', true);
      const added = await whitelist.add(u.id);
      await interaction.editReply(added ? `User ${u.tag} ditambahkan ke whitelist.` : `User ${u.tag} sudah ada di whitelist.`);
      return;
    }

    if (sub === 'whitelist-remove') {
      const u = interaction.options.getUser('user', true);
      const removed = await whitelist.remove(u.id);
      await interaction.editReply(removed ? `User ${u.tag} dihapus dari whitelist.` : `User ${u.tag} tidak ditemukan di whitelist.`);
      return;
    }

    if (sub === 'whitelist-list') {
      const lst = await whitelist.listAll();
      if (lst.length === 0) await interaction.editReply('Whitelist kosong.');
      else await interaction.editReply(`Whitelisted IDs:\n${lst.join('\n')}`);
      return;
    }

    if (sub === 'rcon') {
      const cmd = interaction.options.getString('command', true);
      try {
        const res = await sendRcon(cmd);
        await interaction.editReply(`RCON -> ${res}`);
      } catch (err: any) {
        await interaction.editReply(`Error executing RCON: ${String(err.message ?? err)}`);
      }
      return;
    }

    if (sub === 'players') {
      try {
        const res = await getStatus();
        await interaction.editReply(String(res));
      } catch (err: any) {
        await interaction.editReply(`Error: ${String(err.message ?? err)}`);
      }
      return;
    }
  } catch (err: any) {
    console.error(err);
    await interaction.editReply(`Error: ${String(err.message ?? err)}`);
  }
}

export default { data, execute };
