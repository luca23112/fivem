const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-counting')
    .setDescription('Richtet einen Counting-Kanal ein')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((o) => o.setName('kanal').setDescription('Counting-Kanal').addChannelTypes(ChannelType.GuildText).setRequired(true)),
  async execute(interaction) {
    db.prepare('INSERT INTO counting_settings (guild_id, channel_id, current_number, last_user_id) VALUES (?, ?, 0, NULL) ON CONFLICT(guild_id) DO UPDATE SET channel_id = excluded.channel_id, current_number = 0, last_user_id = NULL')
      .run(interaction.guild.id, interaction.options.getChannel('kanal').id);
    await interaction.reply({ content: '✅ Counting-System aktiviert (startet bei 1).', ephemeral: true });
  }
};
