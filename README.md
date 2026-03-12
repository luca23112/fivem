# Discord RP Management Bot (discord.js v14)

## Highlights
- Nur Slash Commands, modularer Aufbau
- Zentrales Konfigurationssystem mit `/settings`
- Zentrales Benutzer-Panel mit `/panel`
- Alle Embeds modern mit Footer **Made by Luca**
- Ticketsystem TS1–TS5 inkl. Auto-Erstellung, Schließen & Transkript-Log
- Welcome, Verify (inkl. Captcha), AutoMod, RP, Team, Community, Games
- SQLite Persistenz

## Wichtige neue Commands
- `/settings ...` (Kategorien, Rollen, Logs, Welcome, Verify, Team, AutoMod, Community, RP)
- `/panel` (Master-Panel)
- `/ticket close`
- `/uprank`, `/downrank`, `/teamlist`
- `/rp start`, `/rp stop`
- `/reactionrole-setup`, `/event-announce`
- `/verify-captcha`
- `/level`, `/leaderboard`, `/poll`, `/wuerfeln`, `/zahlenraten`, `/daily`

---

## Lokales Hosting (Schritt für Schritt)

### 1) Voraussetzungen
Installiere:
- **Node.js 20+** (LTS empfohlen)
- **npm** (kommt mit Node)

Prüfen:
```bash
node -v
npm -v
```

### 2) Bot im Discord Developer Portal erstellen
1. Öffne: https://discord.com/developers/applications
2. Neue Application erstellen
3. Unter **Bot** → Bot erstellen → Token kopieren
4. Unter **OAuth2 > URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Permissions: mindestens Administrator (zum Testen)
5. Bot über die erzeugte URL auf deinen Server einladen

### 3) Projekt lokal vorbereiten
```bash
cp .env.example .env
```
Dann `.env` ausfüllen:
- `DISCORD_TOKEN` = Bot Token
- `CLIENT_ID` = Application ID
- `GUILD_ID` = Testserver-ID (empfohlen für schnelle Command-Updates)
- `BOT_OWNER_ID` = deine Discord User ID
- optional: `LOG_CHANNEL_ID`, `SUPPORT_SERVER_URL`, `EMBED_COLOR`

### 4) Dependencies installieren
```bash
npm install
```

### 5) Slash Commands deployen
```bash
npm run deploy
```

### 6) Bot starten
Entwicklung (mit Auto-Restart):
```bash
npm run dev
```

Normal:
```bash
npm start
```

### 7) Ersteinrichtung im Discord Server
1. `/settings logs ...` setzen
2. `/settings verify ...` setzen
3. `/settings ticket-kategorie ...` und `/settings ticket-rolle ...` für TS1–TS5
4. `/panel` senden
5. Ticket/Verify/Team/Moderation testen

---

## Lokal dauerhaft laufen lassen (optional)

### Mit PM2
```bash
npm i -g pm2
pm2 start src/index.js --name rp-bot
pm2 save
pm2 startup
```

Nützliche PM2 Befehle:
```bash
pm2 status
pm2 logs rp-bot
pm2 restart rp-bot
pm2 stop rp-bot
```

---

## Häufige Probleme

### Commands erscheinen nicht
- `npm run deploy` erneut ausführen
- prüfen, ob `CLIENT_ID`/`GUILD_ID` korrekt gesetzt sind

### Bot startet nicht
- Token prüfen (`DISCORD_TOKEN`)
- Node-Version prüfen
- `npm install` erneut ausführen

### SQLite Datei fehlt
- `DATABASE_PATH` prüfen (Standard: `./src/data/bot.sqlite`)

---

## Start (Kurzfassung)
1. `cp .env.example .env`
2. `.env` ausfüllen
3. `npm install`
4. `npm run deploy`
5. `npm run dev` oder `npm start`
