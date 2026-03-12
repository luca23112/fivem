const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Zeigt die Bot-Latenz'),
  async execute(interaction, client) {
    const latency = client.ws.ping;
    await interaction.reply({ embeds: [baseEmbed('🏓 Pong!', `Gateway-Latenz: **${latency}ms**`)], ephemeral: true });
  }
};
