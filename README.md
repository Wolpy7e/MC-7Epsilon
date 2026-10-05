# MC-BotDiscord

A Discord control center for managing a Minecraft Bedrock server directly from Discord.

MC-BotDiscord gives you a clean way to monitor a server, issue RCON commands, manage whitelist access, broadcast messages, and control voice announcements from your Discord guild.

## Features

- `/server start` / `stop` / `restart` / `status`
- Automatic status posting to a configured Discord channel
- RCON command logging and error notifications
- Admin tools for whitelist management and broadcasts
- Voice commands for join, leave, TTS, and URL playback
- Flexible configuration through environment variables

## Tech Stack

- Node.js 18+
- TypeScript
- Discord.js v14
- @discordjs/voice
- RCON client for Bedrock server communication

## Project Structure

```text
src/
  commands/      Discord slash command handlers
  services/      status posting, notifications, log relay
  utils/         RCON, whitelist, and voice helpers
README.md
.env.example
package.json
```

## Prerequisites

Before you run the project, make sure you have:

- A Discord bot token
- A Discord guild ID
- Access to a Minecraft Bedrock server with RCON enabled
- Node.js 18 or newer
- npm

## Installation

1. Clone the repository

```bash
git clone https://github.com/Wolpy7e/MC-BotDiscord.git
cd MC-BotDiscord
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file from the example

```bash
cp .env.example .env
```

4. Update the values in `.env`

## Environment Variables

```env
DISCORD_TOKEN=your-discord-bot-token
GUILD_ID=your-guild-id
CONTROL_CHANNEL_ID=channel-id-for-control-panel
STATUS_CHANNEL_ID=channel-id-for-status
LOG_CHANNEL_ID=channel-id-for-logs
NOTIFICATION_CHANNEL_ID=channel-id-for-notifications
NOTIFY_ROLE_ID=role-id-to-mention
ADMIN_ROLE_ID=role-id-for-admin-access
WHITELIST_FILE=./data/whitelist.json
RCON_HOST=127.0.0.1
RCON_PORT=19132
RCON_PASSWORD=your-rcon-password
STATUS_INTERVAL_SECONDS=60
RCON_POOL_SIZE=3
```

### Variable Notes

- `CONTROL_CHANNEL_ID`: channel where server control commands are allowed
- `STATUS_CHANNEL_ID`: channel for periodic server status messages
- `LOG_CHANNEL_ID`: channel for RCON send/response/error logs
- `NOTIFICATION_CHANNEL_ID`: channel for status and error alerts
- `NOTIFY_ROLE_ID`: Discord role mention for notifications
- `ADMIN_ROLE_ID`: role that can use admin commands
- `WHITELIST_FILE`: JSON file path for the whitelist feature
- `RCON_PASSWORD`: must be kept private and not committed

## Run the Bot

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

### PM2 deployment

```bash
npm run serve
```

## Commands

### Server commands

- `/server status`
- `/server start`
- `/server stop`
- `/server restart`

### Admin commands

- `/admin broadcast`
- `/admin whitelist-add`
- `/admin whitelist-remove`
- `/admin whitelist-list`
- `/admin rcon`
- `/admin players`

### Voice commands

- `/voice join`
- `/voice leave`
- `/voice tts`
- `/voice play`

## Deployment Notes

The project includes deployment utilities for common environments:

- `./deploy.sh` for Linux/macOS
- `./deploy.ps1` for Windows
- `ecosystem.config.js` for PM2

## Security

- Keep `.env` out of git history
- Do not hardcode production server credentials
- Restrict admin channels and roles to trusted members only
- Use proper bot permissions in your Discord guild

## Troubleshooting

### Bot is not responding

- Verify `DISCORD_TOKEN` and `GUILD_ID` are set correctly
- Make sure the bot has permission to read/send messages in the target channels

### RCON commands fail

- Confirm `RCON_HOST`, `RCON_PORT`, and `RCON_PASSWORD` are correct
- Make sure RCON is enabled on the Bedrock server
- Check firewall or hosting restrictions if the server is remote

### Voice commands fail

- Confirm the bot has permission to connect to voice channels
- Ensure the bot has access to the guild and voice adapter support
- Check if the provided audio URL is valid and reachable

## License

This project is distributed as-is for educational and self-hosted use.

## Contribution

Pull requests and suggestions are welcome. If you improve the bot, please keep the project clean, well-documented, and compatible with the existing structure.
