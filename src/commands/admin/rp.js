const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getSetting } = require('../../utils/settings');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rp')
    .setDescription('Steuert den RP-Modus')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((s) => s.setName('start').setDescription('Startet RP'))
    .addSubcommand((s) => s.setName('stop').setDescription('Stoppt RP')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const channelId = getSetting(interaction.guild.id, 'rp_channel_id', interaction.channel.id);
    const channel = interaction.guild.channels.cache.get(channelId) || interaction.channel;
    const isStart = sub === 'start';

    await channel.send({ embeds: [baseEmbed('🎭 RP-Status', `RP ist jetzt **${isStart ? 'GESTARTET' : 'GESTOPPT'}**.`)] });
    await interaction.reply({ content: `✅ RP wurde ${isStart ? 'gestartet' : 'gestoppt'}.`, ephemeral: true });
  }
};
