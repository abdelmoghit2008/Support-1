const Discord = require('discord.js');

module.exports = {
  name: "roles",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_CHANNELS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    let roles = "```js\n";
    let names = message.guild.roles.cache.map((role) => `${role.name}`);
    let longest = names.reduce(
      (long, str) => Math.max(long, str.length),
      0
    );
    message.guild.roles.cache.forEach((role) => {
      roles += `${role.name}${" ".repeat(longest - role.name.length)} : ${
        role.members.size
      } members\n`;
    });

    roles += "```";

    message.reply({
      content: roles,
      allowedMentions: { repliedUser: false },
    });
  }
};