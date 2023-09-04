const Discord = require('discord.js');
const { Database } = require("st.db")
const autolinedb = require("../../../../Schema/BotsDB/Autoline")

module.exports = {
  name: "set-line",
  aliases: ["set-line"],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {

    const line = message.content.split(' ').slice(1)[0];
    if (!line || !(line.endsWith('.png') || line.endsWith('.jpg') || line.endsWith('.jpeg') || line.endsWith('.gif'))) {
      const nolineembed = new Discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`❗  __**Put a valid image Url !**__`);
      return message.reply({ embeds: [nolineembed] });
    }


    await autolinedb.findOneAndUpdate(
      { guildID: message.guild.id },
      { line: line },
      { upsert: true }
    );

    const done = new Discord.MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(`__**Done setuped your server line**__`)
      .setImage(`${line}`);

    return message.reply({ embeds: [done] });
  }
};
