const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('Konfiguriert Willkommensnachrichten')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((o) => o.setName('kanal').setDescription('Willkommenskanal').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addStringOption((o) => o.setName('nachricht').setDescription('Template (z.B. Willkommen {user} auf {server})').setRequired(true)),
  async execute(interaction) {
    db.prepare('INSERT INTO welcome_settings (guild_id, channel_id, message_template) VALUES (?, ?, ?) ON CONFLICT(guild_id) DO UPDATE SET channel_id = excluded.channel_id, message_template = excluded.message_template')
      .run(interaction.guild.id, interaction.options.getChannel('kanal').id, interaction.options.getString('nachricht'));
    await interaction.reply({ content: '✅ Welcome-System konfiguriert.', ephemeral: true });
  }
};
