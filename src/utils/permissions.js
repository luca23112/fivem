const { PermissionFlagsBits } = require('discord.js');

function hasHigherRole(moderator, target) {
  if (!moderator || !target) return false;
  if (moderator.id === target.guild.ownerId) return true;
  return moderator.roles.highest.position > target.roles.highest.position;
}

function ensurePermission(interaction, permission, message) {
  if (interaction.member.permissions.has(permission)) return true;
  interaction.reply({ content: message || '❌ Fehlende Berechtigung.', ephemeral: true }).catch(() => null);
  return false;
}

module.exports = {
  hasHigherRole,
  ensurePermission,
  PermissionFlagsBits
};
