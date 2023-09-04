const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js");
const prefix = '!';

module.exports = {
  name: "role",
  aliases: ["", ""],
  description: "add/remove role from user",
  usage: ["!role [user] [role]"],
  botPermission: ["MANAGE_ROLES"],
  authorPermission: ["MANAGE_ROLES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args, config) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!args[0]) return message.reply({ content: `**[prefix]role <user> <role>**` });
    if (!member) return message.reply({ content: `❌ **I can not find this member!**` });
    if (message.member.roles.highest.position <= member.roles.highest.position && !message.member.permissions.has('ADMINISTRATOR'))
      return message.reply({ content: `❌ **You can not add role to this user beacuse thier role higher/equal to yours**` })
    let role = message.mentions.roles.first() || message.guild.roles.cache.find(r =>
      r.name.toLocaleLowerCase().includes(args[1])) || message.guild.roles.cache.get(args[1])
    if (message.guild.me.roles.highest.position <= member.roles.highest.position)
      return message.reply({ content: `❌ **I can not add this role. role is higher/equal to my role**` })
    const embed5 = new Discord.MessageEmbed()
      .setColor(`#ff0000`)
      .setDescription(`❌ **I can not add this role. role is higher/equal to my role**`);
    if (!role) return message.reply({ content: `❌ **Mention the role **` })
    if (!member.roles.cache.has(role.id)) {
      member.roles.add(role.id)
      return message.reply({ content: `✔ **Added  ${role.name} role to ${member.user.username} Successfully**` })

    } else {
      member.roles.remove(role.id)
      return message.reply({ content: `✔ **Removed ${role.name} role from ${member.user.username} Successfully**` }).catch(async (error) => { return console.log(error.message) })
    }
  }
}

