const db = require('./database');

function setSetting(guildId, key, value) {
  db.prepare('INSERT INTO guild_settings (guild_id, key, value) VALUES (?, ?, ?) ON CONFLICT(guild_id, key) DO UPDATE SET value = excluded.value')
    .run(guildId, key, value == null ? null : String(value));
}

function getSetting(guildId, key, fallback = null) {
  const row = db.prepare('SELECT value FROM guild_settings WHERE guild_id = ? AND key = ?').get(guildId, key);
  return row ? row.value : fallback;
}

function getBoolSetting(guildId, key, fallback = false) {
  const value = getSetting(guildId, key, fallback ? '1' : '0');
  return value === '1' || value === 'true';
}

module.exports = { setSetting, getSetting, getBoolSetting };
