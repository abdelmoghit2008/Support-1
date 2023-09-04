const Discord = require('discord.js');

module.exports = {
  name: "kick",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["KICK_MEMBERS"],
  authorPermissions:["KICK_MEMBERS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    const member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);
    if (!args[0])
    return message
      .reply({
        content: `❗ **Please mention member or id**`,
        ephemeral: true,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
  if (!member)
    return message
      .reply({
        content: `❗ **I can't find this member**`,
        ephemeral: true,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });

  if (member.id === message.member.id)
    return message
      .reply({
        content: `❗ **You can't kick ${member.user.username}**`,
        ephemeral: true,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });

  if (
    message.member.roles.highest.position < member.roles.highest.position
  )
    return message
      .reply({
        content: `❗ **You can't kick ${member.user.username} have higher role than you**`,
        ephemeral: true,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
  return (
    (await member.kick()) +
    message
      .reply({
        content: `:white_check_mark: **${member.user.username} kicked from the server!**`,
        ephemeral: true,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      })
  ) 
  }
};