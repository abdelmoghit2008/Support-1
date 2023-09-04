const Discord = require('discord.js');

module.exports = {
  name: "untimeout",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MODERATE_MEMBERS"],
  authorPermissions:["MODERATE_MEMBERS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client2, message, args) => {
    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]));


    if (!args[0])
      return message
        .reply({ content: `❗ **Please mention member or id**` })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (!member)
      return message
        .reply({ content: `❗ **I can't find this member**` })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (member.id === message.author.id)
      return message
        .reply({ content: `❗ **You can't use this on your self**` })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (
      message.member.roles.highest.position < member.roles.highest.position
    )
      return message
        .reply({
          content: `❗ **You can't timeout ${member.user.username} have higher role than you**`,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (!guilds)
      return message
        .reply({
          content: `❗ **I couldn't timeout that user. Please check my permissions and role position.**`,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });
    member
      .timeout(
        ms("1s"),
        `done by: ${message.member.nickname} , ${message.author.id}`
      )
      .then(() => {
        message.reply({
          content: `:white_check_mark: **Done untimeout ${member.user.username}**`,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};