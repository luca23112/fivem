const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');
const { advancedCommands } = require('../../utils/advancedCommandCatalog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advanced-overview')
    .setDescription('Zeigt Übersicht aller 100 neuen Modern-Commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const list = advancedCommands.slice(0, 25).map((c) => `• /${c.id} — ${c.title}`).join('\n');
    const embed = baseEmbed('🚀 Advanced Suite', `Insgesamt: **${advancedCommands.length}** neue Commands.\n\nErste 25:\n${list}\n\nNutze /cfg001 bis /cfg100 zum Einstellen.`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
