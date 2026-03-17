# AFK System (FiveM / ESX + Standalone)

Ein AFK-System für FiveM mit ESX-Unterstützung, einstellbarem Auto-Kick und Discord Webhook Logs.

## Wichtig für txAdmin (Ressourcenliste)
Lege die Resource **genau** hier ab:

```text
resources/[local]/afk-system/
```

Die `fxmanifest.lua` muss direkt im Resource-Root liegen (ist bereits so).

## Resource-Struktur (txAdmin-kompatibel)
```text
resources/
└─ [local]/
   └─ afk-system/
      ├─ fxmanifest.lua
      ├─ shared/
      │  └─ config.lua
      ├─ client/
      │  └─ main.lua
      └─ server/
         └─ main.lua
```

## Installation
1. Resource in `resources/[local]/afk-system` kopieren.
2. In `server.cfg` hinzufügen:
   ```cfg
   ensure es_extended
   ensure afk-system
   ```
3. In `shared/config.lua` deine Werte setzen (z. B. Webhook URL).
4. Server/txAdmin neu starten **oder** in der Konsole:
   ```cfg
   refresh
   ensure afk-system
   ```

## Features
- AFK-Erkennung über Inaktivität (Bewegung).
- ESX Benachrichtigungen (`esx:showNotification`) im ESX-Modus.
- Standalone-Fallback per Chat.
- Auto-Kick vollständig ein-/ausschaltbar.
- Kick-Zeit frei einstellbar.
- Optionales Broadcast an alle Spieler.
- Discord Webhook Logs für AFK, zurück aktiv und Kick.
- `/afkstatus` (Client) und `/afklist` (Server-Konsole).

## Konfiguration (`shared/config.lua`)
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
