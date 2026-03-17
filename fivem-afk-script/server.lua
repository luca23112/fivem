local afkPlayers = {}
local ESX = nil

if Config.Framework == 'esx' then
    local ok, shared = pcall(function()
        return exports['es_extended']:getSharedObject()
    end)

    if ok then
        ESX = shared
        print('[afk-system] ESX erfolgreich geladen.')
    else
        print('[afk-system] WARNUNG: ESX konnte nicht geladen werden. Fallback auf Standalone-Namen.')
    end
end

local function getDisplayName(src)
    if ESX then
        local xPlayer = ESX.GetPlayerFromId(src)
        if xPlayer then
            if xPlayer.getName then
                return xPlayer.getName()
            end

            if xPlayer.name then
                return xPlayer.name
            end
        end
    end

    return GetPlayerName(src) or ('Spieler %s'):format(src)
end

local function getIdentifier(src)
    local identifiers = GetPlayerIdentifiers(src)
    for _, identifier in ipairs(identifiers) do
        if identifier:find('license:') == 1 then
            return identifier
        end
    end

    return identifiers[1] or 'unbekannt'
end

local function sendWebhook(title, description)
    if not Config.DiscordWebhook
        or not Config.DiscordWebhook.Enabled
        or not Config.DiscordWebhook.Url
        or Config.DiscordWebhook.Url == '' then
        return
    end

    local payload = {
        username = Config.DiscordWebhook.BotName or 'AFK Logger',
        avatar_url = Config.DiscordWebhook.AvatarUrl or '',
        embeds = {
            {
                title = title,
                description = description,
                color = Config.DiscordWebhook.Color or 16753920,
                footer = {
                    text = os.date('%d.%m.%Y %H:%M:%S')
                }
            }
        }
    }

    PerformHttpRequest(Config.DiscordWebhook.Url, function() end, 'POST', json.encode(payload), {
        ['Content-Type'] = 'application/json'
    })
end

RegisterNetEvent('afk-system:updateStatus', function(isAfk)
    local src = source
    local name = getDisplayName(src)

    afkPlayers[src] = isAfk and true or nil

    if Config.BroadcastStatus then
        local msg = isAfk
            and ('^3%s ist jetzt AFK.^0'):format(name)
            or ('^2%s ist nicht mehr AFK.^0'):format(name)

        TriggerClientEvent('chat:addMessage', -1, { args = { 'AFK', msg } })
    end

    local identifier = getIdentifier(src)

    if isAfk and Config.DiscordWebhook.LogAfk then
        sendWebhook(
            'Spieler AFK',
            ('**Spieler:** %s\n**ID:** %s\n**Identifier:** `%s`\n**Status:** AFK'):format(name, src, identifier)
        )
    elseif (not isAfk) and Config.DiscordWebhook.LogBack then
        sendWebhook(
            'Spieler wieder aktiv',
            ('**Spieler:** %s\n**ID:** %s\n**Identifier:** `%s`\n**Status:** Aktiv'):format(name, src, identifier)
        )
    end
end)

RegisterNetEvent('afk-system:requestKick', function(clientAfkTime)
    local src = source

    if not Config.Kick.Enabled then
        return
    end

    if type(clientAfkTime) ~= 'number' or clientAfkTime < Config.Kick.Timeout then
        return
    end

    if Config.DiscordWebhook.LogKick then
        local name = getDisplayName(src)
        local identifier = getIdentifier(src)

        sendWebhook(
            'AFK Kick',
            ('**Spieler:** %s\n**ID:** %s\n**Identifier:** `%s`\n**Inaktiv:** %s Sekunden\n**Aktion:** Kick'):format(
                name,
                src,
                identifier,
                math.floor(clientAfkTime)
            )
        )
    end

    DropPlayer(src, Config.Messages.kickReason)
end)

AddEventHandler('playerDropped', function()
    afkPlayers[source] = nil
end)

RegisterCommand('afklist', function(src)
    if src ~= 0 then
        TriggerClientEvent('chat:addMessage', src, {
            args = { 'AFK', '^1Dieser Befehl kann nur über die Server-Konsole ausgeführt werden.^0' }
        })
        return
    end

    print('--- AFK Liste ---')
    local count = 0

    for playerId in pairs(afkPlayers) do
        count = count + 1
        print(('[AFK] %s (%s)'):format(getDisplayName(playerId), playerId))
    end

    if count == 0 then
        print('Keine AFK-Spieler gefunden.')
    end

    print('-----------------')
end, true)
