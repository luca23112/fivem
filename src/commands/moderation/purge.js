const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Löscht mehrere Nachrichten')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((o) => o.setName('anzahl').setDescription('1-100').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('anzahl');
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `🧹 ${amount} Nachrichten gelöscht.`, ephemeral: true });
  }
};
