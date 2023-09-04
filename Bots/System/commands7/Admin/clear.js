const Discord = require('discord.js');

module.exports = {
  name: "clear",
  aliases: ["c"],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_CHANNELS"],
  authorPermissions:["MANAGE_CHANNELS"],
  cooldowns: [],
  ownerOnly: true,
  run: async (client, message, args) => {
    
    args[1] = args[0] ? parseInt(args[0]) : 100;
    if (isNaN(args[0]))
      return message
        .reply({ content: `Please provide valid number` })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    if (args[1] > 100)
      return message
        .reply({
          content: `❗ **You can't delete more than __100__ messages**`,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });
    if (args[1] < 2)
      return message
        .reply({
          content: `❗ **You need to delete at least __2__ messages**`,
        })
        .catch((err) => {
          console.log(`i couldn't reply to the message: ` + err.message);
        });

    let messages = await message.channel.messages.fetch({ limit: args[1] });
    messages = messages.filter(
      (m) =>
        Date.now() - new Date(m.createdTimestamp).getTime() <=
        14 * 24 * 60 * 60000
    );
    message.channel
      .bulkDelete(messages)
      .catch((err) => console.log(err.message));

    message.channel
      .send(
        `
    Deleting \`\`${messages.size}\`\` messages .
    `
      )
      .then((replymessage) => {
        setTimeout(() => replymessage.delete(), 3000);
      })
      .catch((err) => {
        console.log(`i couldn't reply to the message: ` + err.message);
      });
  }
};