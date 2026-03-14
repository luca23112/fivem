const db = require('../utils/database');
const { getBoolSetting } = require('../utils/settings');

const BADWORDS = ['hurensohn', 'idiot', 'opfer'];

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.guild || message.author.bot) return;

    const counting = db.prepare('SELECT * FROM counting_settings WHERE guild_id = ?').get(message.guild.id);
    if (counting?.channel_id && message.channel.id === counting.channel_id) {
      const expected = counting.current_number + 1;
      const parsed = Number(message.content.trim());

      if (parsed !== expected || counting.last_user_id === message.author.id) {
        await message.react('❌');
        return;
      }

      db.prepare('UPDATE counting_settings SET current_number = ?, last_user_id = ? WHERE guild_id = ?')
        .run(expected, message.author.id, message.guild.id);
      await message.react('✅');
      return;
    }

    const spamEnabled = getBoolSetting(message.guild.id, 'automod_spam', false);
    const capsEnabled = getBoolSetting(message.guild.id, 'automod_caps', false);
    const badwordsEnabled = getBoolSetting(message.guild.id, 'automod_badwords', false);

    if (spamEnabled && message.content.length > 10 && /(.)\1{7,}/i.test(message.content)) {
      await message.delete().catch(() => null);
      await message.channel.send({ content: `${message.author}, bitte kein Spam.` }).then((m) => setTimeout(() => m.delete().catch(() => null), 5000));
      return;
    }

    if (capsEnabled && message.content.length > 8) {
      const letters = message.content.replace(/[^a-zA-Z]/g, '');
      if (letters.length > 6) {
        const upperRatio = letters.split('').filter((c) => c === c.toUpperCase()).length / letters.length;
        if (upperRatio > 0.75) {
          await message.delete().catch(() => null);
          await message.channel.send({ content: `${message.author}, bitte nicht so viel CAPS.` }).then((m) => setTimeout(() => m.delete().catch(() => null), 5000));
          return;
        }
      }
    }

    if (badwordsEnabled && BADWORDS.some((w) => message.content.toLowerCase().includes(w))) {
      await message.delete().catch(() => null);
      await message.channel.send({ content: `${message.author}, Sprache bitte anpassen.` }).then((m) => setTimeout(() => m.delete().catch(() => null), 5000));
      return;
    }

    if (getBoolSetting(message.guild.id, 'levels_enabled', true)) {
      const user = db.prepare('SELECT xp, level FROM levels WHERE guild_id = ? AND user_id = ?').get(message.guild.id, message.author.id);
      const gain = Math.floor(Math.random() * 10) + 8;
      if (!user) {
        db.prepare('INSERT INTO levels (guild_id, user_id, xp, level) VALUES (?, ?, ?, 1)').run(message.guild.id, message.author.id, gain);
      } else {
        const nextXp = user.xp + gain;
        const needed = user.level * 100;
        if (nextXp >= needed) {
          db.prepare('UPDATE levels SET xp = ?, level = level + 1 WHERE guild_id = ? AND user_id = ?')
            .run(nextXp - needed, message.guild.id, message.author.id);
          await message.channel.send(`🎉 ${message.author}, du bist jetzt Level **${user.level + 1}**!`).catch(() => null);
        } else {
          db.prepare('UPDATE levels SET xp = ? WHERE guild_id = ? AND user_id = ?').run(nextXp, message.guild.id, message.author.id);
        }
      }
    }
  }
};
