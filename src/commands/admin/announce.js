const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Sendet eine moderne Ankündigung in einen Kanal')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((o) => o.setName('kanal').setDescription('Zielkanal').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addStringOption((o) => o.setName('titel').setDescription('Titel').setRequired(true))
    .addStringOption((o) => o.setName('text').setDescription('Nachricht').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    const titel = interaction.options.getString('titel');
    const text = interaction.options.getString('text');

    await channel.send({ content: 'Made by Luca', embeds: [baseEmbed(`📢 ${titel}`, text)] });
    await interaction.reply({ content: `✅ Ankündigung wurde in ${channel} gesendet.`, ephemeral: true });
  }
};
