const Discord = require('discord.js');

module.exports = {
  name: "unban-all",
  aliases: [],
  description: "Unban all banned users from the server.",
  usage: [],
  botPermission: ["BAN_MEMBERS"],
  authorPermissions:["BAN_MEMBERS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    try {
      const bannedUsers = await message.guild.bans.fetch();
      if (bannedUsers.size === 0) {
        return message
          .reply({
            content: "❌ There are no banned users in this server.",
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`I couldn't reply to the message: ` + err.message);
          });
      }
  
      let unbannedCount = 0;
  
      bannedUsers.forEach(async (bannedUser) => {
        try {
           message.guild.members.unban(bannedUser.user);
           unbannedCount += 1
           console.log(unbannedCount)
        } catch (err) {
          console.error(`Error unbanning user ${bannedUser.user.tag}: ${err}`);
        }
      })
  
      await message.reply({
          content: `✔ Unbanned \`${unbannedCount}\` users successfully.`,
          ephemeral: true,
        })
        .catch((err) => {
          console.log(`I couldn't reply to the message: ` + err.message);
        });
    } catch (error) {
      
    }
  }
};
