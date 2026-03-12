const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Zeigt Server-Informationen'),
  async execute(interaction) {
    const g = interaction.guild;
    const embed = baseEmbed('🌐 Serverinfo', `**Name:** ${g.name}\n**Mitglieder:** ${g.memberCount}\n**Kanäle:** ${g.channels.cache.size}\n**Rollen:** ${g.roles.cache.size}`)
      .setThumbnail(g.iconURL());
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
