# Discord RP Management Bot (discord.js v14)

## Highlights
- Nur Slash Commands, modularer Aufbau
- Zentrales Konfigurationssystem mit `/settings`
- Modernes Server-Panel mit `/panel`
- **Feature-Hub mit 220+ konfigurierbaren Funktionen** via `/feature-hub`
- Alle Embeds modern mit Footer **Made by Luca**
- Ticketsystem TS1–TS5 inkl. Auto-Erstellung, **Übernehmen**, **Freigeben**, **User hinzufügen**, Schließen & Transkript-Log
- Welcome, Verify (inkl. Captcha), AutoMod, RP, Team, Community, Games
- SQLite Persistenz inkl. Reminders

## Neue nützliche Funktionen (Auszug)
- Support Templates: `/support-template set|delete|list|send`
- Reminder Verwaltung: `/remind-list`, `/remind-cancel`
- Moderation Extra: `/nick`
- Ticket-Admin: `/ticket-admin list-open`, `/ticket-admin transfer`
- Backup-Export: `/backup-export`
- XP Verwaltung: `/xp-give`, `/xp-reset`
- Systemstatus: `/panel-status`
- Voll konfigurierbarer Partner-/Ticket-Support: `/support-system ...`, `/support-panel`
- Dynamische Fragebögen pro Kategorie + AI-Einschätzung via `/support-ai`
- Voice-Support Workflow (Warteraum + DM an Team) via `/voice-support`
- Social Alerts für TikTok/YouTube/Twitch via `/social-notify`
- Bot-Owner Server-Verifizierung via `/server-verify` (optional per ENV scharf schaltbar)
- Moderation: `/warn`, `/warnings`, `/unwarn`, `/unban`, `/lockdown`, `/unlockdown`
- Infos/Utility: `/channelinfo`, `/roleinfo`, `/announce`
- `/feature-hub overview|enable|disable|status` (220+ Features)
- `/serverinfo`, `/userinfo`, `/avatar`, `/bot-stats`, `/invite`
- `/remind` (lokaler Reminder-Service)
- `/purge`, `/slowmode`
- `/reactionrole-setup`, `/event-announce`, `/verify-captcha`
- Ticket-Buttons: **Übernehmen**, **Freigeben**, **User hinzufügen**, **Schließen**

## Lokales Hosting (Schritt für Schritt)
1. `cp .env.example .env`
2. `.env` ausfüllen
3. `npm install`
4. `.env` Tipp: `COMMAND_DEPLOY_MODE=global` damit der Bot auf allen Servern die Commands hat
5. `npm run deploy`
6. `npm run dev` oder `npm start`

## Optional dauerhaft laufen lassen
```bash
npm i -g pm2
pm2 start src/index.js --name rp-bot
pm2 save
pm2 startup
```

## Multi-Server Betrieb
- Standard ist `COMMAND_DEPLOY_MODE=global` → Slash-Commands sind für alle Server verfügbar (kann bis zu 1h propagieren).
- Für schnellen Test auf einem Server: `COMMAND_DEPLOY_MODE=guild` + `GUILD_ID=<deine test guild>`.
- `ENFORCE_VERIFIED_SERVERS=false` lässt den Bot auf allen Servern arbeiten.
- Wenn du Whitelist willst: `ENFORCE_VERIFIED_SERVERS=true` und Server mit `/server-verify` eintragen.
