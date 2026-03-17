# FiveM AFK Script (ESX + Standalone)

Ein AFK-System für FiveM mit ESX-Unterstützung, einstellbarem Auto-Kick und Discord Webhook Logs.

## Features
- AFK-Erkennung über Inaktivität (Bewegung).
- ESX Benachrichtigungen (`esx:showNotification`) im ESX-Modus.
- Standalone-Fallback per Chat.
- Auto-Kick vollständig ein-/ausschaltbar.
- Kick-Zeit frei einstellbar.
- Optionales Broadcast an alle Spieler.
- Discord Webhook Logs für AFK, zurück aktiv und Kick.
- `/afkstatus` (Client) und `/afklist` (Server-Konsole).

## Installation
1. Ordner `fivem-afk-script` in deinen `resources`-Ordner legen.
2. In `server.cfg` hinzufügen:
   ```cfg
   ensure es_extended
   ensure fivem-afk-script
   ```
3. Server neu starten.

## Konfiguration (`config.lua`)
- `Config.Framework = 'esx'` oder `'standalone'`
- `Config.AfkTimeout = 300`
- `Config.Kick.Enabled = true/false`
- `Config.Kick.Timeout = 900`
- `Config.BroadcastStatus = true/false`
- `Config.Messages` nach Wunsch anpassen

### Discord Webhook aktivieren
```lua
Config.DiscordWebhook = {
    Enabled = true,
    Url = 'https://discord.com/api/webhooks/DEIN_WEBHOOK',
    BotName = 'AFK Logger',
    AvatarUrl = '',
    Color = 16753920,
    LogAfk = true,
    LogBack = true,
    LogKick = true
}
```

### Beispiel: Kick deaktivieren
```lua
Config.Kick.Enabled = false
```

### Beispiel: Kick nach 10 Minuten
```lua
Config.Kick.Enabled = true
Config.Kick.Timeout = 600
```
