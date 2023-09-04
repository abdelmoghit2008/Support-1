const Discord = require('discord.js');

module.exports = {
  name: "unban",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["BAN_MEMBERS"],
  authorPermissions:["BAN_MEMBERS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    let user = args[0];
    if (!user) {
      return message
        .reply({
          content: `**Please mention member or ID**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });
    }

    // استبدال user بكائن يحتوي على معرف المستخدم
    const userId = user.replace(/[^0-9]/g, "");
    const bannedUsers = await message.guild.bans.fetch();
    const bannedUser = bannedUsers.find((u) => u.user.id === userId);
    if (!bannedUser) {
      return message
        .reply({
          content: `🤔 **I can't find <${user}> in the ban list**`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });
    }

    message.guild.members
      .unban(bannedUser.user)
      .then((m) => {
        message
          .reply({
            content: `:white_check_mark: **${m.username} Unbanned!**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`I couldn't reply to the message: ` + err.message);
          });
      })
      .catch((err) => {
        message
          .reply({
            content: `❌ **I can't find <@!${user}> in the ban list**`,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`I couldn't reply to the message: ` + err.message);
          });
      });
  }
};