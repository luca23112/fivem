const { ChannelType } = require('discord.js');
const config = require('../config/config');
const logger = require('./logger');
const { getSetting } = require('./settings');

async function sendAuditLog(guild, content) {
  try {
    const channelId = getSetting(guild.id, 'mod_log_channel') || config.logChannelId;
    if (!channelId) return;
    const channel = guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(() => null);
    if (!channel || channel.type !== ChannelType.GuildText) return;
    await channel.send({ content });
  } catch (error) {
    logger.warn(`Audit-Log konnte nicht gesendet werden: ${error.message}`);
  }
}

module.exports = { sendAuditLog };
