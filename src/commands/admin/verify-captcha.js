const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-captcha')
    .setDescription('Sendet ein Captcha-Verify-Panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('open_captcha_modal').setLabel('Captcha starten').setStyle(ButtonStyle.Success)
    );

    await interaction.channel.send({
      content: 'Made by Luca',
      embeds: [baseEmbed('🔐 Verifizierung', 'Bestätige dich über den Captcha-Button.')],
      components: [row]
    });

    await interaction.reply({ content: '✅ Captcha-Panel gesendet.', ephemeral: true });
  }
};
