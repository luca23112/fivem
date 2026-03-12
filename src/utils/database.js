const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config/config');

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });
const db = new Database(config.databasePath);

db.exec(`
CREATE TABLE IF NOT EXISTS backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS factions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role_id TEXT NOT NULL,
  warnings INTEGER DEFAULT 0,
  created_by TEXT NOT NULL,
  UNIQUE(guild_id, name)
);
CREATE TABLE IF NOT EXISTS faction_settings (
  guild_id TEXT PRIMARY KEY,
  manager_role_id TEXT
);
CREATE TABLE IF NOT EXISTS security_settings (
  guild_id TEXT PRIMARY KEY,
  anti_raid_enabled INTEGER DEFAULT 0,
  log_channel_id TEXT
);
CREATE TABLE IF NOT EXISTS whitelist (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  added_by TEXT NOT NULL,
  UNIQUE(guild_id, user_id)
);
CREATE TABLE IF NOT EXISTS team_warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  moderator_id TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS welcome_settings (
  guild_id TEXT PRIMARY KEY,
  channel_id TEXT,
  message_template TEXT,
  auto_role_id TEXT
);
CREATE TABLE IF NOT EXISTS counting_settings (
  guild_id TEXT PRIMARY KEY,
  channel_id TEXT,
  current_number INTEGER DEFAULT 0,
  last_user_id TEXT
);
CREATE TABLE IF NOT EXISTS suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS guild_settings (
  guild_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  PRIMARY KEY (guild_id, key)
);
CREATE TABLE IF NOT EXISTS user_warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  moderator_id TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS levels (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  PRIMARY KEY (guild_id, user_id)
);
CREATE TABLE IF NOT EXISTS daily_rewards (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  last_claim_at TEXT,
  streak INTEGER DEFAULT 0,
  PRIMARY KEY (guild_id, user_id)
);
`);

module.exports = db;
