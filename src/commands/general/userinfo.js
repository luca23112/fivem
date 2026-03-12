const { SlashCommandBuilder } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder().setName('userinfo').setDescription('Zeigt User-Informationen').addUserOption((o)=>o.setName('user').setDescription('User').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const embed = baseEmbed('👤 Userinfo', `**Tag:** ${user.tag}\n**ID:** ${user.id}\n**Account erstellt:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>${member ? `\n**Beigetreten:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : ''}`)
      .setThumbnail(user.displayAvatarURL());
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
