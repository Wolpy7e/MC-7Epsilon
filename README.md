# MC Control Center (Discord)

Minimal scaffold for a Discord Control Center for Minecraft Bedrock.

Setup

1. Copy `.env.example` to `.env` and fill values:

```
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
RCON_PASSWORD=changeme
```

2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

Notes

- This is a starter scaffold. RCON behavior for Bedrock depends on your hosting provider. For full host control you may need provider API or SSH access.
- Next steps: implement status posting, automatic logs, admin chat panel, security checks, and voice integration.
 
 Voice commands
 
 Use `/voice join` to make the bot join your current voice channel.
 Use `/voice leave` to make the bot leave.
 Use `/voice tts text:...` to have the bot speak text via TTS.
 Use `/voice play url:...` to play an audio URL.
 
 Testing checklist
 
 - Fill `.env` with tokens and channel IDs.
 - Run `npm install` to install dependencies.
 - Run `npm run dev` and watch console for 'Registered guild commands'.
 - In Discord, use the slash commands in the configured guild.
 
Deployment

- Build the bot: `npm run build`
- Run production: `npm start`
- Use PM2 if installed: `npm run serve`
- On Linux/macOS: `./deploy.sh`
- On Windows PowerShell: `.\deploy.ps1`

GitHub upload

1. Initialize repo (if not already): `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial Discord Control Center for Minecraft Bedrock"`
4. Create GitHub repo and add remote: `git remote add origin https://github.com/youruser/yourrepo.git`
5. Push: `git push -u origin main`

GitHub Actions

- This repository includes a CI workflow at `.github/workflows/nodejs.yml`.
- The workflow installs dependencies and runs `npm run ci` on push and pull request.
