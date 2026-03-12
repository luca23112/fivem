const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Entbannt einen User per ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((o) => o.setName('user_id').setDescription('Discord User ID').setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('user_id');
    await interaction.guild.members.unban(userId).catch(() => null);
    await interaction.reply({ content: `✅ User mit ID ${userId} wurde (falls gebannt) entbannt.` });
  }
};
