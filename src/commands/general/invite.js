const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Zeigt den Bot-Invite-Link und wichtige Setup-Infos'),
  async execute(interaction) {
    const invite = `https://discord.com/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`;
    const embed = baseEmbed('🤖 Bot auf weiteren Servern nutzen', 'Nutze diesen Link, um den Bot auf allen gewünschten Servern hinzuzufügen.')
      .addFields(
        { name: '🔗 Invite-Link', value: `[Bot einladen](${invite})` },
        { name: '🌍 Global Commands', value: 'Setze `COMMAND_DEPLOY_MODE=global`, dann funktionieren die Slash-Commands serverübergreifend.' }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
