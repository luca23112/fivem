fx_version 'cerulean'
game 'gta5'

name 'afk-system'
author 'Codex'
description 'AFK-System für FiveM (ESX + Standalone + Discord Webhooks)'
version '1.1.0'

lua54 'yes'

shared_scripts {
    'shared/config.lua'
}

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}
