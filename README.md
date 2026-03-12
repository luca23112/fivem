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
- Moderation: `/warn`, `/warnings`, `/unwarn`, `/unban`, `/lockdown`, `/unlockdown`
- Infos/Utility: `/channelinfo`, `/roleinfo`, `/announce`
- `/feature-hub overview|enable|disable|status` (220+ Features)
- `/serverinfo`, `/userinfo`, `/avatar`
- `/remind` (lokaler Reminder-Service)
- `/purge`, `/slowmode`
- `/reactionrole-setup`, `/event-announce`, `/verify-captcha`
- Ticket-Buttons: **Übernehmen**, **Freigeben**, **User hinzufügen**, **Schließen**

## Lokales Hosting (Schritt für Schritt)
1. `cp .env.example .env`
2. `.env` ausfüllen
3. `npm install`
4. `npm run deploy`
5. `npm run dev` oder `npm start`

## Optional dauerhaft laufen lassen
```bash
npm i -g pm2
pm2 start src/index.js --name rp-bot
pm2 save
pm2 startup
```
