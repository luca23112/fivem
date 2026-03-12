const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('avatar').setDescription('Zeigt den Avatar eines Users').addUserOption((o)=>o.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const url = user.displayAvatarURL({ size: 1024 });
    const embed = baseEmbed('🖼️ Avatar', `[Hier klicken](${url})`).setImage(url);
    await interaction.reply({ embeds: [embed] });
  }
};
