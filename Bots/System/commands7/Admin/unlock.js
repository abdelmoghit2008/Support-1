const Discord = require('discord.js');

module.exports = {
  name: "unlock",
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
          SEND_MESSAGES: true,
        })
        .then(() => {
          message.reply({
            content: `:unlock: **<#${message.channel.id}> has been unlocked.**`,
            ephemeral: true,
          });
        });
  }
};