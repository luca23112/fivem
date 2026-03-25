const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require('discord.js');
const db = require('../utils/database');
const config = require('../config/config');
const logger = require('../utils/logger');
const { baseEmbed } = require('../utils/embed');
const { getSetting } = require('../utils/settings');
const { features } = require('../utils/featureCatalog');

const captchaCodes = new Map();
const pendingTicketForms = new Map();

function parseJson(value, fallback = {}) {
  try { return JSON.parse(value || JSON.stringify(fallback)); } catch { return fallback; }
}

function ticketControlsRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_claim').setLabel('Übernehmen').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('ticket_release').setLabel('Freigeben').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_add_user').setLabel('Add User').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('ticket_remove_user').setLabel('Delete User').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_close_button').setLabel('Schließen').setStyle(ButtonStyle.Danger)
  );
}

async function createTicketChannel(interaction, type, answers = []) {
  const categoryId = getSetting(interaction.guild.id, `ticket_category_${type}`);
  const roleId = getSetting(interaction.guild.id, `ticket_role_${type}`);
  const categories = parseJson(getSetting(interaction.guild.id, 'support_categories', '{}'), {});
  const meta = categories[type] || {};

  const channel = await interaction.guild.channels.create({
    name: `ticket-${type}-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: categoryId || null,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
      ...(roleId ? [{ id: roleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }] : [])
    ]
  });

  db.prepare('INSERT OR REPLACE INTO tickets (channel_id, guild_id, creator_id, type, status) VALUES (?, ?, ?, ?, ?)')
    .run(channel.id, interaction.guild.id, interaction.user.id, type, 'open');

  const answerText = answers.length ? answers.map((a, i) => `**${i + 1}.** ${a}`).join('\n') : 'Keine Antworten übermittelt.';
  const openText = meta.welcomeText || 'Bitte beschreibe dein Anliegen.';
  const hintText = meta.hintText ? `\n\n💡 ${meta.hintText}` : '';

  await channel.send({
    content: 'Made by Luca',
    embeds: [baseEmbed('🎫 Ticket erstellt', `Typ: **${type.toUpperCase()}**\n${openText}${hintText}`).addFields({ name: 'Formular-Antworten', value: answerText })],
    components: [ticketControlsRow()]
  });

  return channel;
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        if (config.enforceVerifiedServers && interaction.commandName !== 'server-verify' && interaction.user.id !== config.ownerId) {
          const verified = db.prepare('SELECT 1 FROM verified_servers WHERE server_id = ?').get(interaction.guild.id);
          if (!verified) return interaction.reply({ content: '❌ Dieser Server ist nicht verifiziert.', ephemeral: true });
        }

        const requiredRole = getSetting(interaction.guild.id, `command_role_${interaction.commandName}`);
        if (requiredRole && !interaction.member.roles.cache.has(requiredRole) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return interaction.reply({ content: '❌ Deine Rolle darf diesen Command nicht nutzen.', ephemeral: true });
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
      }

      if (interaction.isAutocomplete()) {
        if (interaction.commandName === 'feature-hub') {
          const focused = interaction.options.getFocused().toLowerCase();
          const choices = features.filter((f) => f.id.includes(focused) || f.name.toLowerCase().includes(focused)).slice(0, 25).map((f) => ({ name: `${f.id} • ${f.name}`, value: f.id }));
          await interaction.respond(choices);
        }
        return;
      }

      if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_type_select') {
        const type = interaction.values[0];
        const categories = parseJson(getSetting(interaction.guild.id, 'support_categories', '{}'), {});
        const questions = (categories[type]?.questions || []).slice(0, 5);

        if (!questions.length) {
          const channel = await createTicketChannel(interaction, type, []);
          return interaction.reply({ content: `✅ Ticket erstellt: ${channel}`, ephemeral: true });
        }

        pendingTicketForms.set(interaction.user.id, { type, questions });
        const modal = new ModalBuilder().setCustomId('ticket_dynamic_form').setTitle(`Fragen: ${type}`);
        modal.addComponents(
          ...questions.map((q, i) => new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId(`q${i + 1}`).setLabel(q.slice(0, 45)).setStyle(TextInputStyle.Paragraph).setRequired(true)))
        );
        return interaction.showModal(modal);
      }

      if (interaction.isButton()) {
        if (interaction.customId === 'open_ticket') {
          const channel = await createTicketChannel(interaction, 'allgemeiner_support', []);
          return interaction.reply({ content: `Ticket erstellt: ${channel}`, ephemeral: true });
        }

        if (interaction.customId === 'ticket_claim') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          db.prepare('UPDATE tickets SET claimed_by = ?, status = ? WHERE channel_id = ?').run(interaction.user.id, 'claimed', interaction.channel.id);
          return interaction.reply({ embeds: [baseEmbed('🎟️ Ticket übernommen', `${interaction.user} hat das Ticket übernommen.`)] });
        }

        if (interaction.customId === 'ticket_release') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          db.prepare('UPDATE tickets SET claimed_by = NULL, status = ? WHERE channel_id = ?').run('open', interaction.channel.id);
          return interaction.reply({ embeds: [baseEmbed('🎟️ Ticket freigegeben', `${interaction.user} hat das Ticket freigegeben.`)] });
        }

        if (interaction.customId === 'ticket_add_user') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          const modal = new ModalBuilder().setCustomId('ticket_add_user_modal').setTitle('User zum Ticket hinzufügen');
          modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('ticket_user_id').setLabel('Discord User ID').setStyle(TextInputStyle.Short).setRequired(true)));
          return interaction.showModal(modal);
        }

        if (interaction.customId === 'ticket_remove_user') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          const modal = new ModalBuilder().setCustomId('ticket_remove_user_modal').setTitle('User aus Ticket entfernen');
          modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('ticket_user_id').setLabel('Discord User ID').setStyle(TextInputStyle.Short).setRequired(true)));
          return interaction.showModal(modal);
        }

        if (interaction.customId === 'ticket_close_button') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          await interaction.reply({ content: '🧾 Transkript wird erstellt...', ephemeral: true });
          const messages = await interaction.channel.messages.fetch({ limit: 100 });
          const transcript = [...messages.values()].reverse().map((m) => `[${new Date(m.createdTimestamp).toISOString()}] ${m.author.tag}: ${m.content || '[Embed/Anhang]'}`).join('\n');
          const logId = getSetting(interaction.guild.id, 'ticket_log_channel');
          const logCh = logId ? interaction.guild.channels.cache.get(logId) : null;
          if (logCh) await logCh.send({ files: [{ attachment: Buffer.from(transcript || 'Leer'), name: `${interaction.channel.name}-transkript.txt` }] });
          db.prepare('UPDATE tickets SET status = ? WHERE channel_id = ?').run('closed', interaction.channel.id);
          await interaction.channel.delete('Ticket geschlossen').catch(() => null);
        }

        if (interaction.customId === 'rr_gamer' || interaction.customId === 'rr_news') {
          const key = interaction.customId === 'rr_gamer' ? 'rr_gamer_role' : 'rr_news_role';
          const roleId = getSetting(interaction.guild.id, key);
          const role = roleId ? interaction.guild.roles.cache.get(roleId) : null;
          if (!role) return interaction.reply({ content: '❌ Rolle nicht konfiguriert.', ephemeral: true });
          if (interaction.member.roles.cache.has(role.id)) {
            await interaction.member.roles.remove(role);
            return interaction.reply({ content: `➖ Rolle ${role} entfernt.`, ephemeral: true });
          }
          await interaction.member.roles.add(role);
          return interaction.reply({ content: `➕ Rolle ${role} hinzugefügt.`, ephemeral: true });
        }

        if (interaction.customId === 'open_captcha_modal') {
          const code = String(Math.floor(1000 + Math.random() * 9000));
          captchaCodes.set(interaction.user.id, code);
          const modal = new ModalBuilder().setCustomId('captcha_modal').setTitle('Captcha Verifizierung');
          modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('captcha_input').setLabel(`Bitte Code eingeben: ${code}`).setStyle(TextInputStyle.Short).setRequired(true)));
          await interaction.showModal(modal);
        }

        if (interaction.customId === 'open_suggestion_modal') {
          const modal = new ModalBuilder().setCustomId('suggestion_modal').setTitle('Vorschlag einreichen');
          modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('title').setLabel('Titel').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('content').setLabel('Beschreibung').setStyle(TextInputStyle.Paragraph).setRequired(true))
          );
          await interaction.showModal(modal);
        }

        if (interaction.customId === 'open_apply_modal') {
          const modal = new ModalBuilder().setCustomId('apply_modal').setTitle('Team-Bewerbung');
          modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('experience').setLabel('Deine Erfahrung').setStyle(TextInputStyle.Paragraph).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('motivation').setLabel('Motivation').setStyle(TextInputStyle.Paragraph).setRequired(true))
          );
          await interaction.showModal(modal);
        }

        if (interaction.customId === 'verify_me') {
          const verifyRoleId = getSetting(interaction.guild.id, 'verify_role_id');
          const role = verifyRoleId ? interaction.guild.roles.cache.get(verifyRoleId) : interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === 'verifiziert');
          if (!role) return interaction.reply({ content: 'Keine Verify-Rolle konfiguriert.', ephemeral: true });
          await interaction.member.roles.add(role);
          await interaction.reply({ content: '✅ Du wurdest verifiziert.', ephemeral: true });
        }

        if (interaction.customId === 'duty_on' || interaction.customId === 'duty_off') {
          await interaction.reply({ embeds: [baseEmbed('🕒 Duty-Status', `${interaction.user} ist jetzt **${interaction.customId === 'duty_on' ? 'im Dienst' : 'außer Dienst'}**.`)] });
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'ticket_dynamic_form') {
          const form = pendingTicketForms.get(interaction.user.id);
          if (!form) return interaction.reply({ content: '❌ Ticketformular abgelaufen. Bitte neu starten.', ephemeral: true });
          pendingTicketForms.delete(interaction.user.id);
          const answers = form.questions.map((_, i) => interaction.fields.getTextInputValue(`q${i + 1}`));
          const channel = await createTicketChannel(interaction, form.type, answers);
          return interaction.reply({ content: `✅ Ticket erstellt: ${channel}`, ephemeral: true });
        }

        if (interaction.customId === 'ticket_add_user_modal') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          const userId = interaction.fields.getTextInputValue('ticket_user_id').trim();
          const member = await interaction.guild.members.fetch(userId).catch(() => null);
          if (!member) return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
          await interaction.channel.permissionOverwrites.edit(userId, { ViewChannel: true, SendMessages: true });
          return interaction.reply({ embeds: [baseEmbed('➕ User hinzugefügt', `${member.user} hat jetzt Zugriff auf dieses Ticket.`)], ephemeral: true });
        }

        if (interaction.customId === 'ticket_remove_user_modal') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          const userId = interaction.fields.getTextInputValue('ticket_user_id').trim();
          const member = await interaction.guild.members.fetch(userId).catch(() => null);
          if (!member) return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
          await interaction.channel.permissionOverwrites.delete(userId).catch(() => null);
          return interaction.reply({ embeds: [baseEmbed('➖ User entfernt', `${member.user} wurde aus diesem Ticket entfernt.`)], ephemeral: true });
        }

        if (interaction.customId === 'captcha_modal') {
          const expected = captchaCodes.get(interaction.user.id);
          const input = interaction.fields.getTextInputValue('captcha_input').trim();
          if (!expected || input !== expected) return interaction.reply({ content: '❌ Captcha falsch. Bitte erneut versuchen.', ephemeral: true });
          captchaCodes.delete(interaction.user.id);
          const verifyRoleId = getSetting(interaction.guild.id, 'verify_role_id');
          const role = verifyRoleId ? interaction.guild.roles.cache.get(verifyRoleId) : null;
          if (role) await interaction.member.roles.add(role).catch(() => null);
          return interaction.reply({ content: '✅ Captcha erfolgreich, du bist verifiziert.', ephemeral: true });
        }

        if (interaction.customId === 'suggestion_modal') {
          const title = interaction.fields.getTextInputValue('title');
          const content = interaction.fields.getTextInputValue('content');
          db.prepare('INSERT INTO suggestions (guild_id, user_id, title, content) VALUES (?, ?, ?, ?)').run(interaction.guild.id, interaction.user.id, title, content);
          await interaction.reply({ content: '✅ Dein Vorschlag wurde gespeichert.', ephemeral: true });
        }

        if (interaction.customId === 'apply_modal') {
          const experience = interaction.fields.getTextInputValue('experience');
          const motivation = interaction.fields.getTextInputValue('motivation');
          const embed = new EmbedBuilder().setColor(config.embedColor).setTitle('📥 Neue Bewerbung').setDescription(`**User:** ${interaction.user}\n**Erfahrung:** ${experience}\n**Motivation:** ${motivation}`).setTimestamp();
          await interaction.channel.send({ embeds: [embed] });
          await interaction.reply({ content: '✅ Bewerbung abgesendet.', ephemeral: true });
        }
      }
    } catch (error) {
      logger.error(`Interaction-Fehler: ${error.stack || error.message}`);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Unerwarteter Fehler.', ephemeral: true }).catch(() => null);
      } else {
        await interaction.reply({ content: '❌ Unerwarteter Fehler.', ephemeral: true }).catch(() => null);
      }
    }
  }
};
