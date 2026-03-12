const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join-vc')
    .setDescription('Der Bot tritt dem aktuellen Voice-Channel des Nutzers bei')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const vc = interaction.member.voice.channel;
    if (!vc) return interaction.reply({ content: 'Du bist in keinem Voice-Channel.', ephemeral: true });

    joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator
    });

    await interaction.reply({ content: `✅ Ich bin ${vc} beigetreten.`, ephemeral: true });
  }
};
