const { SlashCommandBuilder } = require('discord.js');
const { sendAuditLog } = require('../../utils/audit');
const { hasHigherRole, ensurePermission, PermissionFlagsBits } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Moderationsbefehle')
    .addSubcommand((s) => s.setName('ban').setDescription('Sperrt einen Benutzer dauerhaft vom Server').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('grund').setDescription('Grund').setRequired(false)))
    .addSubcommand((s) => s.setName('kick').setDescription('Entfernt einen Benutzer vom Server').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('grund').setDescription('Grund').setRequired(false)))
    .addSubcommand((s) => s.setName('timeout').setDescription('Setzt einen Benutzer in den Timeout, maximal 10 Minuten').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addIntegerOption((o) => o.setName('minuten').setDescription('1-10 Minuten').setRequired(true).setMinValue(1).setMaxValue(10)).addStringOption((o) => o.setName('grund').setDescription('Grund').setRequired(false))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User nicht gefunden.', ephemeral: true });
    if (member.id === interaction.user.id) return interaction.reply({ content: '❌ Du kannst dich nicht selbst moderieren.', ephemeral: true });
    if (!hasHigherRole(interaction.member, member)) {
      return interaction.reply({ content: '❌ Deine Rolle ist nicht hoch genug für diese Aktion.', ephemeral: true });
    }

    const grund = interaction.options.getString('grund') || 'Kein Grund angegeben';

    if (sub === 'ban') {
      if (!ensurePermission(interaction, PermissionFlagsBits.BanMembers, '❌ Ban Members erforderlich.')) return;
      if (!member.bannable) return interaction.reply({ content: '❌ Ich kann diesen User nicht bannen (Rollenhierarchie).', ephemeral: true });
      await member.ban({ reason: grund });
      await sendAuditLog(interaction.guild, `🔨 ${interaction.user.tag} hat ${user.tag} gebannt. Grund: ${grund}`);
      return interaction.reply({ content: `✅ ${user.tag} wurde gebannt.` });
    }

    if (sub === 'kick') {
      if (!ensurePermission(interaction, PermissionFlagsBits.KickMembers, '❌ Kick Members erforderlich.')) return;
      if (!member.kickable) return interaction.reply({ content: '❌ Ich kann diesen User nicht kicken (Rollenhierarchie).', ephemeral: true });
      await member.kick(grund);
      await sendAuditLog(interaction.guild, `👢 ${interaction.user.tag} hat ${user.tag} gekickt. Grund: ${grund}`);
      return interaction.reply({ content: `✅ ${user.tag} wurde gekickt.` });
    }

    if (!ensurePermission(interaction, PermissionFlagsBits.ModerateMembers, '❌ Moderate Members erforderlich.')) return;
    if (!member.moderatable) return interaction.reply({ content: '❌ Ich kann diesen User nicht timeouten.', ephemeral: true });

    const minutes = interaction.options.getInteger('minuten');
    await member.timeout(minutes * 60 * 1000, grund);
    await sendAuditLog(interaction.guild, `⏱️ ${interaction.user.tag} hat ${user.tag} für ${minutes} Minuten getimeoutet. Grund: ${grund}`);
    return interaction.reply({ content: `✅ ${user.tag} ist für ${minutes} Minuten im Timeout.` });
  }
};
