const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-stats')
    .setDescription('Erstellt Live-Server-Statistiken in Kanälen')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((o) => o.setName('kategorie').setDescription('Kategorie für Stats-Kanäle').addChannelTypes(ChannelType.GuildCategory).setRequired(true)),
  async execute(interaction) {
    const cat = interaction.options.getChannel('kategorie');
    const guild = interaction.guild;

    await guild.channels.create({ name: `👥 Mitglieder: ${guild.memberCount}`, type: ChannelType.GuildVoice, parent: cat.id });
    await guild.channels.create({ name: `🤖 Bots: ${guild.members.cache.filter((m) => m.user.bot).size}`, type: ChannelType.GuildVoice, parent: cat.id });

    await interaction.reply({ content: '✅ Statistik-Kanäle erstellt.', ephemeral: true });
  }
};
