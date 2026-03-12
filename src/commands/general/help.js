const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt Informationen und den Support-Server an'),
  async execute(interaction) {
    const embed = baseEmbed('📘 Hilfe', 'Wichtige Systeme und Commands')
      .addFields(
        { name: '🎛️ Zentrales Setup', value: '`/settings ...` + `/panel`' },
        { name: '🎫 Ticketsystem', value: '`/ticket close` + Ticketauswahl TS1-TS5 im Panel' },
        { name: '👮 Moderation', value: '`/mod ban|kick|timeout`, AutoMod via `/settings automod`' },
        { name: '👥 Team', value: '`/uprank`, `/downrank`, `/teamlist`, `/team ...`' },
        { name: '🎭 RP', value: '`/rp start`, `/rp stop`' },
        { name: '🌍 Community', value: '`/level`, `/leaderboard`, `/poll`, `/event-announce`, `/reactionrole-setup`' },
        { name: '🎮 Games', value: '`/wuerfeln`, `/zahlenraten`, `/daily`' },
        { name: '🔐 Verify', value: '`/verify-captcha` + Verify-Button im Panel' },
        { name: '🆘 Support', value: `[Support-Server](${config.supportServerUrl})` }
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
