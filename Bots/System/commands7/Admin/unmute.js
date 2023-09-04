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

const ms = require("ms")

module.exports = {
  name: "unmute",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_ROLES"],
  authorPermissions:["MANAGE_ROLES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    const member =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
    if (!member)
    return message
      .reply({ content: `❗ **I can't find this member**` })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });

  if (member.id === message.member.id)
    return message
      .reply({ content: `❗ **You can't mute yourself**` })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });

  if (
    message.member.roles.highest.position < member.roles.highest.position
  )
    return message
      .reply({
        content: `❗ **You can't unmuted ${member.user.username} have higher role than you**`,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });

  let muteRole = message.guild.roles.cache.find(
    (role) => role.name == "Muted"
  );
  if (!member.roles.cache.some((role) => role.name == "Muted")) {
    message
      .reply({ content: `❗ **${member.user.username} is not muted.**` })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
  } else {
    member.roles.remove(muteRole);
    message
      .reply({
        content: `:white_check_mark: **${member.user.username} unmuted from the text!**`,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
    }  
}
};