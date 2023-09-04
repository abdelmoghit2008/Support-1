const { Database } = require("st.db")
const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")
const ticketdb = require("../../Schema/BotsDB/TicketDB")

const runDB = new Database("/Json-db/Others/RunDB");

const jsonDB = new Database("/Json-db/Bots/TicketDB.json")
let ticket = db2.get('ticket') || []
const _ = require('lodash');
const path = require('path');
ticket.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client6 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")
  client6.setMaxListeners(999);
  const fs = require('fs');
  const { readdirSync } = require("fs");
  const sourcebin = require('sourcebin_js');


  client6.TickerSelectmenu = new Discord.Collection();
  client6.Ticketcommands = new Discord.Collection();
  client6.events = new Discord.Collection();
  require("../../handlers/Ticket-Selectmenu")(client6);
  require("../../handlers/Ticket-commands")(client6);
  require("./handlers/events")(client6);

  client6.on('ready', async () => {
      const data = jsonDB.get(`ticket_Status_${client6.user.id}`) || []
      const Activity = await data.Activity
      const type = await data.Type
      const botstatus = await data.Presence || "online"
      const statuses = [
        Activity
      ];

      client6.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
      client6.user.setPresence({
        status: botstatus,
      });

  });


  client6.Ticketslashcommands = new Collection();
  const Ticketslashcommands = [];

  client6.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Ticketslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand6');
  const ascii = require("ascii-table");
  const table = new ascii("Ticket commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
  )) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
    )) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        Ticketslashcommands.push(command.data);
        client6.Ticketslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }

  //Buttons
  client6.on("interactionCreate", async (i) => {
    if (!i.isButton()) return;
    try {
      if (i.customId === `ticketButton_1_${i.message?.id}`) {
        const T = jsonDB.get(`PanalNumber_${i.message.id}`)
        const data = await ticketdb.findOne({ guildID: i.guild.id, "TicketButtonsPanal.panal": T.panalID })
        const categoryID = data.TicketButtonsPanal.button_1_Category//تعديل
        const category = i.guild.channels.cache.find(
          (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
        );

        //تعديل
        const supportteam =  data.TicketButtonsPanal.button_1_Support
        const mention = data.TicketButtonsPanal.button_1_Mention
        const welcome = data.TicketButtonsPanal.button_1_Welcome


        const Ticketbuttons = new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId(`Ticket_Close_Button`)
            .setStyle(`DANGER`)
            .setLabel("Close")
            .setDisabled(false),

          new MessageButton()
            .setCustomId(`Claim_${supportteam}`)
            .setStyle(`SUCCESS`)
            .setLabel("Claim")
            .setDisabled(false),

          new MessageButton()
            .setCustomId(`TranScript_${supportteam}`)
            .setStyle(`SECONDARY`)
            .setLabel("TranScript")
            .setDisabled(false),
        ]);

        const ticketlimit = jsonDB.get(`ticketlimit_${i.message.id}`);
        if (ticketlimit) {
          const checkusertickets = ticketdb.get(`Limit_${i.user.id}_${i.message.id}`)
          if (checkusertickets >= ticketlimit) {
            return i.reply({
              content: `You have reached the max ticket limit per user!`,
              ephemeral: true,
            });
          } else if (checkusertickets < ticketlimit) {
            jsonDB.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
          }
        }

        const ticketnumber = jsonDB.get(`ticketButton_1_${T.panalID}`) || 1;//تعديل
        jsonDB.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);

        const channel = await i.guild.channels.create(
          `ticket-${ticketnumber}`,
          {
            type: "text",
            parent: category,
            permissionOverwrites: [
              {
                id: i.guild.roles.everyone.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: `${i.user.id}`,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: supportteam,
                allow: ["VIEW_CHANNEL"],
              },
            ],
            topic: `${i.user.id}`,
          }
        );

        const WelcomeEmbed = new Discord.MessageEmbed()
          .setColor(i.guild.me.displayHexColor)
          .setDescription(`${welcome}`);
        if (!mention) {
          channel.send(`${i.user}`);
        } else {
          channel.send(`${i.user},<@&${mention}>`);
        }
        channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
        await i.reply({
          content: `Your ticket has been created: ${channel}`,
          ephemeral: true,
        });


        if (ticketlimit) {
          jsonDB.set(`Limted_User_${channel.id}`, i.message.id)
        }
      }else if (i.customId === `ticketButton_2_${i.message?.id}`) {
        const T = jsonDB.get(`PanalNumber_${i.message.id}`)
        const data = await ticketdb.findOne({ guildID: i.guild.id, "TicketButtonsPanal.panal": T.panalID })

        const categoryID = data.TicketButtonsPanal.button_2_Category//تعديل
        const category = i.guild.channels.cache.find(
          (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
        );

        //تعديل
        const supportteam = data.TicketButtonsPanal.button_2_Support
        const mention = data.TicketButtonsPanalbutton_2_Mention
        const welcome = data.TicketButtonsPanal.button_2_Welcome


        const Ticketbuttons = new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId(`Ticket_Close_Button`)
            .setStyle(`DANGER`)
            .setLabel("Close")
            .setDisabled(false),

          new MessageButton()
            .setCustomId(`Claim_${supportteam}`)
            .setStyle(`SUCCESS`)
            .setLabel("Claim")
            .setDisabled(false),

          new MessageButton()
            .setCustomId(`TranScript_${supportteam}`)
            .setStyle(`SECONDARY`)
            .setLabel("TranScript")
            .setDisabled(false),
        ]);

        const ticketlimit = jsonDB.get(`ticketlimit_${i.message.id}`);
        if (ticketlimit) {
          const checkusertickets = jsonDB.get(`Limit_${i.user.id}_${i.message.id}`)
          if (checkusertickets >= ticketlimit) {
            return i.reply({
              content: `You have reached the max ticket limit per user!`,
              ephemeral: true,
            });
          } else if (checkusertickets < ticketlimit) {
            jsonDB.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
          }
        }

        const ticketnumber = jsonDB.get(`ticketButton_2_${T.panalID}`) || 1;//تعديل
        jsonDB.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);

        const channel = await i.guild.channels.create(
          `ticket-${ticketnumber}`,
          {
            type: "text",
            parent: category,
            permissionOverwrites: [
              {
                id: i.guild.roles.everyone.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: `${i.user.id}`,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: `${supportteam}`,
                allow: ["VIEW_CHANNEL"],
              },
            ],
            topic: `${i.user.id}`,
          }
        );

        const WelcomeEmbed = new Discord.MessageEmbed()
          .setColor(i.guild.me.displayHexColor)
          .setDescription(`${welcome}`);
        if (!mention) {
          channel.send(`${i.user}`);
        } else {
          channel.send(`${i.user},<@&${mention}>`);
        }
        channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
        await i.reply({
          content: `Your ticket has been created: ${channel}`,
          ephemeral: true,
        });


        if (ticketlimit) {
          jsonDB.set(`Limted_User_${channel.id}`, i.message.id)
        }
      }else if (i.customId === `ticketButton_3_${i.message?.id}`) {
        const T = jsonDB.get(`PanalNumber_${i.message.id}`)
        const data = await ticketdb.findOne({ guildID: i.guild.id, "TicketButtonsPanal.panal": T.panalID })

        const categoryID = data.TicketButtonsPanal.button_3_Category//تعديل
        const category = i.guild.channels.cache.find(
          (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
        );

        //تعديل
        const supportteam = data.TicketButtonsPanal.button_3_Support
        const mention = data.TicketButtonsPanal.button_3_Mention
        const welcome = data.TicketButtonsPanal.button_3_Welcome


        const Ticketbuttons = new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId(`Ticket_Close_Button`)
            .setStyle(`DANGER`)
            .setLabel("Close")
            .setDisabled(false),

          new MessageButton()
            .setCustomId(`Claim_${supportteam}`)
            .setStyle(`SUCCESS`)
            .setLabel("Claim")
            .setDisabled(false),

          new MessageButton()
            .setCustomId(`TranScript_${supportteam}`)
            .setStyle(`SECONDARY`)
            .setLabel("TranScript")
            .setDisabled(false),
        ]);

        const ticketlimit = jsonDB.get(`ticketlimit_${i.message.id}`);
        if (ticketlimit) {
          const checkusertickets = jsonDB.get(`Limit_${i.user.id}_${i.message.id}`)
          if (checkusertickets >= ticketlimit) {
            return i.reply({
              content: `You have reached the max ticket limit per user!`,
              ephemeral: true,
            });
          } else if (checkusertickets < ticketlimit) {
            jsonDB.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
          }
        }

        const ticketnumber = jsonDB.get(`ticketButton_3_${T.panalID}`) || 1;//تعديل
        jsonDB.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);

        const channel = await i.guild.channels.create(
          `ticket-${ticketnumber}`,
          {
            type: "text",
            parent: category,
            permissionOverwrites: [
              {
                id: i.guild.roles.everyone.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: `${i.user.id}`,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
              },
              {
                id: `${supportteam}`,
                allow: ["VIEW_CHANNEL"],
              },
            ],
            topic: `${i.user.id}`,
          }
        );

        const WelcomeEmbed = new Discord.MessageEmbed()
          .setColor(i.guild.me.displayHexColor)
          .setDescription(`${welcome}`);
        if (!mention) {
          channel.send(`${i.user}`);
        } else {
          channel.send(`${i.user},<@&${mention}>`);
        }
        channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
        await i.reply({
          content: `Your ticket has been created: ${channel}`,
          ephemeral: true,
        });


        if (ticketlimit) {
          jsonDB.set(`Limted_User_${channel.id}`, i.message.id)
        }
      }
      //Claim Button
      else if (i.customId.startsWith("Claim_")) {
        const ticketpointsDB = require("../../Schema/BotsDB/TicketPointsDB")
        const pointsdata = await ticketpointsDB.findOne({ guildID: i.guild.id , User: i.user.id}) || 0
        const points = pointsdata.Points || 0

        const SupportTeam = i.customId.substring(6);
        const member = i.member;
        const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);

        if (hasSupportRole) {
          const role = i.guild.roles.cache.get(SupportTeam);
          i.channel.permissionOverwrites.edit(member, {
            SEND_MESSAGES: true,
          });
          i.channel.permissionOverwrites
            .edit(role, {
              SEND_MESSAGES: false,
            }).then(() => {
              const claimedButton = new MessageButton()
                .setCustomId(`Claimed_${SupportTeam}`)
                .setStyle(`SECONDARY`)
                .setLabel("Claimed")
                .setDisabled(false);
              const Ticketbuttons = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId(`Ticket_Close_Button`)
                  .setStyle(`DANGER`)
                  .setLabel("Close")
                  .setDisabled(false),
                claimedButton,
                new MessageButton()
                  .setCustomId(`TranScript_${SupportTeam}`)
                  .setStyle(`SECONDARY`)
                  .setLabel("TranScript")
                  .setDisabled(false),
              ]);

              const claimEmbed = new Discord.MessageEmbed()
                .setColor(`WHITE`)
                .setDescription(
                  `***تم استلام التذكره***\n**بواسطه : <@${i.user.id}>**`
                );
                jsonDB.set(`climedBy_${i.channel.id}`, i.user.id).then(async () => {
                  await ticketpointsDB.findOneAndUpdate(
                    { guildID: i.guild.id, User: i.user.id },
                    { Points: points + 1 },
                    { upsert: true }
                  );
              })
              i.update({ components: [Ticketbuttons] }).then(
                async (doneclaimed) => {
                  const ticketchannel1 = i.channel.id;
                  const claimedchannel =
                    client6.channels.cache.get(ticketchannel1);
                  claimedchannel.send({ embeds: [claimEmbed] }).catch((err) => { });
                }
              );
            });
        } else {
          return i.reply({
            content: "لا يمكنك استخدام هذا الزر.",
            ephemeral: true,
          });
        }
      }
      //unClaim
      else if (i.customId.startsWith("Claimed_")) {
        const ticketpointsDB = require("../../Schema/BotsDB/TicketPointsDB")
        const pointsdata = await ticketpointsDB.findOne({ guildID: i.guild.id , User: i.user.id}) || 1
        const points = pointsdata.Points || 1

        const climer = jsonDB.get(`climedBy_${i.channel.id}`);
        const SupportTeam = i.customId.substring(8);
        const member = i.member;
        const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);
        const role = i.guild.roles.cache.get(SupportTeam);

        if (i.user.id !== climer && !hasPermission) {
          return i
            .reply({
              content: `**لقد تم استلام التذكره بواسطه : <@${climer}>**`,
              ephemeral: true,
            })
            .catch((err) => console.log(err));
        }


        i.channel.permissionOverwrites.edit(member, {
          SEND_MESSAGES: false,
        });
        i.channel.permissionOverwrites
          .edit(role, {
            SEND_MESSAGES: true,
          })
          .then(() => {
            const claimButton = new MessageButton()
              .setCustomId(`Claim_${SupportTeam}`)
              .setStyle(`SUCCESS`)
              .setLabel("Claim")
              .setDisabled(false);
            const Ticketbuttons = new MessageActionRow().addComponents([
              new MessageButton()
                .setCustomId(`Ticket_Close_Button`)
                .setStyle(`DANGER`)
                .setLabel("Close")
                .setDisabled(false),
              claimButton,
              new MessageButton()
                .setCustomId(`TranScript_${SupportTeam}`)
                .setStyle(`SECONDARY`)
                .setLabel("TranScript")
                .setDisabled(false),
            ]);

            const notclimed = new Discord.MessageEmbed()
              .setColor(`WHITE`)
              .setDescription(
                `***تم الغاء استلام التذكره***\n**بواسطه : ${i.user}**`
              );
            i.update({ components: [Ticketbuttons] }).then(
              async (doneclaimed) => {
                const climer = jsonDB.get(`climedBy_${i.channel.id}`);
                await ticketpointsDB.findOneAndUpdate(
                    { guildID: i.guild.id, User: climer },
                    { Points: points - 1 },
                    { upsert: true }
                  );
                const ticketchannel1 = i.channel.id;
                const claimedchannel =
                  client6.channels.cache.get(ticketchannel1);
                claimedchannel.send({ embeds: [notclimed] });

                const defaultPermissions =
                  i.channel.permissionOverwrites.cache.find(
                    (overwrite) => overwrite.id === member.id
                  );
                const climerPermissions =
                  i.channel.permissionOverwrites.cache.find(
                    (overwrite) => overwrite.id === climer
                  );
                defaultPermissions ? defaultPermissions.delete() : null;
                climerPermissions ? climerPermissions.delete() : null;
              }
            );
          });
      }
      //CloseSure
      else if (i.customId === `Ticket_Close_Button`) {
        try {
          i.deferUpdate();
          const Ticketbuttons = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`Ticket_Close_Button_Sure`)
              .setStyle(`DANGER`)
              .setLabel("Close")
              .setDisabled(false),
            new MessageButton()
              .setCustomId(`Cancel_Ticket_Close_Button`)
              .setStyle(`SECONDARY`)
              .setLabel("Cancel")
              .setDisabled(false),
          ]);
          i.channel.send({ content: `هل انت متاكد من اغلاقك للتكت؟`, components: [Ticketbuttons] })
        } catch (error) {
          console.log(error)
        }
      }
      //Close
      else if (i.customId === `Ticket_Close_Button_Sure`) {
        const lm = jsonDB.get(`Limted_User_${i.channel.id}`)
        const ticketlimit = jsonDB.get(`ticketlimit_${lm}`);
        try {
          if (ticketlimit) {
            if (lm) {
              jsonDB.subtract(`Limit_${i.user.id}_${lm}`, 1)
              jsonDB.delete(`Limted_User_${i.channel.id}`)
            }
          }
          jsonDB.delete(`climedBy_${i.channel.id}`)
          jsonDB.delete(`${i.channel.id}`)
          const Delembed = new Discord.MessageEmbed()
            .setColor(`#d5d5d5`)
            .setDescription(
              `__**The Ticket will be deleted in \`5\` seconds**__`
            );
          i.reply({ embeds: [Delembed] })
            .then((timeembed) => {
              setTimeout(() => i.channel.delete(), 5000);
            })
            .catch(async (error) => {
              return console.log(error.message);
            });
        } catch (error) {
          console.log(error)
        }
      }
      //Cancel Ticket close
      else if (i.customId === `Cancel_Ticket_Close_Button`) {
        try {
          i.deferUpdate();
          i.message.delete().catch(err => { })
        } catch (error) {
          console.log(error)
        }
      }
      //TranScript
      else if (i.customId.startsWith("TranScript_")) {
        const SupportTeam = i.customId.substring(11);
        const member = i.member;
        const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);

        const data = await ticketdb.findOne({ guildID: i.guild.id})
        const TchannelID = data.TransScript
        if(!TchannelID) return i.reply({content:'استخدم هذا الامر /transcript-channel لتحديد روم لحفظ السجلات', ephemeral: true})
        const Tchannel = client6.channels.cache.get(TchannelID)
        if (hasSupportRole) {
          if (!Tchannel) return i.reply(`[x] لا استطيع ايجاد روم حفظ السجلات قم بتحديد الروم \`/transcript-channel\``)
          await i.channel.messages.fetch().then(async (messages) => {
            const messageArray = [...messages.values()];
            const reversedMessages = messageArray.reverse();
            const output = reversedMessages.map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');

            let response;
            try {
              response = await sourcebin.create([
                {
                  name: ' ',
                  content: output,
                  languageId: 'text',
                },
              ], {
                title: `Chat transcript for ${i.channel.name}`,
                description: ' ',
              });
            } catch (e) {
              return i.channel.send('An error occurred, please try again!');
            }

            const savingTransScriptEmbed = new MessageEmbed()
              .setColor(`YELLOW`)
              .setDescription(`[✔] تم حفظ سجل التكت`)
            const channelName = jsonDB.get(`${i.channel.id}`) || i.channel.name
            const NewchannelName = i.channel.name
            const userID = i.channel.topic
            const SavedBy = i.user.username

            const TEmbed = new MessageEmbed()
              .setColor(`YELLOW`)
              .addFields(
                { name: 'Ticket name', value: channelName, inline: true },
                { name: 'Ticket new name', value: NewchannelName, inline: true },
                { name: 'opened By', value: `<@!${userID}> \`${userID}\``, inline: true },
                { name: 'TranScript Saved By', value: `<@!${i.user.id}> (${SavedBy}) \`${i.user.id}\``, inline: true },
              )

            const TrButton = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle(`LINK`)
                .setURL(response.url)
                .setLabel(`View TranScript`)
                .setDisabled(false),
            ]);

            Tchannel.send({ embeds: [TEmbed], components: [TrButton] }).then(() => {
              i.reply({ embeds: [savingTransScriptEmbed] })
            })
          });
        } else {
          return i.reply({
            content: "لا يمكنك استخدام هذا الزر.",
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.log(error)
    }
  });

  client6.login(data.token).catch(() => {
    let autofilter = ticket.filter(a => a.BotID != data.BotID)
            db2.set(`ticket` , autofilter)
    
  });
});


setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_ticket');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`ticket`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);


        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client6 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
        client6.setMaxListeners(999);
        const fs = require('fs');
        const { readdirSync } = require("fs");
        const sourcebin = require('sourcebin_js');
      
      
        client6.TickerSelectmenu = new Discord.Collection();
        client6.Ticketcommands = new Discord.Collection();
        client6.events = new Discord.Collection();
        require("../../handlers/Ticket-Selectmenu")(client6);
        require("../../handlers/Ticket-commands")(client6);
        require("./handlers/events")(client6);
      
        client6.on('ready', async () => {
            const data = jsonDB.get(`ticket_Status_${client6.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
            const statuses = [
              Activity
            ];
      
            client6.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client6.user.setPresence({
              status: botstatus,
            });
      
        });
      
      
        client6.Ticketslashcommands = new Collection();
        const Ticketslashcommands = [];
      
        client6.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(data.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(data.CLIENTID), {
                body: Ticketslashcommands,
              });
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        const folderPath = path.join(__dirname, 'slashcommand6');
        const ascii = require("ascii-table");
        const table = new ascii("Ticket commands").setJustify();
        for (let folder of readdirSync(folderPath).filter(
          (folder) => !folder.includes(".")
        )) {
          for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
            f.endsWith(".js")
          )) {
            let command = require(`${folderPath}/${folder}/${file}`);
            if (command) {
              Ticketslashcommands.push(command.data);
              client6.Ticketslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
        //Buttons
        client6.on("interactionCreate", async (i) => {
          if (!i.isButton()) return;
          try {
            if (i.customId === `ticketButton_1_${i.message?.id}`) {
              const T = jsonDB.get(`PanalNumber_${i.message.id}`)
              const data = await ticketdb.findOne({ guildID: i.guild.id, "TicketButtonsPanal.panal": T.panalID })
              const categoryID = data.TicketButtonsPanal.button_1_Category//تعديل
              const category = i.guild.channels.cache.find(
                (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
              );
      
              //تعديل
              const supportteam =  data.TicketButtonsPanal.button_1_Support
              const mention = data.TicketButtonsPanal.button_1_Mention
              const welcome = data.TicketButtonsPanal.button_1_Welcome
      
      
              const Ticketbuttons = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId(`Ticket_Close_Button`)
                  .setStyle(`DANGER`)
                  .setLabel("Close")
                  .setDisabled(false),
      
                new MessageButton()
                  .setCustomId(`Claim_${supportteam}`)
                  .setStyle(`SUCCESS`)
                  .setLabel("Claim")
                  .setDisabled(false),
      
                new MessageButton()
                  .setCustomId(`TranScript_${supportteam}`)
                  .setStyle(`SECONDARY`)
                  .setLabel("TranScript")
                  .setDisabled(false),
              ]);
      
              const ticketlimit = jsonDB.get(`ticketlimit_${i.message.id}`);
              if (ticketlimit) {
                const checkusertickets = ticketdb.get(`Limit_${i.user.id}_${i.message.id}`)
                if (checkusertickets >= ticketlimit) {
                  return i.reply({
                    content: `You have reached the max ticket limit per user!`,
                    ephemeral: true,
                  });
                } else if (checkusertickets < ticketlimit) {
                  jsonDB.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
                }
              }
      
              const ticketnumber = jsonDB.get(`ticketButton_1_${T.panalID}`) || 1;//تعديل
              jsonDB.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);
      
              const channel = await i.guild.channels.create(
                `ticket-${ticketnumber}`,
                {
                  type: "text",
                  parent: category,
                  permissionOverwrites: [
                    {
                      id: i.guild.roles.everyone.id,
                      deny: ["VIEW_CHANNEL"],
                    },
                    {
                      id: `${i.user.id}`,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                      id: supportteam,
                      allow: ["VIEW_CHANNEL"],
                    },
                  ],
                  topic: `${i.user.id}`,
                }
              );
      
              const WelcomeEmbed = new Discord.MessageEmbed()
                .setColor(i.guild.me.displayHexColor)
                .setDescription(`${welcome}`);
              if (!mention) {
                channel.send(`${i.user}`);
              } else {
                channel.send(`${i.user},<@&${mention}>`);
              }
              channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
              await i.reply({
                content: `Your ticket has been created: ${channel}`,
                ephemeral: true,
              });
      
      
              if (ticketlimit) {
                jsonDB.set(`Limted_User_${channel.id}`, i.message.id)
              }
            }else if (i.customId === `ticketButton_2_${i.message?.id}`) {
              const T = jsonDB.get(`PanalNumber_${i.message.id}`)
              const data = await ticketdb.findOne({ guildID: i.guild.id, "TicketButtonsPanal.panal": T.panalID })
      
              const categoryID = data.TicketButtonsPanal.button_2_Category//تعديل
              const category = i.guild.channels.cache.find(
                (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
              );
      
              //تعديل
              const supportteam = data.TicketButtonsPanal.button_2_Support
              const mention = data.TicketButtonsPanalbutton_2_Mention
              const welcome = data.TicketButtonsPanal.button_2_Welcome
      
      
              const Ticketbuttons = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId(`Ticket_Close_Button`)
                  .setStyle(`DANGER`)
                  .setLabel("Close")
                  .setDisabled(false),
      
                new MessageButton()
                  .setCustomId(`Claim_${supportteam}`)
                  .setStyle(`SUCCESS`)
                  .setLabel("Claim")
                  .setDisabled(false),
      
                new MessageButton()
                  .setCustomId(`TranScript_${supportteam}`)
                  .setStyle(`SECONDARY`)
                  .setLabel("TranScript")
                  .setDisabled(false),
              ]);
      
              const ticketlimit = jsonDB.get(`ticketlimit_${i.message.id}`);
              if (ticketlimit) {
                const checkusertickets = jsonDB.get(`Limit_${i.user.id}_${i.message.id}`)
                if (checkusertickets >= ticketlimit) {
                  return i.reply({
                    content: `You have reached the max ticket limit per user!`,
                    ephemeral: true,
                  });
                } else if (checkusertickets < ticketlimit) {
                  jsonDB.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
                }
              }
      
              const ticketnumber = jsonDB.get(`ticketButton_2_${T.panalID}`) || 1;//تعديل
              jsonDB.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);
      
              const channel = await i.guild.channels.create(
                `ticket-${ticketnumber}`,
                {
                  type: "text",
                  parent: category,
                  permissionOverwrites: [
                    {
                      id: i.guild.roles.everyone.id,
                      deny: ["VIEW_CHANNEL"],
                    },
                    {
                      id: `${i.user.id}`,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                      id: `${supportteam}`,
                      allow: ["VIEW_CHANNEL"],
                    },
                  ],
                  topic: `${i.user.id}`,
                }
              );
      
              const WelcomeEmbed = new Discord.MessageEmbed()
                .setColor(i.guild.me.displayHexColor)
                .setDescription(`${welcome}`);
              if (!mention) {
                channel.send(`${i.user}`);
              } else {
                channel.send(`${i.user},<@&${mention}>`);
              }
              channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
              await i.reply({
                content: `Your ticket has been created: ${channel}`,
                ephemeral: true,
              });
      
      
              if (ticketlimit) {
                jsonDB.set(`Limted_User_${channel.id}`, i.message.id)
              }
            }else if (i.customId === `ticketButton_3_${i.message?.id}`) {
              const T = jsonDB.get(`PanalNumber_${i.message.id}`)
              const data = await ticketdb.findOne({ guildID: i.guild.id, "TicketButtonsPanal.panal": T.panalID })
      
              const categoryID = data.TicketButtonsPanal.button_3_Category//تعديل
              const category = i.guild.channels.cache.find(
                (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
              );
      
              //تعديل
              const supportteam = data.TicketButtonsPanal.button_3_Support
              const mention = data.TicketButtonsPanal.button_3_Mention
              const welcome = data.TicketButtonsPanal.button_3_Welcome
      
      
              const Ticketbuttons = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId(`Ticket_Close_Button`)
                  .setStyle(`DANGER`)
                  .setLabel("Close")
                  .setDisabled(false),
      
                new MessageButton()
                  .setCustomId(`Claim_${supportteam}`)
                  .setStyle(`SUCCESS`)
                  .setLabel("Claim")
                  .setDisabled(false),
      
                new MessageButton()
                  .setCustomId(`TranScript_${supportteam}`)
                  .setStyle(`SECONDARY`)
                  .setLabel("TranScript")
                  .setDisabled(false),
              ]);
      
              const ticketlimit = jsonDB.get(`ticketlimit_${i.message.id}`);
              if (ticketlimit) {
                const checkusertickets = jsonDB.get(`Limit_${i.user.id}_${i.message.id}`)
                if (checkusertickets >= ticketlimit) {
                  return i.reply({
                    content: `You have reached the max ticket limit per user!`,
                    ephemeral: true,
                  });
                } else if (checkusertickets < ticketlimit) {
                  jsonDB.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
                }
              }
      
              const ticketnumber = jsonDB.get(`ticketButton_3_${T.panalID}`) || 1;//تعديل
              jsonDB.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);
      
              const channel = await i.guild.channels.create(
                `ticket-${ticketnumber}`,
                {
                  type: "text",
                  parent: category,
                  permissionOverwrites: [
                    {
                      id: i.guild.roles.everyone.id,
                      deny: ["VIEW_CHANNEL"],
                    },
                    {
                      id: `${i.user.id}`,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    },
                    {
                      id: `${supportteam}`,
                      allow: ["VIEW_CHANNEL"],
                    },
                  ],
                  topic: `${i.user.id}`,
                }
              );
      
              const WelcomeEmbed = new Discord.MessageEmbed()
                .setColor(i.guild.me.displayHexColor)
                .setDescription(`${welcome}`);
              if (!mention) {
                channel.send(`${i.user}`);
              } else {
                channel.send(`${i.user},<@&${mention}>`);
              }
              channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
              await i.reply({
                content: `Your ticket has been created: ${channel}`,
                ephemeral: true,
              });
      
      
              if (ticketlimit) {
                jsonDB.set(`Limted_User_${channel.id}`, i.message.id)
              }
            }
            //Claim Button
            else if (i.customId.startsWith("Claim_")) {
              const ticketpointsDB = require("../../Schema/BotsDB/TicketPointsDB")
              const pointsdata = await ticketpointsDB.findOne({ guildID: i.guild.id , User: i.user.id}) || 0
              const points = pointsdata.Points || 0
      
              const SupportTeam = i.customId.substring(6);
              const member = i.member;
              const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);
      
              if (hasSupportRole) {
                const role = i.guild.roles.cache.get(SupportTeam);
                i.channel.permissionOverwrites.edit(member, {
                  SEND_MESSAGES: true,
                });
                i.channel.permissionOverwrites
                  .edit(role, {
                    SEND_MESSAGES: false,
                  }).then(() => {
                    const claimedButton = new MessageButton()
                      .setCustomId(`Claimed_${SupportTeam}`)
                      .setStyle(`SECONDARY`)
                      .setLabel("Claimed")
                      .setDisabled(false);
                    const Ticketbuttons = new MessageActionRow().addComponents([
                      new MessageButton()
                        .setCustomId(`Ticket_Close_Button`)
                        .setStyle(`DANGER`)
                        .setLabel("Close")
                        .setDisabled(false),
                      claimedButton,
                      new MessageButton()
                        .setCustomId(`TranScript_${SupportTeam}`)
                        .setStyle(`SECONDARY`)
                        .setLabel("TranScript")
                        .setDisabled(false),
                    ]);
      
                    const claimEmbed = new Discord.MessageEmbed()
                      .setColor(`WHITE`)
                      .setDescription(
                        `***تم استلام التذكره***\n**بواسطه : <@${i.user.id}>**`
                      );
                      jsonDB.set(`climedBy_${i.channel.id}`, i.user.id).then(async () => {
                        await ticketpointsDB.findOneAndUpdate(
                          { guildID: i.guild.id, User: i.user.id },
                          { Points: points + 1 },
                          { upsert: true }
                        );
                    })
                    i.update({ components: [Ticketbuttons] }).then(
                      async (doneclaimed) => {
                        const ticketchannel1 = i.channel.id;
                        const claimedchannel =
                          client6.channels.cache.get(ticketchannel1);
                        claimedchannel.send({ embeds: [claimEmbed] }).catch((err) => { });
                      }
                    );
                  });
              } else {
                return i.reply({
                  content: "لا يمكنك استخدام هذا الزر.",
                  ephemeral: true,
                });
              }
            }
            //unClaim
            else if (i.customId.startsWith("Claimed_")) {
              const ticketpointsDB = require("../../Schema/BotsDB/TicketPointsDB")
              const pointsdata = await ticketpointsDB.findOne({ guildID: i.guild.id , User: i.user.id}) || 1
              const points = pointsdata.Points || 1
      
              const climer = jsonDB.get(`climedBy_${i.channel.id}`);
              const SupportTeam = i.customId.substring(8);
              const member = i.member;
              const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);
              const role = i.guild.roles.cache.get(SupportTeam);
      
              if (i.user.id !== climer && !hasPermission) {
                return i
                  .reply({
                    content: `**لقد تم استلام التذكره بواسطه : <@${climer}>**`,
                    ephemeral: true,
                  })
                  .catch((err) => console.log(err));
              }
      
      
              i.channel.permissionOverwrites.edit(member, {
                SEND_MESSAGES: false,
              });
              i.channel.permissionOverwrites
                .edit(role, {
                  SEND_MESSAGES: true,
                })
                .then(() => {
                  const claimButton = new MessageButton()
                    .setCustomId(`Claim_${SupportTeam}`)
                    .setStyle(`SUCCESS`)
                    .setLabel("Claim")
                    .setDisabled(false);
                  const Ticketbuttons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Ticket_Close_Button`)
                      .setStyle(`DANGER`)
                      .setLabel("Close")
                      .setDisabled(false),
                    claimButton,
                    new MessageButton()
                      .setCustomId(`TranScript_${SupportTeam}`)
                      .setStyle(`SECONDARY`)
                      .setLabel("TranScript")
                      .setDisabled(false),
                  ]);
      
                  const notclimed = new Discord.MessageEmbed()
                    .setColor(`WHITE`)
                    .setDescription(
                      `***تم الغاء استلام التذكره***\n**بواسطه : ${i.user}**`
                    );
                  i.update({ components: [Ticketbuttons] }).then(
                    async (doneclaimed) => {
                      const climer = jsonDB.get(`climedBy_${i.channel.id}`);
                      await ticketpointsDB.findOneAndUpdate(
                          { guildID: i.guild.id, User: climer },
                          { Points: points - 1 },
                          { upsert: true }
                        );
                      const ticketchannel1 = i.channel.id;
                      const claimedchannel =
                        client6.channels.cache.get(ticketchannel1);
                      claimedchannel.send({ embeds: [notclimed] });
      
                      const defaultPermissions =
                        i.channel.permissionOverwrites.cache.find(
                          (overwrite) => overwrite.id === member.id
                        );
                      const climerPermissions =
                        i.channel.permissionOverwrites.cache.find(
                          (overwrite) => overwrite.id === climer
                        );
                      defaultPermissions ? defaultPermissions.delete() : null;
                      climerPermissions ? climerPermissions.delete() : null;
                    }
                  );
                });
            }
            //CloseSure
            else if (i.customId === `Ticket_Close_Button`) {
              try {
                i.deferUpdate();
                const Ticketbuttons = new MessageActionRow().addComponents([
                  new MessageButton()
                    .setCustomId(`Ticket_Close_Button_Sure`)
                    .setStyle(`DANGER`)
                    .setLabel("Close")
                    .setDisabled(false),
                  new MessageButton()
                    .setCustomId(`Cancel_Ticket_Close_Button`)
                    .setStyle(`SECONDARY`)
                    .setLabel("Cancel")
                    .setDisabled(false),
                ]);
                i.channel.send({ content: `هل انت متاكد من اغلاقك للتكت؟`, components: [Ticketbuttons] })
              } catch (error) {
                console.log(error)
              }
            }
            //Close
            else if (i.customId === `Ticket_Close_Button_Sure`) {
              const lm = jsonDB.get(`Limted_User_${i.channel.id}`)
              const ticketlimit = jsonDB.get(`ticketlimit_${lm}`);
              try {
                if (ticketlimit) {
                  if (lm) {
                    jsonDB.subtract(`Limit_${i.user.id}_${lm}`, 1)
                    jsonDB.delete(`Limted_User_${i.channel.id}`)
                  }
                }
                jsonDB.delete(`climedBy_${i.channel.id}`)
                jsonDB.delete(`${i.channel.id}`)
                const Delembed = new Discord.MessageEmbed()
                  .setColor(`#d5d5d5`)
                  .setDescription(
                    `__**The Ticket will be deleted in \`5\` seconds**__`
                  );
                i.reply({ embeds: [Delembed] })
                  .then((timeembed) => {
                    setTimeout(() => i.channel.delete(), 5000);
                  })
                  .catch(async (error) => {
                    return console.log(error.message);
                  });
              } catch (error) {
                console.log(error)
              }
            }
            //Cancel Ticket close
            else if (i.customId === `Cancel_Ticket_Close_Button`) {
              try {
                i.deferUpdate();
                i.message.delete().catch(err => { })
              } catch (error) {
                console.log(error)
              }
            }
            //TranScript
            else if (i.customId.startsWith("TranScript_")) {
              const SupportTeam = i.customId.substring(11);
              const member = i.member;
              const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);
      
              const data = await ticketdb.findOne({ guildID: i.guild.id})
              const TchannelID = data.TransScript
              if(!TchannelID) return i.reply({content:'استخدم هذا الامر /transcript-channel لتحديد روم لحفظ السجلات', ephemeral: true})
              const Tchannel = client6.channels.cache.get(TchannelID)
              if (hasSupportRole) {
                if (!Tchannel) return i.reply(`[x] لا استطيع ايجاد روم حفظ السجلات قم بتحديد الروم \`/transcript-channel\``)
                await i.channel.messages.fetch().then(async (messages) => {
                  const messageArray = [...messages.values()];
                  const reversedMessages = messageArray.reverse();
                  const output = reversedMessages.map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
      
                  let response;
                  try {
                    response = await sourcebin.create([
                      {
                        name: ' ',
                        content: output,
                        languageId: 'text',
                      },
                    ], {
                      title: `Chat transcript for ${i.channel.name}`,
                      description: ' ',
                    });
                  } catch (e) {
                    return i.channel.send('An error occurred, please try again!');
                  }
      
                  const savingTransScriptEmbed = new MessageEmbed()
                    .setColor(`YELLOW`)
                    .setDescription(`[✔] تم حفظ سجل التكت`)
                  const channelName = jsonDB.get(`${i.channel.id}`) || i.channel.name
                  const NewchannelName = i.channel.name
                  const userID = i.channel.topic
                  const SavedBy = i.user.username
      
                  const TEmbed = new MessageEmbed()
                    .setColor(`YELLOW`)
                    .addFields(
                      { name: 'Ticket name', value: channelName, inline: true },
                      { name: 'Ticket new name', value: NewchannelName, inline: true },
                      { name: 'opened By', value: `<@!${userID}> \`${userID}\``, inline: true },
                      { name: 'TranScript Saved By', value: `<@!${i.user.id}> (${SavedBy}) \`${i.user.id}\``, inline: true },
                    )
      
                  const TrButton = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setStyle(`LINK`)
                      .setURL(response.url)
                      .setLabel(`View TranScript`)
                      .setDisabled(false),
                  ]);
      
                  Tchannel.send({ embeds: [TEmbed], components: [TrButton] }).then(() => {
                    i.reply({ embeds: [savingTransScriptEmbed] })
                  })
                });
              } else {
                return i.reply({
                  content: "لا يمكنك استخدام هذا الزر.",
                  ephemeral: true,
                });
              }
            }
          } catch (error) {
            console.log(error)
          }
        });
      
      
          runDB.pull('Runs_ticket',botID).then(()=>{
            client6.login(DB.token).then(()=>{
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