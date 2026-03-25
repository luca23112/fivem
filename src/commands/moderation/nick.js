const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Ändert den Nickname eines Users')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption((o) => o.setName('name').setDescription('Neuer Nickname').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const name = interaction.options.getString('name');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
    if (!member.manageable) return interaction.reply({ content: '❌ Ich kann den Nickname nicht ändern.', ephemeral: true });

    await member.setNickname(name);
    await interaction.reply({ content: `✅ Nickname von ${user} auf **${name}** gesetzt.` });
  }
};
