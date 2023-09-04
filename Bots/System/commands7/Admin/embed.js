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

module.exports = {
  name: "embed",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermissions:["MANAGE_GUILD"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    let args1 = args.slice(0).join(" ");

    if (!args1) {
      message.reply({ content: `❗ **Type something**` });
    }
    let embed = new MessageEmbed()
      .setAuthor(
        `${message.guild.name}`,
        message.guild.iconURL({ dynamic: true })
      )
      .setColor(message.guild.me.displayHexColor)
      .setTimestamp();

    let attach = message.attachments.first();
    if (attach) {
      embed.setImage(attach.proxyURL);
      if (args1) {
        embed.setDescription(`${args1}`);
      }
    }
    if (args1) {
      embed.setDescription(`${args1}`);
      message.channel.send({ embeds: [embed] }).then(() => {
        message.delete();
      });
    }
  }
};