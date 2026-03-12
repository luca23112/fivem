const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup-create')
    .setDescription('Erstellt ein komplettes Backup des Servers')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) => o.setName('name').setDescription('Name des Backups').setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const guild = interaction.guild;
    const payload = {
      roles: guild.roles.cache
        .filter((r) => r.id !== guild.id)
        .map((r) => ({ name: r.name, color: r.color, permissions: r.permissions.bitfield.toString() })),
      channels: guild.channels.cache.map((c) => ({
        name: c.name,
        type: c.type,
        parent: c.parentId,
        parentName: c.parent?.name || null
      })),
      createdBy: interaction.user.id
    };

    db.prepare('INSERT INTO backups (guild_id, owner_id, name, payload) VALUES (?, ?, ?, ?)')
      .run(guild.id, interaction.user.id, interaction.options.getString('name'), JSON.stringify(payload));
    await interaction.editReply('✅ Backup erfolgreich erstellt.');
  }
};
