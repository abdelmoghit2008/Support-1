const Discord = require('discord.js');

module.exports = {
  name: "lock",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_CHANNELS"],
  authorPermissions:["MANAGE_CHANNELS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client2, message, args) => {
    let everyone = message.guild.roles.cache.find(
      (hyper) => hyper.name === "@everyone"
    );
    message.channel.permissionOverwrites
      .edit(everyone, {
        SEND_MESSAGES: false,
      })
      .then(() => {
        message
          .reply({
            content: `:lock: **<#${message.channel.id}> has been looked.** `,
            ephemeral: true,
          })
          .catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message);
          });
      });
  }
};