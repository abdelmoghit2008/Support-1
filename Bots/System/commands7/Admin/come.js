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
  name: "come",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_MESSAGES"],
  authorPermissions:["MANAGE_MESSAGES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {

    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]));

    if (!args[0])
      return message
        .reply({
          content: `❗ **Please mention member or id.**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (!member)
      return message
        .reply({
          content: `❗ **I can't find this member...**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (member.id === message.member.id)
      return message
        .reply({
          content: `❗ **You can't send yourself...**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    let button = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Requested message")
        .setURL(`${message.url}`)
    );

    let embed = new MessageEmbed()
      .setDescription(
        `**Hello,<@${message.author.id}> requested you**\n**In :** <#${message.channel.id}>\n**Click on button below to go to it**`
      )
      .setColor(message.guild.me.displayColor);

    member
      .send({ embeds: [embed], components: [button] })
      .then(() => {
        message.reply(
          `:white_check_mark: **Done sended ${member.user.username} to come**`
        );
      })
      .catch(() => {
        message.reply(`:x: **I could not send the invitation message **`);
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
  }
};