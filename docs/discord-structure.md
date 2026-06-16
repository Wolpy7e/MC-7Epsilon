**Struktur Server Discord — Simple (Admin + Minecraft Support)**

Ringkasan singkat: susun server agar fungsional untuk admin, kontrol Minecraft, status otomatis, dan log.

Channels (contoh nama)
- **🛠️»admin-tools**: channel teks untuk admin-only chat dan instruksi (ephemeral/admin replies)
- **⚙️»control-panel**: channel teks khusus untuk perintah `server` (slash commands)
- **📊»status-server**: channel teks untuk posting status otomatis dari bot
- **📜»log-server**: channel teks untuk log RCON, server events, dan audit
- **💬»general**: umum untuk pemain/komunitas
- **📢»announcements**: pengumuman resmi (read-only untuk @everyone)
- **🎙️ Voice - Lobby**: voice channel utama untuk pemain
- **🎧 Voice - Admin**: voice channel private untuk staff/admin

Roles (contoh + hak akses)
- **@Owner**: semua izin, manajer utama
- **@Admin**: ManageGuild, dapat menggunakan `admin` command dan konfirmasi aksi
- **@Moderator**: bantai chat, bantu users, tidak selalu akses RCON
- **@Whitelisted**: user yang diizinkan mengkonfirmasi perintah server (via bot whitelist)
- **@Player**: role default untuk pemain

Permissions & Praktik
- Batasi `⚙️»control-panel` hanya untuk role tertentu (Admin + Whitelisted) atau biarkan bot menolak perintah dari channel lain.
- Buat `📊»status-server` & `📜»log-server` sebagai text-only: atur permission agar hanya bot yang bisa mengirim pesan (admins dapat mengelola).
- `announcements`: hanya role Admin/Owner yang bisa mengirim.

Bot setup (environment)
- `DISCORD_TOKEN`, `GUILD_ID` — wajib
- `CONTROL_CHANNEL_ID`, `STATUS_CHANNEL_ID`, `LOG_CHANNEL_ID` — gunakan ID channel untuk memastikan bot bekerja hanya di channel yang ditetapkan
- `ADMIN_ROLE_ID` — opsional, memberi akses admin via role
- `WHITELIST_FILE` — path file JSON untuk menyimpan whitelist user IDs

Contoh alur
1. Admin menjalankan `/server status` di `⚙️»control-panel` → bot post ephemeral + status juga muncul periodik di `📊»status-server`.
2. Admin memilih `/server stop` → bot minta konfirmasi via tombol ephemeral → setelah konfirmasi, bot kirim perintah RCON dan log ke `📜»log-server`.
3. Jika admin ingin menambahkan user ke whitelist: `/admin whitelist-add @user` → user bisa mengkonfirmasi aksi server selanjutnya.

Keamanan tambahan
- Aktifkan rate-limit di bot agar aksi destruktif tidak sering dipanggil.
- Simpan `RCON_PASSWORD` aman pada environment; jangan commit ke repo.
- Jika hosting mendukung API/SSH, prefer kontrol via provider API untuk start/stop server daripada mengandalkan RCON untuk fungsi start/stop.

Catatan
- Ini adalah layout sederhana yang bisa dikustom sesuai komunitas. Jika mau, saya bisa buat file `server-roles.md` terpisah dengan contoh permission matrix dan template setup langkah demi langkah.
