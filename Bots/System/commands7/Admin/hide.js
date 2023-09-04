const Discord = require('discord.js');

module.exports = {
  name: "hide",
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
          VIEW_CHANNEL: false,
        })
        .then(() => {
          message
            .reply({
              content: `:white_check_mark: **<#${message.channel.id}> has been hidden.**`,
              ephemeral: true,
            })
            .catch((err) => {
              console.log(`i couldn't reply to the message: ` + err.message);
            });
        });
  }
};