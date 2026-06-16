import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, PermissionFlagsBits } from 'discord.js';
import serverCommand from './commands/server';
import adminCommand from './commands/admin';
import voiceCommand from './commands/voice';
import { startStatusPoster } from './services/statusPoster';
import { startLogService, postLog } from './services/logPoster';
import { startNotifications } from './services/notifications';
import * as rcon from './utils/rcon';
import * as whitelist from './utils/whitelist';

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;

if (!token || !guildId) {
  console.error('DISCORD_TOKEN and GUILD_ID must be set in environment');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  // Register guild slash commands (server control)
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), { body: [serverCommand.data.toJSON(), adminCommand.data.toJSON(), voiceCommand.data.toJSON()] });
    console.log('Registered guild commands');
  } catch (err) {
    console.error('Failed to register commands', err);
  }
  // Start background services
  startLogService(client);
  startStatusPoster(client);
  startNotifications(client);
});

const commands = {
  server: serverCommand,
  admin: adminCommand,
  voice: voiceCommand,
};

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands[interaction.commandName as keyof typeof commands];
  if (!command) return;
  await command.execute(interaction);
});

// Simple per-user action rate limiter
const lastAction = new Map<string, number>();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const parts = interaction.customId.split(':');
  if (parts[0] !== 'server') return;

  const type = parts[1]; // confirm or cancel
  const action = parts[2]; // start/stop/restart
  const ownerId = parts[3];

  // permission check: original user OR ManageGuild OR ADMIN_ROLE_ID OR whitelisted
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const hasManage = member?.permissions.has(PermissionFlagsBits.ManageGuild);
  const hasAdminRole = adminRoleId ? member?.roles.cache.has(adminRoleId) : false;
  const isWhitelisted = await whitelist.has(interaction.user.id);
  if (!(interaction.user.id === ownerId || hasManage || hasAdminRole || isWhitelisted)) {
    await interaction.reply({ content: 'You are not allowed to confirm this action.', ephemeral: true });
    return;
  }

  if (type === 'cancel') {
    await interaction.update({ content: `Action ${action} canceled.`, components: [] });
    return;
  }

  if (type === 'confirm') {
    const key = `${interaction.user.id}:${action}`;
    const now = Date.now();
    const last = lastAction.get(key) ?? 0;
    if (now - last < 10000) {
      await interaction.reply({ content: 'Please wait before sending another command.', ephemeral: true });
      return;
    }
    lastAction.set(key, now);

    await interaction.update({ content: `Executing ${action}...`, components: [] });

    let result = '';
    try {
      if (action === 'start') result = await rcon.startServer();
      else if (action === 'stop') result = await rcon.stopServer();
      else if (action === 'restart') result = await rcon.restartServer();
      else result = 'Unknown action';
    } catch (err: any) {
      result = `Error: ${String(err.message ?? err)}`;
    }

    try {
      await interaction.followUp({ content: `Result: ${result}`, ephemeral: true });
      await postLog(`User ${interaction.user.tag} executed ${action}: ${result}`, client);
    } catch (err) {
      console.error('Failed to send followup or log', err);
    }
  }
});

client.login(token).catch((e) => {
  console.error('Login error', e);
});
