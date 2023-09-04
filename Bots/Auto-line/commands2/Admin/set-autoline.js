const Discord = require('discord.js');
const { Database } = require("st.db")
const autolinedb = require("../../../../Schema/BotsDB/Autoline")

module.exports = {
  name: "set-autoline",
  aliases: ["set-autoline"],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
      let channel = message.content.split(' ').slice(1)[0];

      if (!channel) {
        const embed = new Discord.MessageEmbed()
          .setColor(`YELLOW`)
          .setDescription(`❗  __**Please mention/ID of channel!**__`);
        return message.reply({ embeds: [embed] });
      }

      channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);

      if (!channel || channel.type !== 'GUILD_TEXT') {
        const embed = new Discord.MessageEmbed()
          .setColor(`#ff0000`)
          .setDescription(`❌ __**The channel must be Text Channel**__`);
        return message.reply({ embeds: [embed] });
      }

      const ServerData = await autolinedb.findOne({ guildID: message.guild.id });
      if(!ServerData){
        await autolinedb.findOneAndUpdate(
          { guildID: message.guild.id },
          { channels: channel.id },
          { upsert: true }
        );
      }else{
        if (!ServerData.channels.includes(channel.id)) {
          ServerData.channels.push(channel.id);
          await ServerData.save();
        }{
          return message.reply(`[!] This is Autoline channel already`)
        }
      }
    
      message.reply(`Done ✅\nChannel: ${channel}`);

  }
};
