const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Verwarnt einen User offiziell')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption((o) => o.setName('grund').setDescription('Grund').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const grund = interaction.options.getString('grund');

    db.prepare('INSERT INTO user_warnings (guild_id, user_id, reason, moderator_id) VALUES (?, ?, ?, ?)')
      .run(interaction.guild.id, user.id, grund, interaction.user.id);

    const count = db.prepare('SELECT COUNT(*) AS c FROM user_warnings WHERE guild_id = ? AND user_id = ?')
      .get(interaction.guild.id, user.id).c;

    const embed = baseEmbed('⚠️ Verwarnung vergeben', `**User:** ${user.tag}\n**Grund:** ${grund}\n**Gesamtwarnungen:** ${count}`);
    await interaction.reply({ embeds: [embed] });
  }
};
