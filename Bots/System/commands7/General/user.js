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

const moment = require(`moment`);

module.exports = {
  name: "user",
  aliases: [""],
  description: "",
  usage: [""],
  Guildaliases:[""],
  botPermission: [""],
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
    let embed = new MessageEmbed()

      .addFields({
        name: `Username :`,
        value: `${member.username}`,
        inline: true,
      })

      .addFields({
        name: `Tag :`,
        value: `${member.discriminator}`,
        inline: true,
      })

      .addFields({ name: `User id :`, value: `${member.id}`, inline: true })

      .addFields({
        name: `Nickname :`,
        value: message.guild.members.cache.find((e) => e.id == member.id)
          .nickname
          ? message.guild.members.cache.find((e) => e.id == member.id)
              .nickname
          : member.username,
        inline: true,
      })

      .addFields({
        name: `Bot :`,
        value: member.bot ? "true" : "false",
        inline: true,
      })

      .addFields({
        name: `Joined Discord :`,
        value: `${moment(member.createdAt)
          .toString()
          .substr(0, 15)} | ${moment(member.createdAt).fromNow()}`,
        inline: true,
      })

      .addFields([
        {
          name: `Joined Server :`,
          value: `${moment(member.joinedAt).toString().substr(0, 15)}`,
          inline: true,
        },
      ])

      .setColor('BLUE')
      .setAuthor(
        `${member.tag}`,
        member.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(member.displayAvatarURL({ dynamic: true }))

      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      );

    message.reply({ embeds: [embed] }).catch((err) => {
      console.log(`i couldn't reply to the message: ` + err.message);
    });
  }
};