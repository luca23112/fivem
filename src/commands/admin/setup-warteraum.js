const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('setup-warteraum').setDescription('Erstellt ein komplettes Support-Warteraum-System').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const category = await interaction.guild.channels.create({ name: 'Support', type: ChannelType.GuildCategory });
    const waiting = await interaction.guild.channels.create({ name: '⏳-warteraum', type: ChannelType.GuildVoice, parent: category.id });
    await interaction.reply({ content: `✅ Warteraum erstellt: ${waiting}`, ephemeral: true });
  }
};
