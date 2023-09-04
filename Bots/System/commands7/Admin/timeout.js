const Discord = require('discord.js');
const ms = require("ms");

module.exports = {
  name: "timeout",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_ROLES"],
  authorPermissions:["MANAGE_ROLES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client2, message, args) => {
    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0]));

    if (!args[0])
      return message
        .reply({
          content: `❗ **Please mention a member or provide their id**`,
        })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });

    if (!member)
      return message
        .reply({ content: `❗ **I couldn't find this member**` })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });

    if (member.id === message.author.id)
      return message
        .reply({ content: `❗ **You can't use this command on yourself**` })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });

    if (
      message.member.roles.highest.position < member.roles.highest.position
    )
      return message
        .reply({
          content: `❗ **You can't timeout ${member.user.username}, they have a higher role than you**`,
        })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });


    if (
      !args[1] ||
      (!args[1].endsWith("s") &&
        !args[1].endsWith("m") &&
        !args[1].endsWith("h") &&
        !args[1].endsWith("d") &&
        !args[1].endsWith("w"))
    ) {
      return message
        .reply({
          content: `❗ **Please provide a valid time in the format of [number][s/m/h/d/w]**`,
        })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });
    }

    member
      .timeout(
        ms(args[1]),
        `Done by: ${message.member.nickname || message.author.username}, ${
          message.author.id
        }`
      )
      .then(() => {
        message.reply({
          content: `:white_check_mark: **Done timeout ${member.user.username} for ${args[1]}**`,
        });
      })
      .catch((err) => {
        message.reply({
          content: `❗ **An error occurred while trying to timeout this member. Please try again later.**`,
        });
        console.log(
          `An error occurred while trying to timeout ${member.user.username}: ` +
            err.message
        );
      });
  }
};