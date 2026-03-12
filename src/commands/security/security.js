const { SlashCommandBuilder, ChannelType } = require('discord.js');
const db = require('../../utils/database');
const config = require('../../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('security')
    .setDescription('Security-Verwaltung')
    .addSubcommand((s) => s.setName('setup').setDescription('Konfiguriert Anti-Raid- und Log-Einstellungen').addBooleanOption((o) => o.setName('anti_raid').setDescription('Anti-Raid aktivieren').setRequired(true)).addChannelOption((o) => o.setName('log_kanal').setDescription('Log-Kanal').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((s) => s.setName('whitelist-add').setDescription('Fügt einen Benutzer zur Whitelist hinzu').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
    .addSubcommand((s) => s.setName('whitelist-list').setDescription('Zeigt alle autorisierten Whitelist-User an')),
  async execute(interaction) {
    if (interaction.user.id !== config.ownerId) return interaction.reply({ content: '❌ Nur der Bot-Owner darf diesen Befehl nutzen.', ephemeral: true });

    const sub = interaction.options.getSubcommand();
    if (sub === 'setup') {
      db.prepare('INSERT INTO security_settings (guild_id, anti_raid_enabled, log_channel_id) VALUES (?, ?, ?) ON CONFLICT(guild_id) DO UPDATE SET anti_raid_enabled = excluded.anti_raid_enabled, log_channel_id = excluded.log_channel_id')
        .run(interaction.guild.id, interaction.options.getBoolean('anti_raid') ? 1 : 0, interaction.options.getChannel('log_kanal').id);
      return interaction.reply({ content: '✅ Security-Setup gespeichert.', ephemeral: true });
    }

    if (sub === 'whitelist-add') {
      const user = interaction.options.getUser('user');
      db.prepare('INSERT OR IGNORE INTO whitelist (guild_id, user_id, added_by) VALUES (?, ?, ?)').run(interaction.guild.id, user.id, interaction.user.id);
      return interaction.reply({ content: `✅ ${user.tag} zur Whitelist hinzugefügt.`, ephemeral: true });
    }

    const rows = db.prepare('SELECT user_id FROM whitelist WHERE guild_id = ?').all(interaction.guild.id);
    return interaction.reply({ content: rows.length ? rows.map((r) => `<@${r.user_id}>`).join(', ') : 'Whitelist ist leer.', ephemeral: true });
  }
};
