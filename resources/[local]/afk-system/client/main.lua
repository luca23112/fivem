local lastPosition = nil
local afkTime = 0
local isAfk = false

local function notify(msg)
    if Config.Framework == 'esx' then
        TriggerEvent('esx:showNotification', msg)
        return
    end

    if Config.UseChatFallback then
        TriggerEvent('chat:addMessage', {
            args = { 'AFK', msg }
        })
    end
end

local function roundedVector(vec)
    return vector3(
        math.floor(vec.x * 10 + 0.5) / 10,
        math.floor(vec.y * 10 + 0.5) / 10,
        math.floor(vec.z * 10 + 0.5) / 10
    )
end

local function hasPlayerMoved(currentPosition)
    if not lastPosition then
        return true
    end

    local currentRounded = roundedVector(currentPosition)
    local lastRounded = roundedVector(lastPosition)

    return currentRounded.x ~= lastRounded.x
        or currentRounded.y ~= lastRounded.y
        or currentRounded.z ~= lastRounded.z
end

CreateThread(function()
    while true do
        Wait(1000)

        local playerPed = PlayerPedId()
        if playerPed == 0 then
            goto continue
        end

        local playerCoords = GetEntityCoords(playerPed)
        local moved = hasPlayerMoved(playerCoords)

        if moved then
            afkTime = 0

            if isAfk then
                isAfk = false
                TriggerServerEvent('afk-system:updateStatus', false)
                notify(Config.Messages.noLongerAfk)
            end
        else
            afkTime = afkTime + 1

            if not isAfk and afkTime >= Config.AfkTimeout then
                isAfk = true
                TriggerServerEvent('afk-system:updateStatus', true)
                notify(Config.Messages.nowAfk)
            end

            if Config.Kick.Enabled and afkTime >= Config.Kick.Timeout then
                TriggerServerEvent('afk-system:requestKick', afkTime)
                Wait(5000)
            end
        end

        lastPosition = playerCoords

        ::continue::
    end
end)

RegisterCommand('afkstatus', function()
    local statusText = isAfk and 'AFK' or 'Aktiv'
    notify(('Aktueller Status: %s | Inaktiv seit: %s Sekunden'):format(statusText, afkTime))
end, false)
