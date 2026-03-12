const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { baseEmbed } = require('../../utils/embed');
const { setSetting, getSetting } = require('../../utils/settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cfg020')
    .setDescription('Konfigurierbarer Modern-Command 020')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((o) => o.setName('wert').setDescription('Optionaler neuer Wert').setRequired(false)),
  async execute(interaction) {
    const key = 'cfg020_value';
    const value = interaction.options.getString('wert');

    if (value) {
      setSetting(interaction.guild.id, key, value);
      return interaction.reply({ embeds: [baseEmbed('⚙️ Konfig-Feature 020', `✅ Neuer Wert gesetzt: **${value}**`)], ephemeral: true });
    }

    const current = getSetting(interaction.guild.id, key, 'Nicht gesetzt');
    return interaction.reply({ embeds: [baseEmbed('⚙️ Konfig-Feature 020', `📌 Aktueller Wert: **${current}**

Mit 'wert' kannst du ihn ändern.`)], ephemeral: true });
  }
};
