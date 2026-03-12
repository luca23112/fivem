const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');
const { setSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole-setup')
    .setDescription('Erstellt ein modernes Reaktionsrollen-Panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((o) => o.setName('gamer').setDescription('Gamer Rolle').setRequired(true))
    .addRoleOption((o) => o.setName('news').setDescription('News Rolle').setRequired(true)),
  async execute(interaction) {
    const gamer = interaction.options.getRole('gamer');
    const news = interaction.options.getRole('news');
    setSetting(interaction.guild.id, 'rr_gamer_role', gamer.id);
    setSetting(interaction.guild.id, 'rr_news_role', news.id);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('rr_gamer').setLabel('🎮 Gamer').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('rr_news').setLabel('📰 News').setStyle(ButtonStyle.Success)
    );

    await interaction.channel.send({
      content: 'Made by Luca',
      embeds: [baseEmbed('🏷️ Reaktionsrollen', 'Klicke auf einen Button, um dir Rollen zu geben oder zu entfernen.')],
      components: [row]
    });

    await interaction.reply({ content: '✅ Reaktionsrollen-Panel erstellt.', ephemeral: true });
  }
};
