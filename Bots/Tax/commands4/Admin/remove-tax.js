const Discord = require("discord.js");
const {
  Client,
  Collection,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  Intents,
  Modal,
  TextInputComponent,
} = require("discord.js");

const { Database } = require("st.db");
const taxdb = require("../../../../Schema/BotsDB/Tax")

module.exports = {
  name: "remove-tax",
  aliases: ["r-tax", ""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    try {
    const embed1 = new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setDescription(`❌ ** You dont have Premission - [ADMINISTRATOR]**`);

    const embed2 = new Discord.MessageEmbed()
      .setColor(`YELLOW`)
      .setDescription(`❗  __**Please mention/ID of channel!**__`);

    const embed3 = new Discord.MessageEmbed()
      .setColor(`#ff0000`)
      .setDescription(`❌ __**The channel must be Text Channel**__`);

    const embed4 = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setDescription(`❗ __**This is not auto tax Channel!**__`);

    const embed5 = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(
        `❌ ** An error occurred while removing the auto tax channel**`
      );

    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply({ embeds: [embed1] });
    }
      let channel = message.content.split(" ").slice(1)[0];
      if (!channel) return message.reply({ embeds: [embed2] });
      channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(channel);
      if (!channel || channel.type !== "GUILD_TEXT")
        return message.reply({ embeds: [embed3] });



        const ServerData = await taxdb.findOne({ guildID: message.guild.id });
      if (!ServerData || !ServerData.channels.includes(channel.id)) {
        return message.reply({ embeds: [embed4] });
      }
  
      const updatedChannels = ServerData.channels.filter((ch) => ch !== channel.id);
      ServerData.channels = updatedChannels;
      await ServerData.save();

    const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`✅ **Done**\nRemoved Channel: ${channel}`);
    message.reply({embeds: [embed]});

    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [embed5] });
    }
  },
};
