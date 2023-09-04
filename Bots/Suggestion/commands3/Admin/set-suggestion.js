const Discord = require('discord.js')
const {
  Client,
  Collection,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  Intents,
  Modal,
  TextInputComponent
} = require("discord.js");

const { Database } = require("st.db")
const suggestiondb = require("../../../../Schema/BotsDB/Suggestion")

module.exports = {
  name: "set-suggestion",
  aliases: ["", ""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    let channel = message.content.split(' ').slice(1)[0];
    if (!channel) {
      const embed = new Discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`❗  __**Please mention/ID of channel!**__`);
      return message.reply({ embeds: [embed] }).catch(console.error);
    }

    channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel);

    if (!channel || channel.type !== 'GUILD_TEXT') {
      const embed = new Discord.MessageEmbed()
        .setColor(`#ff0000`)
        .setDescription(`❌ __**The channel must be Text Channel**__`);
      return message.reply({ embeds: [embed] }).catch(console.error);
    }

    const ServerData = await suggestiondb.findOne({ guildID: message.guild.id });
      if(!ServerData){
        await suggestiondb.findOneAndUpdate(
          { guildID: message.guild.id },
          { channels: channel.id },
          { upsert: true }
        );
      }else{
        if (!ServerData.channels.includes(channel.id)) {
          ServerData.channels.push(channel.id);
          await ServerData.save();
        }else{
          return message.reply(`[!] This is Suggestion channel already`)
        }
      }

    const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`✅ **Done**\nAdded Channel: ${channel}`);
    message.reply({ embeds: [embed] }).catch(console.error);
  }
}