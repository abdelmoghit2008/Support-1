const Discord = require('discord.js');
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
  name: "avatar",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_CHANNELS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {

    let member;
    if (message.mentions.users.size > 0) {
      member = message.mentions.members.first().user;
    } else if (args[1]) {
      try {
        member = await message.guild.members.fetch(args[1]);
        member = member.user;
      } catch (error) {
        console.log(`Couldn't fetch member: ${error}`);
        return message.reply("I couldn't find that user.");
      }
    } else {
      member = message.author;
    }

    const avatar = member.displayAvatarURL({ size: 1024, dynamic: true });
    const button = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Download")
        .setURL(avatar)
    );

    const embed = new MessageEmbed()
      .setAuthor(member.tag, member.displayAvatarURL({ dynamic: true }))
      .setTitle("Avatar Link")
      .setURL(avatar)
      .setImage(avatar)
      .setColor(message.guild.me.displayColor)
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      );

    try {
      message.reply({ embeds: [embed], components: [button] });
    } catch (err) {
      console.log(`I couldn't reply to the message: ${err.message}`);
    }
  }
};