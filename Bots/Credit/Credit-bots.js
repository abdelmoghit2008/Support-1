const {
  Client,
  Collection,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  Intents,
} = require("discord.js");
const Discord = require("discord.js");
const client5 = new Client({ intents: 32767 });
const { Database } = require("st.db");
const db2 = new Database("/Json-tokens/Tokens.json");
const creditdb = new Database("/Json-db/Bots/CreditDB.json");
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let credit = db2.get("credit") || [];
const path = require('path');
const { readdirSync } = require("fs");
const bankdb = require("../../Schema/BotsDB/Credit")
const jsonDB = new Database("/Json-db/Bots/CreditDB.json")

const runDB = new Database("/Json-db/Others/RunDB");


const captchas = [
  {
    image:
      "https://cdn.discordapp.com/attachments/822869973457960960/823511013747327036/captcha.png",
    Number: "99910",
  },
  {
    image:
      "https://media.discordapp.net/attachments/822869973457960960/823511111310639124/captcha.png",
    Number: "89725",
  },
  {
    image:
      "https://media.discordapp.net/attachments/822869973457960960/823511244350291968/captcha.png",
    Number: "72958",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347785226493972/captcha_8.png",
    Number: "87006",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347785557835816/captcha_9.png",
    Number: "29739",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347785977282642/captcha_10.png",
    Number: "67275",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347786430251028/captcha_11.png",
    Number: "86499",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347787021664256/captcha_12.png",
    Number: "12859",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347787600461934/captcha_13.png",
    Number: "46999",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347788141543505/captcha_14.png",
    Number: "68415",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347788577742868/captcha_15.png",
    Number: "32603",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347788976193546/captcha.png",
    Number: "19690",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347811923230721/captcha_1.png",
    Number: "26455",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347812372025365/captcha_2.png",
    Number: "11026",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347812724351058/captcha_3.png",
    Number: "17714",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347813101834280/captcha_4.png",
    Number: "13484",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347813521268808/captcha_5.png",
    Number: "17667",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347813869387848/captcha_6.png",
    Number: "60131",
  },
  {
    image:
      "https://cdn.discordapp.com/attachments/1104204102759616523/1108347814544678932/captcha_7.png",
    Number: "56409",
  },
];
function getCaptcha() {
  return captchas[Math.floor(Math.random() * captchas.length)];
}
credit.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client5 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")

  client5.commands = new Discord.Collection();
  client5.events = new Discord.Collection();
  require("../../handlers/Credit-commands")(client5);
  require("./handlers/events")(client5);

  client5.on('ready', async () => {
    const data = await jsonDB.get(`Credit_Status_${client5.user.id}`) || []
    const Activity = await data.Activity
    const type = await data.Type
    const botstatus = await data.Presence || "online"
    const statuses = [
      Activity
    ];

    client5.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
    client5.user.setPresence({
      status: botstatus,
    });
  });

  client5.Creditbotsslashcommands = new Collection();
  const Creditbotsslashcommands = [];


  client5.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Creditbotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand5');

  const ascii = require("ascii-table");
  const table = new ascii("autoline commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
  )) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
    )) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        Creditbotsslashcommands.push(command.data);
        client5.Creditbotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }

  client5.on(`messageCreate`, async (message) => {
    const prefix = prefixDB.get(`Prefix_${client5.user.id}_credit`)
    try {
      if (message.author.bot || message.channel.type === "dm" || !message.guild)
        return;
      if (
        message.content.startsWith(`${prefix}credit`) ||
        message.content.startsWith(`${prefix}credits`) ||
        message.content.startsWith(`c`) ||
        message.content.startsWith(`C`)
      ) {
        const args1 = message.content.split(" ");
        if (
          args1[0] !== `${prefix}credit` &&
          args1[0] !== `${prefix}credits` &&
          args1[0] !== `c` &&
          args1[0] !== `C`
        )
          return;
        const args = message.content.split(" ").slice(1).join(" ");
        const autherwalletData = await bankdb.findOne({ clientID: client5.user.id, "User.User": message.author.id });
        const autherwallet = autherwalletData ? autherwalletData.User.Credit : 0;
        let id = message.content.split(" ")[1];
        const member =
          message.mentions.members?.first() ||
          message.guild.members.cache.get(id);
        if (!member && args)
          return message.reply({
            content: `**:interrobang: | I can't find ${args}!**`,
            allowedMentions: { repliedUser: false },
          });
        if (member && member.user.bot)
          return message.reply({
            content: `:thinking:  | **${message.author.username}**, bots do not have credits!`,
            allowedMentions: { repliedUser: false },
          });
        if (!args)
          return message.reply({
            content: `:bank: | **${message.author.username}, your account balance is \`${autherwallet}\`.**`,
            allowedMentions: { repliedUser: false },
          });

        const userwalletDate = await bankdb.findOne({ clientID: client5.user.id, "User.User": member.id })
        const userwallet = member
          ? userwalletDate ? userwalletDate.User.Credit : 0
          : "";
        if (member && !message.content.split(" ").slice(2).join(" ")) {
          return message.reply({
            content: `**${member.user.username} 💳 balance is  \`${userwallet}\`.**`,
            allowedMentions: { repliedUser: false },
          });
        }

        if (member && message.content.split(" ").slice(2).join(" ")) {
          if (member.user.bot)
            return message.reply({
              content: `**:interrobang: | You can't transfer credits to a bot**`,
              allowedMentions: { repliedUser: false },
            });

          let args = message.content.split(" ").slice(2).join(" ");

          if (isNaN(args))
            return message.reply({
              content: `** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`,
              allowedMentions: { repliedUser: false },
            });

          const userwallet = await bankdb.findOne({ clientID: client5.user.id, "User.User": message.author.id }) || 0
          if (args > userwallet)
            return message
              .reply({
                content: `** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`,
                allowedMentions: { repliedUser: false },
              })
              .catch((err) => console.log(err));
          if (args <= 0)
            return message
              .reply({
                content: `** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`,
                allowedMentions: { repliedUser: false },
              })
              .catch((err) => console.log(err));

          if (!userwallet || userwallet === 0)
            return message.reply(
              `**Your balance is \`0\`, you can't transfer ${args}**`
            );
          const captcha = getCaptcha();
          const fee = Math.floor(
            message.content.split(" ").slice(2).join(" ") * (5 / 100)
          );
          await message
            .reply({
              content: `**${message.author.username
                }, Transfer Fees: \`${fee}\`, Amount :\`$${Math.floor(
                  args - fee
                )}\` **\ntype these numbers to confirm :`,
              files: [captcha.image],
            })
            .then(async (captchaID) => {
              jsonDB.set(`${message.author.id}_${message.guild.id}`, captchaID.id)
            });

          const filter = (m) => m.author.id === message.author.id;
          const response = await message.channel
            .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
            .catch(async () => {
              const oldcaptcha = jsonDB.get(
                `${message.author.id}_${message.guild.id}`
              );
              const fetchedMessage = await message.channel.messages
                .fetch(oldcaptcha)
                .catch(async (error) => {
                  return console.log(error);
                });
              if (fetchedMessage) {
                fetchedMessage.delete();
              }
            });

          if (response.first().content !== captcha.Number) {
            const oldcaptcha = jsonDB.get(
              `${message.author.id}_${message.guild.id}`
            );
            const fetchedMessage = await message.channel.messages
              .fetch(oldcaptcha)
              .catch(async (error) => {
                return console.log(error);
              });
            if (fetchedMessage) {
              fetchedMessage.delete();
            }
          } else {
            const oldcaptcha = jsonDB.get(
              `${message.author.id}_${message.guild.id}`
            );
            const fetchedMessage = await message.channel.messages
              .fetch(oldcaptcha)
              .catch(async (error) => {
                return console.log(error);
              });
            if (fetchedMessage) {
              fetchedMessage.delete();
            }

            response.first().delete();

            const userwalletDate = await bankdb.findOne({ clientID: client5.user.id, "User.User": member.id })

            const userwallet = userwalletDate ? userwalletDate.User.Credit : 0;

            const usernewAmount = parseInt(args - fee);

            const UsercurrentAmount = parseInt(userwallet)

            const userupdatedAmount = UsercurrentAmount + usernewAmount

            await bankdb.findOneAndUpdate(
              { clientID: client5.user.id, "User.User": member.id },
              { "User.Credit": userupdatedAmount },
              { upsert: true }
            );

            const autherwalletDate = await bankdb.findOne({ clientID: client5.user.id, "User.User": message.author.id })

            const authorwallet = autherwalletDate ? autherwalletDate.User.Credit : 0;

            const newAmount = parseInt(args);

            const currentAmount = parseInt(authorwallet)

            const updatedAmount = currentAmount - newAmount

            await bankdb.findOneAndUpdate(
              { clientID: client5.user.id, "User.User": message.author.id },
              { "User.Credit": updatedAmount },
              { upsert: true }
            );
            member
              .send(
                `:atm:  |  Transfer Receipt \`\`\`\nYou have received $${args - fee
                } from user ${message.author.username} (ID: ${message.author.id
                })\nReason: No reason provided\n\`\`\``
              )
              .catch((err) => null);

            message
              .reply(
                `**:moneybag: | ${message.author.username
                }, has transferred \`$${args - fee}\` to <@${member.id}>**`
              )
              .catch((err) => null);

          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  client5.login(data.token).catch(() => {
    let autofilter = credit.filter(a => a.BotID != data.BotID)
            db2.set(`credit` , autofilter)

  });
});


setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_credit');

    if (Array.isArray(botIDArray) && botIDArray.length > 0) {
      const botID = botIDArray.shift();

      if (botIDArray) {
        const database = db2.get(`credit`);
        if (database) {
          const DB = database.find(da => da.CLIENTID === botID);


          const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
          const Discord = require('discord.js');
          const client5 = new Client({ intents: 32767 });
          const { REST } = require("@discordjs/rest")
          const { Routes } = require("discord-api-types/v9")

          client5.commands = new Discord.Collection();
          client5.events = new Discord.Collection();
          require("../../handlers/Credit-commands")(client5);
          require("./handlers/events")(client5);

          client5.on('ready', async () => {
            const data = await jsonDB.get(`Credit_Status_${client5.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
            const statuses = [
              Activity
            ];

            client5.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client5.user.setPresence({
              status: botstatus,
            });
          });

          client5.Creditbotsslashcommands = new Collection();
          const Creditbotsslashcommands = [];


          client5.on("ready", async () => {
            const rest = new REST({ version: "9" }).setToken(DB.token);
            (async () => {
              try {
                await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                  body: Creditbotsslashcommands,
                });
              } catch (error) {
                console.error(error);
              }
            })();
          });

          const folderPath = path.join(__dirname, 'slashcommand5');

          const ascii = require("ascii-table");
          const table = new ascii("autoline commands").setJustify();
          for (let folder of readdirSync(folderPath).filter(
            (folder) => !folder.includes(".")
          )) {
            for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
              f.endsWith(".js")
            )) {
              let command = require(`${folderPath}/${folder}/${file}`);
              if (command) {
                Creditbotsslashcommands.push(command.data);
                client5.Creditbotsslashcommands.set(command.data.name, command);
                if (command.data.name) {
                  table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
                  table.addRow(`/${command.data.name}`, "🔴 Not Working");
                }
              }
            }
          }

          client5.on(`messageCreate`, async (message) => {
            const prefix = prefixDB.get(`Prefix_${client5.user.id}_credit`)
            try {
              if (message.author.bot || message.channel.type === "dm" || !message.guild)
                return;
              if (
                message.content.startsWith(`${prefix}credit`) ||
                message.content.startsWith(`${prefix}credits`) ||
                message.content.startsWith(`c`) ||
                message.content.startsWith(`C`)
              ) {
                const args1 = message.content.split(" ");
                if (
                  args1[0] !== `${prefix}credit` &&
                  args1[0] !== `${prefix}credits` &&
                  args1[0] !== `c` &&
                  args1[0] !== `C`
                )
                  return;
                const args = message.content.split(" ").slice(1).join(" ");
                const autherwalletData = await bankdb.findOne({ clientID: client5.user.id, "User.User": message.author.id });
                const autherwallet = autherwalletData ? autherwalletData.User.Credit : 0;
                let id = message.content.split(" ")[1];
                const member =
                  message.mentions.members?.first() ||
                  message.guild.members.cache.get(id);
                if (!member && args)
                  return message.reply({
                    content: `**:interrobang: | I can't find ${args}!**`,
                    allowedMentions: { repliedUser: false },
                  });
                if (member && member.user.bot)
                  return message.reply({
                    content: `:thinking:  | **${message.author.username}**, bots do not have credits!`,
                    allowedMentions: { repliedUser: false },
                  });
                if (!args)
                  return message.reply({
                    content: `:bank: | **${message.author.username}, your account balance is \`${autherwallet}\`.**`,
                    allowedMentions: { repliedUser: false },
                  });

                const userwalletDate = await bankdb.findOne({ clientID: client5.user.id, "User.User": member.id })
                const userwallet = member
                  ? userwalletDate ? userwalletDate.User.Credit : 0
                  : "";
                if (member && !message.content.split(" ").slice(2).join(" ")) {
                  return message.reply({
                    content: `**${member.user.username} 💳 balance is  \`${userwallet}\`.**`,
                    allowedMentions: { repliedUser: false },
                  });
                }

                if (member && message.content.split(" ").slice(2).join(" ")) {
                  if (member.user.bot)
                    return message.reply({
                      content: `**:interrobang: | You can't transfer credits to a bot**`,
                      allowedMentions: { repliedUser: false },
                    });

                  let args = message.content.split(" ").slice(2).join(" ");

                  if (isNaN(args))
                    return message.reply({
                      content: `** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`,
                      allowedMentions: { repliedUser: false },
                    });

                  const userwallet = await bankdb.findOne({ clientID: client5.user.id, "User.User": message.author.id }) || 0
                  if (args > userwallet)
                    return message
                      .reply({
                        content: `** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`,
                        allowedMentions: { repliedUser: false },
                      })
                      .catch((err) => console.log(err));
                  if (args <= 0)
                    return message
                      .reply({
                        content: `** :interrobang: | ${message.author.username}, type the credit you need to transfer!**`,
                        allowedMentions: { repliedUser: false },
                      })
                      .catch((err) => console.log(err));

                  if (!userwallet || userwallet === 0)
                    return message.reply(
                      `**Your balance is \`0\`, you can't transfer ${args}**`
                    );
                  const captcha = getCaptcha();
                  const fee = Math.floor(
                    message.content.split(" ").slice(2).join(" ") * (5 / 100)
                  );
                  await message
                    .reply({
                      content: `**${message.author.username
                        }, Transfer Fees: \`${fee}\`, Amount :\`$${Math.floor(
                          args - fee
                        )}\` **\ntype these numbers to confirm :`,
                      files: [captcha.image],
                    })
                    .then(async (captchaID) => {
                      jsonDB.set(`${message.author.id}_${message.guild.id}`, captchaID.id)
                    });

                  const filter = (m) => m.author.id === message.author.id;
                  const response = await message.channel
                    .awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] })
                    .catch(async () => {
                      const oldcaptcha = jsonDB.get(
                        `${message.author.id}_${message.guild.id}`
                      );
                      const fetchedMessage = await message.channel.messages
                        .fetch(oldcaptcha)
                        .catch(async (error) => {
                          return console.log(error);
                        });
                      if (fetchedMessage) {
                        fetchedMessage.delete();
                      }
                    });

                  if (response.first().content !== captcha.Number) {
                    const oldcaptcha = jsonDB.get(
                      `${message.author.id}_${message.guild.id}`
                    );
                    const fetchedMessage = await message.channel.messages
                      .fetch(oldcaptcha)
                      .catch(async (error) => {
                        return console.log(error);
                      });
                    if (fetchedMessage) {
                      fetchedMessage.delete();
                    }
                  } else {
                    const oldcaptcha = jsonDB.get(
                      `${message.author.id}_${message.guild.id}`
                    );
                    const fetchedMessage = await message.channel.messages
                      .fetch(oldcaptcha)
                      .catch(async (error) => {
                        return console.log(error);
                      });
                    if (fetchedMessage) {
                      fetchedMessage.delete();
                    }

                    response.first().delete();

                    const userwalletDate = await bankdb.findOne({ clientID: client5.user.id, "User.User": member.id })

                    const userwallet = userwalletDate ? userwalletDate.User.Credit : 0;

                    const usernewAmount = parseInt(args - fee);

                    const UsercurrentAmount = parseInt(userwallet)

                    const userupdatedAmount = UsercurrentAmount + usernewAmount

                    await bankdb.findOneAndUpdate(
                      { clientID: client5.user.id, "User.User": member.id },
                      { "User.Credit": userupdatedAmount },
                      { upsert: true }
                    );

                    const autherwalletDate = await bankdb.findOne({ clientID: client5.user.id, "User.User": message.author.id })

                    const authorwallet = autherwalletDate ? autherwalletDate.User.Credit : 0;

                    const newAmount = parseInt(args);

                    const currentAmount = parseInt(authorwallet)

                    const updatedAmount = currentAmount - newAmount

                    await bankdb.findOneAndUpdate(
                      { clientID: client5.user.id, "User.User": message.author.id },
                      { "User.Credit": updatedAmount },
                      { upsert: true }
                    );
                    member
                      .send(
                        `:atm:  |  Transfer Receipt \`\`\`\nYou have received $${args - fee
                        } from user ${message.author.username} (ID: ${message.author.id
                        })\nReason: No reason provided\n\`\`\``
                      )
                      .catch((err) => null);

                    message
                      .reply(
                        `**:moneybag: | ${message.author.username
                        }, has transferred \`$${args - fee}\` to <@${member.id}>**`
                      )
                      .catch((err) => null);

                  }
                }
              }
            } catch (error) {
              console.log(error);
            }
          });

          runDB.pull('Runs_credit', botID).then(() => {
            client5.login(DB.token).then(() => {
            }).catch((err) => {
              let autofilter = credit.filter(a => a != DB.BotID)
            db2.set(`credit` , autofilter)
            });
          })


        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}, 5000);