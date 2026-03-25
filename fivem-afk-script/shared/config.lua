Config = {}

-- Framework: 'esx' oder 'standalone'
Config.Framework = 'esx'

-- Zeit in Sekunden bis ein Spieler als AFK gilt
Config.AfkTimeout = 300 -- 5 Minuten

-- Kick-Einstellungen
Config.Kick = {
    Enabled = true,      -- true = AFK-Kick aktiv, false = deaktiviert
    Timeout = 900        -- Sekunden bis Kick (z. B. 900 = 15 Minuten)
}

-- Nachrichten
Config.Messages = {
    nowAfk = 'Du bist jetzt AFK. Bewege dich, um den AFK-Status zu verlassen.',
    noLongerAfk = 'Du bist nicht mehr AFK.',
    kickReason = 'Du wurdest wegen AFK vom Server getrennt.'
}

-- Sollen alle Spieler informiert werden, wenn jemand AFK geht/zurückkommt?
Config.BroadcastStatus = true

-- Für standalone: Chat-Nachrichten statt ESX Notifications nutzen
Config.UseChatFallback = true

-- Discord Webhook Logging
Config.DiscordWebhook = {
    Enabled = true,
    Url = '', -- Hier deinen Discord Webhook eintragen
    BotName = 'AFK Logger',
    AvatarUrl = '',
    Color = 16753920, -- Orange
    LogAfk = true,
    LogBack = true,
    LogKick = true
}
