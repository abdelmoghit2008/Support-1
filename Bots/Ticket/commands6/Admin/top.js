const Discord = require('discord.js');
const { Client, Collection, MessageEmbed, MessageButton, MessageActionRow, Intents } = require('discord.js');
const { Database } = require('st.db');
const ticketdb = require('../../../../Schema/BotsDB/TicketPointsDB');

module.exports = {
  name: 'top',
  aliases: ['', ''],
  description: '',
  usage: [''],
  botPermission: [''],
  authorPermission: ['MANAGE_MESSAGES'],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    try {
      const ServerData = await ticketdb.find({ guildID: message.guild.id });

      let money = ServerData.filter(data => typeof data.Points === 'number').sort((a, b) => b.Points - a.Points);
      money.length = 10;
      var finalLb = '';
      for (var i in money) {
        // Make sure 'Points' property is available and a valid number in 'money[i]' object
        if (money[i].Points && !isNaN(money[i].Points)) {
          const user = client.users.cache.get(money[i].User);
          if (user) {
            finalLb += `**#${parseInt(i) + 1} |** ${user} **>** \`${money[i].Points.toLocaleString()}\`\n`;
          } else {
            finalLb += `**#${parseInt(i) + 1} |** Unknown User **>** \`${money[i].Points.toLocaleString()}\`\n`;
          }
        }
      }

      const embed = new MessageEmbed()
        .setAuthor('Top claims points', client.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
        .setDescription(`
          ${finalLb}
        `);

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply('An error occurred while executing this command.');
    }
  }
};
