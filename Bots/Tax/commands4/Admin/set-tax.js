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
const taxdb = require("../../../../Schema/BotsDB/Tax")

module.exports = {
  name: "set-tax",
  aliases: ["", ""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    try {
      const embed2 = new Discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`❗  __**Please mention/ID of channel!**__`);

      const embed3 = new Discord.MessageEmbed()
        .setColor(`#ff0000`)
        .setDescription(`❌ __**The channel must be a Text Channel**__`);

      const embed4 = new Discord.MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`❗ __**This is an auto tax Channel!**__`);

      const embed5 = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`❌ ** An error occurred while setting up the auto tax channel**`);

      let channel = message.content.split(' ').slice(1)[0]

      if (!channel) return message.reply({ embeds: [embed2] });

      channel = message.mentions.channels.first() || message.guild.channels.cache.get(channel)

      if (!channel || channel.type !== 'GUILD_TEXT') {
        return message.reply({ embeds: [embed3] });
      }

      const ServerData = await taxdb.findOne({ guildID: message.guild.id });
      if (!ServerData) {
        await taxdb.findOneAndUpdate(
          { guildID: message.guild.id },
          { channels: channel.id },
          { upsert: true }
        );
      } else {
        if (!ServerData.channels.includes(channel.id)) {
          ServerData.channels.push(channel.id);
          await ServerData.save();
        } else {
          return message.reply(`[!] This is Auto-tax channel already`)
        }
      }

      const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`✅ **Done**\nAdded Channel: ${channel}`);

      message.reply({ embeds: [embed] })
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [embed5] });
    }
  }
}