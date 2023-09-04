const { Database } = require("st.db")
const giveawaydb = require("../../Schema/BotsDB/Giveaway.js")
const jsonDB = new Database("/Json-db/Bots/GiveawaysDB.json")

const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let giveaway = db2.get('giveaways') || []
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { readdirSync } = require("fs");

const runDB = new Database("/Json-db/Others/RunDB");

const ms = require('ms')
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');


giveaway.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client9 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")


  client9.commands = new Discord.Collection();
  client9.events = new Discord.Collection();
  require("../../handlers/Giveaways-commands")(client9);
  require("./handlers/events")(client9);

  client9.on('ready', async () => {
    const data = await jsonDB.get(`giveaway_Status_${client9.user.id}`) || []
    const Activity = await data.Activity
    const type = await data.Type
    const botstatus = await data.Presence || "online"

    client9.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
    client9.user.setPresence({
      status: botstatus,
    });
  });

  client9.GiveawayBotsslashcommands = new Collection();
  const GiveawayBotsslashcommands = [];


  client9.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: GiveawayBotsslashcommands,
        });
      } catch  {
        return
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand9');

  const ascii = require("ascii-table");
  const table = new ascii("Giveaways commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
  )) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
    )) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        GiveawayBotsslashcommands.push(command.data);
        client9.GiveawayBotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }


  client9.on(`interactionCreate`, async i => {
    try {
      if (!i.isButton()) return
      if (i.customId === `Giveaway_${i.message.id}`) {
        if (i.user.bot) return;

        const ServerData = await giveawaydb.findOne({ messageID: i.message.id });
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        const Timer = ServerData.Time
        const check = ServerData.Joined

        if (ServerData && check && check.includes(i.user.id)) {
          const LeaveButton = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`GiveawayLeave_${i.message.id}`)
              .setStyle(`DANGER`)
              .setLabel("Leave")
              .setDisabled(false),
          ]);
          return i.reply({ content: `انت منضم بالفعل في هذا القيف اواي`, components: [LeaveButton], ephemeral: true })
        } else {
          if (ServerData.messageID === i.message.id && moment(currentTime).isAfter(Timer)) return i.reply({ conetnt: `القيف اواي قد انتهي بالفعل`, ephemeral: true })
          const EntriesCounter = ServerData.EntriesCounter || 0
          const GiveawayButton = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`Giveaway_${i.message.id}`)
              .setStyle(`PRIMARY`)
              .setLabel(`🎉${EntriesCounter + 1}`)
              .setDisabled(false),
          ]);
          const channel = client9.channels.cache.get(i.channel.id)
          const message = await channel.messages.fetch(i.message.id)
          if (channel && message) {
            message.edit({ components: [GiveawayButton] })
          }
          ServerData.Joined.push(i.user.id);
          ServerData.EntriesCounter = EntriesCounter + 1
          await ServerData.save().then(() => {
            i.reply({ content: `لقد انضممت الي القيف اواي 🎉`, ephemeral: true }).then(() => {
            })
          });
        }
      }
      else if (i.customId === `GiveawayLeave_${i.message.reference.messageId}`) {
        const ServerData = await giveawaydb.findOne({ messageID: i.message.reference.messageId })

        if (ServerData && ServerData.Joined && !ServerData.Joined.includes(i.user.id)) return i.reply({ content: `لقد خرجت من القيف اواي بالفعل`, ephemeral: true }).catch(err => { })
        const Timer = ServerData.Time

        const EntriesCounter = ServerData.EntriesCounter || 1
        const GiveawayButton = new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId(`Giveaway_${i.message.reference.messageId}`)
            .setStyle(`PRIMARY`)
            .setLabel(`🎉${EntriesCounter - 1}`)
            .setDisabled(false),
        ]);
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        if (ServerData.messageID === i.message.reference.messageId && moment(currentTime).isAfter(Timer)) return i.reply(`القيف اواي قد انتهي بالفعل`)

        const channel = client9.channels.cache.get(i.channel.id)
        const message = await channel.messages.fetch(i.message.reference.messageId)
        if (channel && message) {
          message.edit({ components: [GiveawayButton] }).catch(err => { })
        }
        ServerData.Joined.pull(i.user.id);
        ServerData.EntriesCounter = EntriesCounter - 1
        await ServerData.save().then(() => {
          i.reply({ content: `لقد خرجت من القيف اواي 😢`, ephemeral: true })
        });
      }

    } catch  {
      return
    }
  });



  client9.on(`ready`, async () => {
    try {
      setInterval(async () => {
        const ServerData = await giveawaydb.find({ ClintID: client9.user.id });
        if (ServerData) {
          ServerData.forEach(async data => {

            const time = data.Time;
            const Message = data.messageID;
            const GuildID = data.guild
            const Winners = data.Winners
            const channelID = data.channelID
            const Prize = data.Prize
            if(!time || !Message || !GuildID || !Winners ||!channelID || !Prize ) return;

            const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');


            const guild = client9.guilds.cache.get(GuildID);
            const giveawaychannel = await client9.channels.cache.get(channelID)

            if (moment(currentTime).isAfter(time) && data.Status === "false" && data.Ended === "true") {
              return;
            } else if (moment(currentTime).isAfter(time) && data.Status === "true" && data.Ended === "false") {
              if(!Message) return
              const giveawaymessage = await giveawaychannel.messages.fetch(Message).catch(err => { return;})
              const winnersCount = Winners
              const participants = data.Joined
              const winners = _.sampleSize(participants, Math.min(winnersCount, participants?.length));

              let winners2 = []
              let winners3 = []
              winners.forEach(async winner => {
                winners2.push(`<@!${winner}>`)
                winners3.push(`${winner}`)
              })
              const GiveawayLink = new MessageActionRow().addComponents([
                new MessageButton()
                  .setStyle("LINK")
                  .setLabel("Giveaway")
                  .setURL(`${giveawaymessage.url}`)
              ]);

              if (winners2.length > 0) {
                data.winner = winners2;
                data.Reroll = winners3;
                giveawaychannel.send({ content: `**Congratulations** 🎉 ${winners2} You won **__${Prize}__**`, components: [GiveawayLink] })
              } else {
                giveawaychannel.send({ content: `😞 **No Entries**`, components: [GiveawayLink] })
              }

              if (!guild) return;

              const channel = guild.channels.cache.get(channelID);
              if (!channel || channel.type !== "GUILD_TEXT") return;

              const message = await channel.messages.fetch(Message);
              if (!message) return;

              const winner = await ServerData.winner || "No Entries"


              const EntriesCounter = ServerData.EntriesCounter || 0

              const GiveawayButton = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId(`Giveaway_Bot`)
                  .setStyle(`SECONDARY`)
                  .setLabel(`🎉${EntriesCounter}`)
                  .setDisabled(true),
              ]);

              const EndedEmbed = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(message.embeds[0].title)
                .setDescription(message.embeds[0].description)
                .addFields([{ name: " ", value: `🍀 **Winner's: **${winner}` },
                { name: " ", value: `🔸 **Ended 🕒**` }]);
              await message.edit({ embeds: [EndedEmbed], components: [GiveawayButton] }).then(async () => {
                await giveawaydb.findOneAndUpdate(
                  { messageID: Message },
                  {
                    Status: "false",
                    Ended: "true"
                  }
                );
              })

            } else if (moment(currentTime).isBefore(time) && data.Status !== "false" && data.Pause !== "false") {
              try {
                const guildID = data.guild;
                const guild = client9.guilds.cache.get(guildID);
                if (!guild) return;

                const channel = guild.channels.cache.get(channelID);
                if (!channel || channel.type !== "GUILD_TEXT") return;

                const message = await channel.messages.fetch(Message);
                if (!message) return;


                const updatedEmbed = new MessageEmbed()
                  .setColor("YELLOW")
                  .setTitle(message.embeds[0].title)
                  .setDescription(message.embeds[0].description)
                  .addFields([{ name: ` `, value: `🔸 **🕒 Paused**` }]);

                await message.edit({ embeds: [updatedEmbed] });
              } catch  {
                return
              }
            }
          })
        } else {

        }
      }, 3000);
    } catch  {
      return
    }
  })

  client9.login(data.token).catch(() => {
    let autofilter = giveaway.filter(a => a.BotID != data.BotID)
    db2.set(`giveaways` , autofilter)

  });
});


setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_giveaways');

    if (Array.isArray(botIDArray) && botIDArray.length > 0) {
      const botID = botIDArray.shift();

      if (botIDArray) {
        const database = db2.get(`giveaways`);
        if (database) {
          const DB = database.find(da => da.CLIENTID === botID);

          const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
          const Discord = require('discord.js');
          const client9 = new Client({ intents: 32767 });
          const { REST } = require("@discordjs/rest")
          const { Routes } = require("discord-api-types/v9")


          client9.commands = new Discord.Collection();
          client9.events = new Discord.Collection();
          require("../../handlers/Giveaways-commands")(client9);
          require("./handlers/events")(client9);

          client9.on('ready', async () => {
            const data = await jsonDB.get(`giveaway_Status_${client9.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"

            client9.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client9.user.setPresence({
              status: botstatus,
            });
          });

          client9.GiveawayBotsslashcommands = new Collection();
          const GiveawayBotsslashcommands = [];


          client9.on("ready", async () => {
            const rest = new REST({ version: "9" }).setToken(DB.token);
            (async () => {
              try {
                await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                  body: GiveawayBotsslashcommands,
                });
              } catch  {
                return
              }
            })();
          });

          const folderPath = path.join(__dirname, 'slashcommand9');

          const ascii = require("ascii-table");
          const table = new ascii("Giveaways commands").setJustify();
          for (let folder of readdirSync(folderPath).filter(
            (folder) => !folder.includes(".")
          )) {
            for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
              f.endsWith(".js")
            )) {
              let command = require(`${folderPath}/${folder}/${file}`);
              if (command) {
                GiveawayBotsslashcommands.push(command.data);
                client9.GiveawayBotsslashcommands.set(command.data.name, command);
                if (command.data.name) {
                  table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
                  table.addRow(`/${command.data.name}`, "🔴 Not Working");
                }
              }
            }
          }


          client9.on(`interactionCreate`, async i => {
            try {
              if (!i.isButton()) return
              if (i.customId === `Giveaway_${i.message.id}`) {
                if (i.user.bot) return;

                const ServerData = await giveawaydb.findOne({ messageID: i.message.id });
                const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

                const Timer = ServerData.Time
                const check = ServerData.Joined

                if (ServerData && check && check.includes(i.user.id)) {
                  const LeaveButton = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`GiveawayLeave_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setLabel("Leave")
                      .setDisabled(false),
                  ]);
                  return i.reply({ content: `انت منضم بالفعل في هذا القيف اواي`, components: [LeaveButton], ephemeral: true })
                } else {
                  if (ServerData.messageID === i.message.id && moment(currentTime).isAfter(Timer)) return i.reply({ conetnt: `القيف اواي قد انتهي بالفعل`, ephemeral: true })
                  const EntriesCounter = ServerData.EntriesCounter || 0
                  const GiveawayButton = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Giveaway_${i.message.id}`)
                      .setStyle(`PRIMARY`)
                      .setLabel(`🎉${EntriesCounter + 1}`)
                      .setDisabled(false),
                  ]);
                  const channel = client9.channels.cache.get(i.channel.id)
                  const message = await channel.messages.fetch(i.message.id)
                  if (channel && message) {
                    message.edit({ components: [GiveawayButton] })
                  }
                  ServerData.Joined.push(i.user.id);
                  ServerData.EntriesCounter = EntriesCounter + 1
                  await ServerData.save().then(() => {
                    i.reply({ content: `لقد انضممت الي القيف اواي 🎉`, ephemeral: true }).then(() => {
                    })
                  });
                }
              }
              else if (i.customId === `GiveawayLeave_${i.message.reference.messageId}`) {
                const ServerData = await giveawaydb.findOne({ messageID: i.message.reference.messageId })

                if (ServerData && ServerData.Joined && !ServerData.Joined.includes(i.user.id)) return i.reply({ content: `لقد خرجت من القيف اواي بالفعل`, ephemeral: true }).catch(err => { })
                const Timer = ServerData.Time

                const EntriesCounter = ServerData.EntriesCounter || 1
                const GiveawayButton = new MessageActionRow().addComponents([
                  new MessageButton()
                    .setCustomId(`Giveaway_${i.message.reference.messageId}`)
                    .setStyle(`PRIMARY`)
                    .setLabel(`🎉${EntriesCounter - 1}`)
                    .setDisabled(false),
                ]);
                const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

                if (ServerData.messageID === i.message.reference.messageId && moment(currentTime).isAfter(Timer)) return i.reply(`القيف اواي قد انتهي بالفعل`)

                const channel = client9.channels.cache.get(i.channel.id)
                const message = await channel.messages.fetch(i.message.reference.messageId)
                if (channel && message) {
                  message.edit({ components: [GiveawayButton] }).catch(err => { })
                }
                ServerData.Joined.pull(i.user.id);
                ServerData.EntriesCounter = EntriesCounter - 1
                await ServerData.save().then(() => {
                  i.reply({ content: `لقد خرجت من القيف اواي 😢`, ephemeral: true })
                });
              }

            } catch  {
              return
            }
          });



          client9.on(`ready`, async () => {
            try {
              setInterval(async () => {
                const ServerData = await giveawaydb.find({ ClintID: client9.user.id });
                if (ServerData) {
                  ServerData.forEach(async data => {

                    const time = data.Time;
                    const Message = data.messageID;
                    const GuildID = data.guild
                    const Winners = data.Winners
                    const channelID = data.channelID
                    const Prize = data.Prize

                    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');


                    const guild = client9.guilds.cache.get(GuildID);
                    const giveawaychannel = await client9.channels.cache.get(channelID)

                    if (moment(currentTime).isAfter(time) && data.Status === "false" && data.Ended === "true") {
                      return;
                    } else if (moment(currentTime).isAfter(time) && data.Status === "true" && data.Ended === "false") {
                      const giveawaymessage = await giveawaychannel.messages.fetch(Message).catch(err => { })
                      const winnersCount = Winners
                      const participants = data.Joined
                      const winners = _.sampleSize(participants, Math.min(winnersCount, participants?.length));

                      let winners2 = []
                      let winners3 = []
                      winners.forEach(async winner => {
                        winners2.push(`<@!${winner}>`)
                        winners3.push(`${winner}`)
                      })
                      const GiveawayLink = new MessageActionRow().addComponents([
                        new MessageButton()
                          .setStyle("LINK")
                          .setLabel("Giveaway")
                          .setURL(`${giveawaymessage.url}`)
                      ]);

                      if (winners2.length > 0) {
                        data.winner = winners2;
                        data.Reroll = winners3;
                        giveawaychannel.send({ content: `**Congratulations** 🎉 ${winners2} You won **__${Prize}__**`, components: [GiveawayLink] })
                      } else {
                        giveawaychannel.send({ content: `😞 **No Entries**`, components: [GiveawayLink] })
                      }

                      if (!guild) return;

                      const channel = guild.channels.cache.get(channelID);
                      if (!channel || channel.type !== "GUILD_TEXT") return;

                      const message = await channel.messages.fetch(Message);
                      if (!message) return;

                      const winner = await ServerData.winner || "No Entries"


                      const EntriesCounter = ServerData.EntriesCounter || 0

                      const GiveawayButton = new MessageActionRow().addComponents([
                        new MessageButton()
                          .setCustomId(`Giveaway_Bot`)
                          .setStyle(`SECONDARY`)
                          .setLabel(`🎉${EntriesCounter}`)
                          .setDisabled(true),
                      ]);

                      const EndedEmbed = new MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(message.embeds[0].title)
                        .setDescription(message.embeds[0].description)
                        .addFields([{ name: " ", value: `🍀 **Winner's: **${winner}` },
                        { name: " ", value: `🔸 **Ended 🕒**` }]);
                      await message.edit({ embeds: [EndedEmbed], components: [GiveawayButton] }).then(async () => {
                        await giveawaydb.findOneAndUpdate(
                          { messageID: Message },
                          {
                            Status: "false",
                            Ended: "true"
                          }
                        );
                      })

                    } else if (moment(currentTime).isBefore(time) && data.Status !== "false" && data.Pause !== "false") {
                      try {
                        const guildID = data.guild;
                        const guild = client9.guilds.cache.get(guildID);
                        if (!guild) return;

                        const channel = guild.channels.cache.get(channelID);
                        if (!channel || channel.type !== "GUILD_TEXT") return;

                        const message = await channel.messages.fetch(Message);
                        if (!message) return;


                        const updatedEmbed = new MessageEmbed()
                          .setColor("YELLOW")
                          .setTitle(message.embeds[0].title)
                          .setDescription(message.embeds[0].description)
                          .addFields([{ name: ` `, value: `🔸 **🕒 Paused**` }]);

                        await message.edit({ embeds: [updatedEmbed] });
                      } catch  {
                        return
                      }
                    }
                  })
                } else {

                }
              }, 3000);
            } catch  {
              return
            }
          })

          runDB.pull('Runs_giveaways', botID).then(() => {
            client9.login(DB.token).then(() => {
            }).catch((err) => {
              
            });
          })


        }
      }
    }
  } catch  {
    return
  }
}, 5000);