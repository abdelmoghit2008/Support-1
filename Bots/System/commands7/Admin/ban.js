const Discord = require('discord.js');

module.exports = {
  name: "ban",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["BAN_MEMBERS"],
  authorPermissions:["BAN_MEMBERS"],
  cooldowns: [],
  ownerOnly: true,
  run: async (client, message, args) => {
    if (args.length < 1) {
      return message.reply({
        content: `❗ **Please specify a user to ban**`,
        ephemeral: true,
      }).catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
    }

    let user = args[0];
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(user);
    if (!member && !user.match(/^\d+$/))
      return message
        .reply({
          content: `⁉ **I can't find this member**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (user.match(/^\d+$/)) {
      try {
        await message.guild.members.ban(user);
        return message
          .reply({
            content: `:white_check_mark: **<@${user}> banned from the server!** :airplane:`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });
      } catch (error) {
        console.log(error);
        message
          .reply({
            content: `❗ **Failed to ban <@${user}>**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });
      }
    } else {
      if (member.id === message.member.id)
        return message
          .reply({
            content: `**You can't ban ${member.user.username}**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });

      if (
        message.member.roles.highest.position <
        member.roles.highest.position
      )
        return message
          .reply({
            content: `❌ **You can't ban ${member.user.username} have higher role than you**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });

      if (!guilds)
        return message
          .reply({
            content: `❗ **I couldn't ban that user. Please check my permissions and role position.**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });

      if (!member.bannable)
        return message
          .reply({
            content: `❗ **You can't ban ${member.user.username}**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });

      try {
        await member.ban();
        return message
          .reply({
            content: `:white_check_mark: **${member.user.username} banned from the server!** :airplane:`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });
      } catch (error) {
        console.log(error);
        message
          .reply({
            content: `❗ **Failed to ban ${member.user.username}**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });
      }
    }
  
  }
};