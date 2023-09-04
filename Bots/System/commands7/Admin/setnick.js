const Discord = require('discord.js');

module.exports = {
  name: "setnick",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_NICKNAMES"],
  authorPermissions:["MANAGE_NICKNAMES"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client2, message, args) => {
    const member =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));

  const permission = message.member.permissions.has("MANAGE_NICKNAMES");
  const guilds = message.guild.me.permissions.has("MANAGE_NICKNAMES");
  if (!permission)
    return message
      .reply({
        content: ":x: **You don't have permission to use this command**",
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });

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
  if (
    message.member.roles.highest.position < member.roles.highest.position
  )
    return message.reply({
      content: `❗ **${member.user.username} have higher role than you**`,
    });
  if (!guilds)
    return message
      .reply({
        content: `❗ **I couldn't timeout that user. Please check my permissions and role position.**`,
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
  let name = args.slice(1).join(" ");
  if (!name) {
    member.setNickname(` `).then(() => {
      message.reply(
        `:white_check_mark: **${member.user.username}** nickname has been reset`
      );
    });
  } else {
    member
      .setNickname(`${name}`)
      .then(() => {
        message.reply(
          `:white_check_mark: **${member.user.username}** nickname has been changed to **${name}**`
        );
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
  }

  }
};