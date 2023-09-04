const { Database } = require("st.db")
const db2 = new Database("Json-tokens/Tokens.json")
const suggestiondb = require("../../Schema/BotsDB/Suggestion")
const jsonDB = new Database("/Json-db/Bots/SuggestionDB.json")

const runDB = new Database("/Json-db/Others/RunDB");


const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let suggestion = db2.get('suggestion') || []
const path = require('path');
const { readdirSync } = require("fs");

suggestion.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client3 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")



  client3.commands = new Discord.Collection();
  client3.events = new Discord.Collection();
  require("../../handlers/Suggestion-commands")(client3);
  require("./handlers/events")(client3);

  client3.on('ready', async () => {
    const data = await jsonDB.get(`suggestion_Status_${client3.user.id}`) || []
    const Activity = await data.Activity
    const type = await data.Type
    const botstatus = await data.Presence || "online"
    const statuses = [
      Activity
    ];

    client3.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
    client3.user.setPresence({
      status: botstatus,
    });
  });



  client3.Suggestionbotsslashcommands = new Collection();
  const Suggestionbotsslashcommands = [];


  client3.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Suggestionbotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand3');

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
        Suggestionbotsslashcommands.push(command.data);
        client3.Suggestionbotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }

  client3.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    if (!message.guild) return;
    const ServerData = await suggestiondb.findOne({ guildID: message.guild.id }) || []
    if (ServerData && ServerData.channels && !ServerData.channels.includes(message.channel.id)) return;

    try {
      if(ServerData.channels.includes(message.channel.id)){
        if (message.content.startsWith("https://")) {
          return message.delete();
        }
        const args = message.content.split(",");
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
          .setThumbnail(message.author.avatarURL({ dynamic: true }))
          .setColor("RANDOM")
          .setDescription(`> ${args[0]}`)
          .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }));
        const attachment = message.attachments.first();
        if (attachment) {
          embed.setImage(attachment.proxyURL);
        }
        message.delete();
        message.channel.send({ embeds: [embed] }).then(async (msg) => {
          const SugButtons = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`Yes_${msg.id}`)
              .setStyle(`SUCCESS`)
              .setEmoji(`✔`)
              .setLabel("0")
              .setDisabled(false),
            new MessageButton()
              .setCustomId(`No_${msg.id}`)
              .setStyle(`DANGER`)
              .setEmoji(`✖`)
              .setLabel("0")
              .setDisabled(false),
          ]);

          msg.edit({ components: [SugButtons] })
          if (ServerData && ServerData.line) return message.channel.send({ files: [ServerData.line] })


        });
      }

    } catch (err) {
      console.log(err);
    }
  });


  //YesVotes
  client3.on(`interactionCreate`, async i => {
    if (!i.isButton()) return
    try {
      const SugChannel = client3.channels.cache.get(i.channel.id)
      const SugMessage = SugChannel.messages.cache.get(i.message.id)

      const YesVotes = jsonDB.get(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`) || 0
      const NoVotes = jsonDB.get(`No_MembersVotes_${i.guild.id}_${i.message.id}`) || 0

      if (i.customId === `Yes_${i.message.id}`) {
        const check1 = jsonDB.get(`No_Members_${i.guild.id}_${i.message.id}`)
        const check = jsonDB.get(`Yes_Members_${i.guild.id}_${i.message.id}`)

        if (check1 && check1.includes(i.user.id)) {
          return i.reply({ content: `قم بسحب تصويتك من التصويتات بالرفض 🔴 ثم حاول مره اخري ❗`, ephemeral: true })
        }

        if (check && check.includes(i.user.id)) {
          const SugButtons = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`Yes_${i.message.id}`)
              .setStyle(`SUCCESS`)
              .setEmoji(`✔`)
              .setLabel(`${YesVotes - 1}`)
              .setDisabled(false),
            new MessageButton()
              .setCustomId(`No_${i.message.id}`)
              .setStyle(`DANGER`)
              .setEmoji(`✖`)
              .setLabel(`${NoVotes}`)
              .setDisabled(false),
          ]);
          SugMessage.edit({ components: [SugButtons] }).then(() => {
            jsonDB.pull(`Yes_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
              i.deferReply({ ephemeral: true }).then(() => {
                return i.editReply(`لقد سحبت تصويتك من الاقتراح`).then(() => {
                  jsonDB.set(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`, YesVotes - 1)
                })
              });
            })
          })
        } else {
          const SugButtons = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`Yes_${i.message.id}`)
              .setStyle(`SUCCESS`)
              .setEmoji(`✔`)
              .setLabel(`${YesVotes + 1}`)
              .setDisabled(false),
            new MessageButton()
              .setCustomId(`No_${i.message.id}`)
              .setStyle(`DANGER`)
              .setEmoji(`✖`)
              .setLabel(`${NoVotes}`)
              .setDisabled(false),
          ]);
          SugMessage.edit({ components: [SugButtons] }).then(() => {
            jsonDB.set(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`, YesVotes + 1).then(() => {
              jsonDB.push(`Yes_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                i.deferReply({ ephemeral: true }).then(() => {
                  i.editReply(`شكرا لمشاركتك بصوتك في الاقتراح`)
                });
              });
            })
          })
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  //NoVotes
  client3.on(`interactionCreate`, async i => {
    if (!i.isButton()) return
    try {
      const SugChannel = client3.channels.cache.get(i.channel.id)
      const SugMessage = SugChannel.messages.cache.get(i.message.id)

      const YesVotes = jsonDB.get(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`) || 0
      const NoVotes = jsonDB.get(`No_MembersVotes_${i.guild.id}_${i.message.id}`) || 0

      if (i.customId === `No_${i.message.id}`) {
        const check1 = jsonDB.get(`Yes_Members_${i.guild.id}_${i.message.id}`)
        const check = jsonDB.get(`No_Members_${i.guild.id}_${i.message.id}`)

        if (check1 && check1.includes(i.user.id)) {
          return i.reply({ content: `قم بسحب تصويتك من التصويتات بالموافقه 🟢 ثم حاول مره اخري ❗`, ephemeral: true })
        }

        if (check && check.includes(i.user.id)) {
          const SugButtons = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`Yes_${i.message.id}`)
              .setStyle(`SUCCESS`)
              .setEmoji(`✔`)
              .setLabel(`${YesVotes}`)
              .setDisabled(false),
            new MessageButton()
              .setCustomId(`No_${i.message.id}`)
              .setStyle(`DANGER`)
              .setEmoji(`✖`)
              .setLabel(`${NoVotes - 1}`)
              .setDisabled(false),
          ]);
          SugMessage.edit({ components: [SugButtons] }).then(() => {
            jsonDB.pull(`No_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
              i.deferReply({ ephemeral: true }).then(() => {
                return i.editReply(`لقد سحبت تصويتك من الاقتراح`).then(() => {
                  jsonDB.set(`No_MembersVotes_${i.guild.id}_${i.message.id}`, NoVotes - 1)
                })
              });
            })
          })
        } else {
          const SugButtons = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`Yes_${i.message.id}`)
              .setStyle(`SUCCESS`)
              .setEmoji(`✔`)
              .setLabel(`${YesVotes}`)
              .setDisabled(false),
            new MessageButton()
              .setCustomId(`No_${i.message.id}`)
              .setStyle(`DANGER`)
              .setEmoji(`✖`)
              .setLabel(`${NoVotes + 1}`)
              .setDisabled(false),
          ]);
          SugMessage.edit({ components: [SugButtons] }).then(() => {
            jsonDB.set(`No_MembersVotes_${i.guild.id}_${i.message.id}`, NoVotes + 1).then(() => {
              jsonDB.push(`No_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                i.deferReply({ ephemeral: true }).then(() => {
                  i.editReply(`شكرا لمشاركتك بصوتك في الاقتراح`)
                });
              });
            })
          })
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  client3.login(data.token).catch(() => {
    let autofilter = suggestion.filter(a => a.BotID != data.BotID)
              db2.set(`suggestion` , autofilter)

  });
});




setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_suggestion');

    if (Array.isArray(botIDArray) && botIDArray.length > 0) {
      const botID = botIDArray.shift();

      if (botIDArray) {
        const database = db2.get(`suggestion`);
        if (database) {
          const DB = database.find(da => da.CLIENTID === botID);

          const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
          const Discord = require('discord.js');
          const client3 = new Client({ intents: 32767 });
          const { REST } = require("@discordjs/rest")
          const { Routes } = require("discord-api-types/v9")



          client3.commands = new Discord.Collection();
          client3.events = new Discord.Collection();
          require("../../handlers/Suggestion-commands")(client3);
          require("./handlers/events")(client3);

          client3.on('ready', async () => {
            const data = await jsonDB.get(`suggestion_Status_${client3.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
            const statuses = [
              Activity
            ];

            client3.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client3.user.setPresence({
              status: botstatus,
            });
          });



          client3.Suggestionbotsslashcommands = new Collection();
          const Suggestionbotsslashcommands = [];


          client3.on("ready", async () => {
            const rest = new REST({ version: "9" }).setToken(DB.token);
            (async () => {
              try {
                await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                  body: Suggestionbotsslashcommands,
                });
              } catch (error) {
                console.error(error);
              }
            })();
          });

          const folderPath = path.join(__dirname, 'slashcommand3');

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
                Suggestionbotsslashcommands.push(command.data);
                client3.Suggestionbotsslashcommands.set(command.data.name, command);
                if (command.data.name) {
                  table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
                  table.addRow(`/${command.data.name}`, "🔴 Not Working");
                }
              }
            }
          }

          client3.on("messageCreate", async function (message) {
            if (message.author.bot) return;
            if (!message.guild) return;
            const ServerData = await suggestiondb.findOne({ guildID: message.guild.id }) || []
            if (ServerData && ServerData.channels && !ServerData.channels.includes(message.channel.id)) return;

            try {
              if (message.content.startsWith("https://")) {
                return message.delete();
              }
              const args = message.content.split(",");
              const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setThumbnail(message.author.avatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`> ${args[0]}`)
                .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }));
              const attachment = message.attachments.first();
              if (attachment) {
                embed.setImage(attachment.proxyURL);
              }
              message.delete();
              message.channel.send({ embeds: [embed] }).then(async (msg) => {
                const SugButtons = new MessageActionRow().addComponents([
                  new MessageButton()
                    .setCustomId(`Yes_${msg.id}`)
                    .setStyle(`SUCCESS`)
                    .setEmoji(`✔`)
                    .setLabel("0")
                    .setDisabled(false),
                  new MessageButton()
                    .setCustomId(`No_${msg.id}`)
                    .setStyle(`DANGER`)
                    .setEmoji(`✖`)
                    .setLabel("0")
                    .setDisabled(false),
                ]);

                msg.edit({ components: [SugButtons] })
                if (ServerData && ServerData.line) return message.channel.send({ files: [ServerData.line] })


              });
            } catch (err) {
              console.log(err);
            }
          });


          //YesVotes
          client3.on(`interactionCreate`, async i => {
            if (!i.isButton()) return
            try {
              const SugChannel = client3.channels.cache.get(i.channel.id)
              const SugMessage = SugChannel.messages.cache.get(i.message.id)

              const YesVotes = jsonDB.get(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`) || 0
              const NoVotes = jsonDB.get(`No_MembersVotes_${i.guild.id}_${i.message.id}`) || 0

              if (i.customId === `Yes_${i.message.id}`) {
                const check1 = jsonDB.get(`No_Members_${i.guild.id}_${i.message.id}`)
                const check = jsonDB.get(`Yes_Members_${i.guild.id}_${i.message.id}`)

                if (check1 && check1.includes(i.user.id)) {
                  return i.reply({ content: `قم بسحب تصويتك من التصويتات بالرفض 🔴 ثم حاول مره اخري ❗`, ephemeral: true })
                }

                if (check && check.includes(i.user.id)) {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes - 1}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.pull(`Yes_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                      i.deferReply({ ephemeral: true }).then(() => {
                        return i.editReply(`لقد سحبت تصويتك من الاقتراح`).then(() => {
                          jsonDB.set(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`, YesVotes - 1)
                        })
                      });
                    })
                  })
                } else {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes + 1}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.set(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`, YesVotes + 1).then(() => {
                      jsonDB.push(`Yes_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                        i.deferReply({ ephemeral: true }).then(() => {
                          i.editReply(`شكرا لمشاركتك بصوتك في الاقتراح`)
                        });
                      });
                    })
                  })
                }
              }
            } catch (error) {
              console.error(error);
            }
          });

          //NoVotes
          client3.on(`interactionCreate`, async i => {
            if (!i.isButton()) return
            try {
              const SugChannel = client3.channels.cache.get(i.channel.id)
              const SugMessage = SugChannel.messages.cache.get(i.message.id)

              const YesVotes = jsonDB.get(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`) || 0
              const NoVotes = jsonDB.get(`No_MembersVotes_${i.guild.id}_${i.message.id}`) || 0

              if (i.customId === `No_${i.message.id}`) {
                const check1 = jsonDB.get(`Yes_Members_${i.guild.id}_${i.message.id}`)
                const check = jsonDB.get(`No_Members_${i.guild.id}_${i.message.id}`)

                if (check1 && check1.includes(i.user.id)) {
                  return i.reply({ content: `قم بسحب تصويتك من التصويتات بالموافقه 🟢 ثم حاول مره اخري ❗`, ephemeral: true })
                }

                if (check && check.includes(i.user.id)) {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes - 1}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.pull(`No_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                      i.deferReply({ ephemeral: true }).then(() => {
                        return i.editReply(`لقد سحبت تصويتك من الاقتراح`).then(() => {
                          jsonDB.set(`No_MembersVotes_${i.guild.id}_${i.message.id}`, NoVotes - 1)
                        })
                      });
                    })
                  })
                } else {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes + 1}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.set(`No_MembersVotes_${i.guild.id}_${i.message.id}`, NoVotes + 1).then(() => {
                      jsonDB.push(`No_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                        i.deferReply({ ephemeral: true }).then(() => {
                          i.editReply(`شكرا لمشاركتك بصوتك في الاقتراح`)
                        });
                      });
                    })
                  })
                }
              }
            } catch (error) {
              console.error(error);
            }
          });

          runDB.pull('Runs_suggestion', botID).then(() => {
            client3.login(DB.token).then(() => {
            }).catch((err) => {
              
            });
          })


        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}, 5000);