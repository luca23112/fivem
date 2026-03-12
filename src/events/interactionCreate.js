const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField
} = require('discord.js');
const db = require('../utils/database');
const config = require('../config/config');
const logger = require('../utils/logger');
const { baseEmbed } = require('../utils/embed');
const { getSetting } = require('../utils/settings');

const captchaCodes = new Map();

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
      }

      if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_type_select') {
        const type = interaction.values[0];
        const categoryId = getSetting(interaction.guild.id, `ticket_category_${type}`);
        const roleId = getSetting(interaction.guild.id, `ticket_role_${type}`);

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

        await channel.send({ embeds: [baseEmbed('🎫 Ticket erstellt', `Typ: **${type.toUpperCase()}**\nBitte beschreibe dein Anliegen.`)] });
        await interaction.reply({ content: `✅ Ticket erstellt: ${channel}`, ephemeral: true });
      }

      if (interaction.isButton()) {
        if (interaction.customId === 'open_ticket') {
          const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
              { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
              { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
          });
          await channel.send({ embeds: [baseEmbed('🎫 Ticket erstellt', 'Ein Teammitglied wird sich gleich melden.')] });
          await interaction.reply({ content: `Ticket erstellt: ${channel}`, ephemeral: true });
        }

        if (interaction.customId === 'ticket_close_button') {
          if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Nur in Ticketkanälen.', ephemeral: true });
          await interaction.reply({ content: '🧾 Transkript wird erstellt...', ephemeral: true });
          const messages = await interaction.channel.messages.fetch({ limit: 100 });
          const transcript = [...messages.values()].reverse().map((m) => `[${new Date(m.createdTimestamp).toISOString()}] ${m.author.tag}: ${m.content || '[Embed/Anhang]'}`).join('\n');
          const logId = getSetting(interaction.guild.id, 'ticket_log_channel');
          const logCh = logId ? interaction.guild.channels.cache.get(logId) : null;
          if (logCh) await logCh.send({ files: [{ attachment: Buffer.from(transcript || 'Leer'), name: `${interaction.channel.name}-transkript.txt` }] });
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
          modal.addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('captcha_input')
                .setLabel(`Bitte Code eingeben: ${code}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          );
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
          const embed = baseEmbed('🕒 Duty-Status', `${interaction.user} ist jetzt **${interaction.customId === 'duty_on' ? 'im Dienst' : 'außer Dienst'}**.`);
          await interaction.reply({ embeds: [embed] });
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'captcha_modal') {
          const expected = captchaCodes.get(interaction.user.id);
          const input = interaction.fields.getTextInputValue('captcha_input').trim();
          if (!expected || input !== expected) {
            return interaction.reply({ content: '❌ Captcha falsch. Bitte erneut versuchen.', ephemeral: true });
          }
          captchaCodes.delete(interaction.user.id);
          const verifyRoleId = getSetting(interaction.guild.id, 'verify_role_id');
          const role = verifyRoleId ? interaction.guild.roles.cache.get(verifyRoleId) : null;
          if (role) await interaction.member.roles.add(role).catch(() => null);
          return interaction.reply({ content: '✅ Captcha erfolgreich, du bist verifiziert.', ephemeral: true });
        }


        if (interaction.customId === 'suggestion_modal') {
          const title = interaction.fields.getTextInputValue('title');
          const content = interaction.fields.getTextInputValue('content');
          db.prepare('INSERT INTO suggestions (guild_id, user_id, title, content) VALUES (?, ?, ?, ?)')
            .run(interaction.guild.id, interaction.user.id, title, content);
          await interaction.reply({ content: '✅ Dein Vorschlag wurde gespeichert.', ephemeral: true });
        }

        if (interaction.customId === 'apply_modal') {
          const experience = interaction.fields.getTextInputValue('experience');
          const motivation = interaction.fields.getTextInputValue('motivation');
          const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('📥 Neue Bewerbung')
            .setDescription(`**User:** ${interaction.user}\n**Erfahrung:** ${experience}\n**Motivation:** ${motivation}`)
            .setTimestamp();
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
