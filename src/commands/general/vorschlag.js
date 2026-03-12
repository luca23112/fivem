const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vorschlag')
    .setDescription('Öffnet ein Formular für Ideen oder Vorschläge der User'),
  async execute(interaction) {
    const embed = baseEmbed('💡 Vorschläge', 'Klicke auf den Button, um einen Vorschlag einzureichen.');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('open_suggestion_modal').setLabel('Vorschlag erstellen').setStyle(ButtonStyle.Primary)
    );
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
