const db = require('../utils/database');
const { sendAuditLog } = require('../utils/audit');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const setting = db.prepare('SELECT * FROM welcome_settings WHERE guild_id = ?').get(member.guild.id);
    if (setting?.channel_id) {
      const channel = member.guild.channels.cache.get(setting.channel_id);
      if (channel) {
        const message = (setting.message_template || 'Willkommen {user} auf dem Server!')
          .replace('{user}', `<@${member.id}>`)
          .replace('{server}', member.guild.name);
        await channel.send({ content: message }).catch(() => null);
      }
    }

    if (setting?.auto_role_id) {
      const role = member.guild.roles.cache.get(setting.auto_role_id);
      if (role) await member.roles.add(role).catch(() => null);
    }

    const security = db.prepare('SELECT anti_raid_enabled FROM security_settings WHERE guild_id = ?').get(member.guild.id);
    if (!security?.anti_raid_enabled) return;

    const allowed = db.prepare('SELECT 1 FROM whitelist WHERE guild_id = ? AND user_id = ?').get(member.guild.id, member.id);
    if (allowed) return;

    const accountAge = Date.now() - member.user.createdTimestamp;
    const threeDays = 1000 * 60 * 60 * 24 * 3;
    if (accountAge < threeDays && member.kickable) {
      await member.kick('Anti-Raid: Account zu neu').catch(() => null);
      await sendAuditLog(member.guild, `🛡️ Anti-Raid: ${member.user.tag} wurde gekickt (Account zu neu).`);
    }
  }
};
