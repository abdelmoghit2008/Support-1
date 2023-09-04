const Discord = require('discord.js');

module.exports = {
  name: "send",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermissions:["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client2, message, args) => {
    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(args[1]));
    const msg = args.slice(1).join(" ");

    if (!args[0])
      return message
        .reply({ content: `❗ **Please mention/ID member**` })
        .catch((err) => {
          console.log(`I Couldn't reply to the message: ` + err.message);
        });

    if (!member)
      return message
        .reply({ content: `❗ **I can't find this member**` })
        .catch((err) => {
          console.log(`I Couldn't reply to the message: ` + err.message);
        });
    if (member) {
      if (!msg) return message.reply(`❗ **Type something to send**`);
      let image = message.attachments.first();
      if (image) {
        member
          .send({ content: `${msg}`, files: [image.proxyURL] })
          .then(() => {
            message
              .reply(`:white_check_mark: **Done sending the message**`)
              .catch((err) => {
                console.log(
                  `I Couldn't reply to the message: ` + err.message
                );
              });
          })
          .catch((err) => {
            message.reply(`:x: **User has closed private messages.**`);
          });
      } else {
        if (!msg) return message.reply(`❗ **Type something to send**`);
        member
          .send({ content: `${msg}` })
          .then(() => {
            message
              .reply(`:white_check_mark: **Done sending the message**`)
              .catch((err) => {
                console.log(
                  `I Couldn't reply to the message: ` + err.message
                );
              });
          })
          .catch((err) => {
            message
              .reply({
                content: `:x: **User has closed private messages.**`,
              })
              .catch((err) => {
                console.log(
                  `I Couldn't reply to the message: ` + err.message
                );
              });
          });
      }
    }
  }
};