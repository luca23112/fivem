const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-stats')
    .setDescription('Zeigt Bot-Status, Uptime und Server-Statistiken'),
  async execute(interaction) {
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    const guildCount = interaction.client.guilds.cache.size;
    const userCount = interaction.client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);

    const embed = baseEmbed('📊 Bot Statistiken', 'Live-Status des Bots')
      .addFields(
        { name: '⏱️ Uptime', value: `${hours}h ${minutes}m ${seconds}s`, inline: true },
        { name: '🏠 Server', value: `${guildCount}`, inline: true },
        { name: '👥 Erreichte Member', value: `${userCount}`, inline: true },
        { name: '📶 API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
