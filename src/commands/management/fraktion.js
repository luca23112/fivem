const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { baseEmbed } = require('../../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fraktion')
    .setDescription('Fraktionsverwaltung')
    .addSubcommand((s) => s.setName('set-rolle').setDescription('Legt die Verwaltungsrollen für Fraktionen fest').addRoleOption((o) => o.setName('rolle').setDescription('Manager-Rolle').setRequired(true)))
    .addSubcommand((s) => s.setName('hinzufügen').setDescription('Registriert eine neue Fraktion im System').addStringOption((o) => o.setName('name').setDescription('Fraktionsname').setRequired(true)).addRoleOption((o) => o.setName('rolle').setDescription('Fraktionsrolle').setRequired(true)))
    .addSubcommand((s) => s.setName('auflösen').setDescription('Löscht eine bestehende Fraktion unwiderruflich').addStringOption((o) => o.setName('name').setDescription('Fraktionsname').setRequired(true)))
    .addSubcommand((s) => s.setName('verwarnung').setDescription('Gibt einer Fraktion eine offizielle Verwarnung').addStringOption((o) => o.setName('name').setDescription('Fraktionsname').setRequired(true)).addStringOption((o) => o.setName('grund').setDescription('Grund').setRequired(true)))
    .addSubcommand((s) => s.setName('liste').setDescription('Zeigt alle registrierten Fraktionen')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set-rolle') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Administrator erforderlich.', ephemeral: true });
      db.prepare('INSERT INTO faction_settings (guild_id, manager_role_id) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET manager_role_id = excluded.manager_role_id')
        .run(interaction.guild.id, interaction.options.getRole('rolle').id);
      return interaction.reply({ content: '✅ Fraktions-Managerrolle gesetzt.', ephemeral: true });
    }

    const settings = db.prepare('SELECT manager_role_id FROM faction_settings WHERE guild_id = ?').get(interaction.guild.id);
    const hasRole = settings?.manager_role_id && interaction.member.roles.cache.has(settings.manager_role_id);
    if (!hasRole && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Fraktionsverwaltung-Berechtigung fehlt.', ephemeral: true });
    }

    if (sub === 'liste') {
      const rows = db.prepare('SELECT name, role_id, warnings FROM factions WHERE guild_id = ? ORDER BY name ASC').all(interaction.guild.id);
      if (!rows.length) return interaction.reply({ content: 'Keine Fraktionen hinterlegt.', ephemeral: true });
      const embed = baseEmbed('🏛️ Fraktionsliste', rows.map((f) => `**${f.name}** • <@&${f.role_id}> • Verwarnungen: ${f.warnings}`).join('\n'));
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'hinzufügen') {
      try {
        db.prepare('INSERT INTO factions (guild_id, name, role_id, created_by) VALUES (?, ?, ?, ?)')
          .run(interaction.guild.id, interaction.options.getString('name'), interaction.options.getRole('rolle').id, interaction.user.id);
        return interaction.reply({ content: '✅ Fraktion hinzugefügt.', ephemeral: true });
      } catch {
        return interaction.reply({ content: '❌ Fraktion existiert bereits.', ephemeral: true });
      }
    }

    if (sub === 'auflösen') {
      const result = db.prepare('DELETE FROM factions WHERE guild_id = ? AND name = ?').run(interaction.guild.id, interaction.options.getString('name'));
      return interaction.reply({ content: result.changes ? '✅ Fraktion aufgelöst.' : '❌ Fraktion nicht gefunden.', ephemeral: true });
    }

    if (sub === 'verwarnung') {
      const row = db.prepare('SELECT warnings FROM factions WHERE guild_id = ? AND name = ?').get(interaction.guild.id, interaction.options.getString('name'));
      if (!row) return interaction.reply({ content: '❌ Fraktion nicht gefunden.', ephemeral: true });
      db.prepare('UPDATE factions SET warnings = warnings + 1 WHERE guild_id = ? AND name = ?').run(interaction.guild.id, interaction.options.getString('name'));
      return interaction.reply({ content: `⚠️ Fraktion verwarnt. Neuer Stand: ${row.warnings + 1}`, ephemeral: true });
    }
  }
};
