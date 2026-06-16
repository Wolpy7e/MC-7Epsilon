# MC Control Center (Discord)

Discord bot starter kit untuk mengelola Minecraft Bedrock server dari Discord.

Bot ini mencakup:

- Kontrol server via perintah `/server`
- Status server otomatis di channel `#📊»status-server`
- Log perintah RCON di channel `#📜»log-server`
- Panel admin dengan whitelist dan broadcast
- Notifikasi penting dengan embed dan mention role
- Voice support: join, leave, TTS, play URL

## Fitur

- `server start` / `stop` / `restart` dengan tombol konfirmasi
- `server status` menampilkan status server Bedrock
- `/admin` untuk manajemen whitelist, broadcast, dan eksekusi RCON
- `voice` command untuk audio dan TTS di voice channel
- Otomatis kirim status dan log ke channel yang terkonfigurasi

## Persiapan

1. Salin `.env.example` ke `.env`
2. Isi token Discord, guild/channel IDs, dan pengaturan RCON
3. Install dependensi:

```bash
npm install
```

4. Jalankan development:

```bash
npm run dev
```

## Environment variables

Contoh isi `.env`:

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
RCON_PASSWORD=changeme
```

- `CONTROL_CHANNEL_ID` = channel khusus untuk perintah kontrol server.
- `STATUS_CHANNEL_ID` = channel untuk status rutin.
- `LOG_CHANNEL_ID` = channel untuk log RCON.
- `NOTIFICATION_CHANNEL_ID` = channel untuk notifikasi penting.
- `NOTIFY_ROLE_ID` = role yang akan di-mention untuk notifikasi.
- `ADMIN_ROLE_ID` = role admin yang bisa menggunakan `/admin`.
- `WHITELIST_FILE` = lokasi file JSON untuk menyimpan whitelist.

## Commands

### Server control

- `/server start`
- `/server stop`
- `/server restart`
- `/server status`

### Admin panel

- `/admin broadcast`
- `/admin whitelist-add`
- `/admin whitelist-remove`
- `/admin whitelist-list`
- `/admin rcon`
- `/admin players`

### Voice

- `/voice join`
- `/voice leave`
- `/voice tts`
- `/voice play`

## Deploy

Jalankan build dan start:

```bash
npm run build
npm start
```

Atau jalankan dengan PM2:

```bash
npm run serve
```

Skrip deploy:

- Linux/macOS: `./deploy.sh`
- Windows: `./deploy.ps1`

## Upload ke GitHub

Jika Git sudah tersedia, jalankan:

```bash
cd "f:\Discord Bot\Bot MC"
.\upload-to-github.ps1 -RepoUrl "https://github.com/youruser/yourrepo.git"
```

Atau jika Anda menggunakan bash:

```bash
./upload-to-github.sh "https://github.com/youruser/yourrepo.git"
```

## CI

- Ada workflow GitHub Actions di `.github/workflows/nodejs.yml`.
- Workflow ini menjalankan `npm install` dan `npm run build`.

## Catatan

- Pastikan `RCON_PASSWORD` tidak di-commit.
- Untuk host Bedrock server di Anjas, gunakan RCON host/port yang diberikan provider.
- `start`/`restart` saat ini menggunakan placeholder karena kontrol start/stop penuh biasanya melalui API hosting.
