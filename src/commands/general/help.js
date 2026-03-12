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
        { name: '🎫 Ticketsystem', value: '`/ticket close|claim|release|add-user|remove-user` + Buttons (Übernehmen/Freigeben/User hinzufügen)' },
        { name: '👮 Moderation', value: '`/mod ban|kick|timeout`, `/warn`, `/warnings`, `/unwarn`, `/unban`, `/purge`, `/slowmode`, `/lockdown`' },
        { name: '👥 Team', value: '`/uprank`, `/downrank`, `/teamlist`, `/team ...`' },
        { name: '🎭 RP', value: '`/rp start`, `/rp stop`' },
        { name: '🌍 Community', value: '`/level`, `/leaderboard`, `/poll`, `/event-announce`, `/reactionrole-setup`, `/announce`' },
        { name: '🎮 Games & Utility', value: '`/wuerfeln`, `/zahlenraten`, `/daily`, `/channelinfo`, `/roleinfo`, `/serverinfo`, `/userinfo`, `/avatar`, `/remind`' },
        { name: '🔐 Verify', value: '`/verify-captcha` + Verify-Button im Panel' },
        { name: '🧠 Advanced Suite', value: '`/advanced-overview`, `/cfg001` ... `/cfg100` (alles einstellbar)' },
        { name: '🆘 Support', value: `[Support-Server](${config.supportServerUrl})` }
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
