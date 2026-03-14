const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Zeigt Informationen über einen Kanal')
    .addChannelOption((o) => o.setName('kanal').setDescription('Kanal').setRequired(false)),
  async execute(interaction) {
    const ch = interaction.options.getChannel('kanal') || interaction.channel;
    const embed = baseEmbed('📺 Kanalinfo', `**Name:** ${ch.name}\n**ID:** ${ch.id}\n**Typ:** ${ChannelType[ch.type] || ch.type}\n**Erstellt:** <t:${Math.floor(ch.createdTimestamp / 1000)}:F>`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
