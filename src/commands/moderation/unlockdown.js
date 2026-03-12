const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlockdown')
    .setDescription('Hebt den Lockdown des aktuellen Kanals auf')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null });
    await interaction.reply({ content: '🔓 Kanal wurde entsperrt.', ephemeral: true });
  }
};
