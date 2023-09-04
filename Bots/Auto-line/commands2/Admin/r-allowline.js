const Discord = require('discord.js');
const { Database } = require("st.db")
const autolinedb = require("../../../../Schema/BotsDB/Autoline")

module.exports = {
  name: "remove-allowline",
  aliases: ["r-allowline"],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
      const embed2 = new Discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`❗  __**Please mention/ID of channel!**__`);

      const embed3 = new Discord.MessageEmbed()
        .setColor(`#ff0000`)
        .setDescription(`❌ __**The channel must be Text Channel**__`);

      const embed4 = new Discord.MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`❗ __**This is not line Channel!**__`);

      let channel = message.content.split(' ').slice(1)[0];
      if (!channel) return message.reply({ embeds: [embed2] });

      channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);

      if (!channel || channel.type !== 'GUILD_TEXT') return message.reply({ embeds: [embed3] });

      const ServerData = await autolinedb.findOne({ guildID: message.guild.id });
      if (!ServerData || !ServerData.allowedchannels.includes(channel.id)) {
        return message.reply({ embeds: [embed4] });
      }
  
      const updatedChannels = ServerData.allowedchannels.filter((ch) => ch !== channel.id);
      ServerData.allowedchannels = updatedChannels;
      await ServerData.save();
  


      message.reply(`Done ✅\nChannel: ${channel}`);
  }
};
