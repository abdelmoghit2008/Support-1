const Discord = require('discord.js');
const { Database } = require('st.db');
const ticketdb = require('../../../../Schema/BotsDB/TicketPointsDB');

module.exports = {
  name: 'reset-top',
  aliases: ['', ''],
  description: '',
  usage: [''],
  botPermission: [''],
  authorPermission: ['ADMINISTRATOR'],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    try {
      await ticketdb.deleteMany({ guildID: message.guild.id });

      const embed = new Discord.MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setDescription('**__تم حذف التوب لبوت التكت ✔__**');
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply('An error occurred while executing this command.');
    }
  },
};
