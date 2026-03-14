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
        { name: '🎛️ Zentrales Setup', value: '`/settings ...`, `/support-system ...`, `/support-panel`, `/panel-status`, `/support-template`' },
        { name: '🎫 Ticketsystem', value: '`/ticket close|claim|release|add-user|remove-user`, `/ticket-admin list-open|transfer` + Buttons' },
        { name: '👮 Moderation', value: '`/mod ban|kick|timeout`, `/warn`, `/warnings`, `/unwarn`, `/unban`, `/purge`, `/slowmode`, `/lockdown`, `/nick`' },
        { name: '👥 Team', value: '`/uprank`, `/downrank`, `/teamlist`, `/team ...`' },
        { name: '🎭 RP', value: '`/rp start`, `/rp stop`' },
        { name: '🌍 Community', value: '`/level`, `/leaderboard`, `/poll`, `/event-announce`, `/reactionrole-setup`, `/announce`, `/social-notify`, `/xp-give`, `/xp-reset`' },
        { name: '🎮 Games & Utility', value: '`/wuerfeln`, `/zahlenraten`, `/daily`, `/channelinfo`, `/roleinfo`, `/serverinfo`, `/userinfo`, `/avatar`, `/remind`, `/remind-list`, `/remind-cancel`, `/bot-stats`, `/invite`' },
        { name: '🔐 Verify/Security', value: '`/verify-captcha`, `/server-verify` (Owner)' },
        { name: '🆘 Support', value: `[Support-Server](${config.supportServerUrl})` }
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
