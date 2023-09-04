const { Database } = require("st.db")
const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")
const feeddb = new Database("/Json-db/Bots/FeedbackDB.json")
const unWantedJson = new Database("/Json-db/Others/unWanted")
let feed = db2.get('feedback') || []

const runDB = new Database("/Json-db/Others/RunDB");

const embedscolor = '#000000';
const _ = require('lodash');
const path = require('path');

feed.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client13 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")
  client13.setMaxListeners(999);
  const fs = require('fs');
  const { readdirSync } = require("fs");



  client13.events = new Discord.Collection();
  require("./handlers/events")(client13);

  client13.on('ready', async () => {
    unWantedJson.deleteAll()
      const data = feeddb.get(`feed_Status_${client13.user.id}`) || []
      const Activity = await data.Activity
      const type = await data.Type
      const botstatus = await data.Presence || "online"

      client13.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
      client13.user.setPresence({
        status: botstatus,
      });
  });


  client13.Feedbackbotsslashcommands = new Collection();
  const Feedbackbotsslashcommands = [];


  client13.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Feedbackbotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand13');

  const ascii = require("ascii-table");
  const table = new ascii("Log commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
  )) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
    )) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        Feedbackbotsslashcommands.push(command.data);
        client13.Feedbackbotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }

  client13.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    const feedbackrooms = feeddb.get(`feedback_room_${message.guild.id}`)
    if (feeddb.has(`feedback_webhook_${message.guild.id}`) && message.channel.id.includes(feedbackrooms)) {
      let weburl = feeddb.get(`feedback_webhook_${message.guild.id}`);
      await message.delete();
      const embed = new Discord.MessageEmbed()
        .setDescription(`**Feedback :**\n${message.content}`)
        .setURL(`https://discord.com/users/${message.author.id}`)
        .setTitle(`[${message.author.username}] (${message.author.id})`)
        .setColor("DARK_BUT_NOT_BLACK")
        .addFields({
          name: "Rate :", value: "⭐⭐⭐⭐⭐"
        })
        .setTimestamp(Date.now());

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('feedback_1')
            .setLabel('1 ⭐')
            .setStyle('PRIMARY')
            .setDisabled(false),
            new MessageButton()
            .setCustomId('feedback_2')
            .setLabel('2 ⭐')
            .setStyle('PRIMARY')
            .setDisabled(false),
            new MessageButton()
            .setCustomId('feedback_3')
            .setLabel('3 ⭐')
            .setStyle('PRIMARY')
            .setDisabled(false),
            new MessageButton()
            .setCustomId('feedback_4')
            .setLabel('4 ⭐')
            .setStyle('PRIMARY')
            .setDisabled(false),
            new MessageButton()
            .setCustomId('feedback_5')
            .setLabel('5 ⭐')
            .setStyle('PRIMARY')
            .setDisabled(false),
        )

        const line = feeddb.get(`feedback_line_${message.guild.id}`)
        const mode = feeddb.get(`Rating_System_${message.guild.id}`) || `true`
        if(mode === `true`){
          await new WebhookClient({ url: weburl }).send({
            username: message.author.username,
            avatarURL: message.author.avatarURL(),
            embeds: [embed],
            components: [row]
          }).then((msg) => {
            if(line){
              message.channel.send({files:[line]})
            }
            unWantedJson.set(`FeedBackWebhook_${msg.id}`, weburl);
            setInterval(async() => {
              const webhook = new WebhookClient({ url: `${weburl}` });
              await webhook.editMessage(msg.id, {
                content: null,
                components: []
              });
              unWantedJson.delete(`FeedBackWebhook_${msg.id}`)
            }, 30000);
          });
        }else{
          await new WebhookClient({ url: weburl }).send({
            username: message.author.username,
            avatarURL: message.author.avatarURL(),
            embeds: [embed]
          }).then(()=>{
            if(line){
              message.channel.send({files:[line]})
            }
          })
        }
    }
  });

  client13.on(`interactionCreate`, async interaction =>{
    if(interaction.customId ===`feedback_1`){
      const feedbackowner = interaction.message.embeds[0].title;
      if (!feedbackowner.includes(interaction.user.id)) {
        await interaction.deferUpdate();
      }else{
        await interaction.deferUpdate();
        const messageID = interaction.message.id;
        const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
        const Embedcolor = interaction.message.embeds[0].color;
        const EmbedURL = interaction.message.embeds[0].url;
        const des = interaction.message.embeds[0].description;

        const webhook = new WebhookClient({ url: `${webhookURL}` });
        const message = interaction.message;

        const newFields = [
          { name: "Rate :", value: "⭐" },
        ];

        const newEmbed = new MessageEmbed()
        .setDescription(des)
        .setTitle(feedbackowner)
        .setURL(EmbedURL)
        .setColor(Embedcolor)
        .addFields(newFields)
        .setTimestamp(Date.now());

      await webhook.editMessage(message.id, {
        content: null,
        embeds: [newEmbed],
        components: []
      }).then(()=>{
        unWantedJson.delete(`FeedBackWebhook_${messageID}`)
      })
      }
    }else if(interaction.customId ===`feedback_2`){
      const feedbackowner = interaction.message.embeds[0].title;
      if (!feedbackowner.includes(interaction.user.id)) {
        await interaction.deferUpdate();
      }else{
        await interaction.deferUpdate();
        const messageID = interaction.message.id;
        const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
        const Embedcolor = interaction.message.embeds[0].color;
        const EmbedURL = interaction.message.embeds[0].url;
        const des = interaction.message.embeds[0].description;

        const webhook = new WebhookClient({ url: `${webhookURL}` });
        const message = interaction.message;

        const newFields = [
          { name: "Rate :", value: "⭐⭐" },
        ];

        const newEmbed = new MessageEmbed()
        .setDescription(des)
        .setTitle(feedbackowner)
        .setURL(EmbedURL)
        .setColor(Embedcolor)
        .addFields(newFields)
        .setTimestamp(Date.now());

      await webhook.editMessage(message.id, {
        content: null,
        embeds: [newEmbed],
        components: []
      }).then(()=>{
        unWantedJson.delete(`FeedBackWebhook_${messageID}`)
      })
      }
    }else if(interaction.customId ===`feedback_3`){
      const feedbackowner = interaction.message.embeds[0].title;
      if (!feedbackowner.includes(interaction.user.id)) {
        await interaction.deferUpdate();
      }else{
        await interaction.deferUpdate();
        const messageID = interaction.message.id;
        const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
        const Embedcolor = interaction.message.embeds[0].color;
        const EmbedURL = interaction.message.embeds[0].url;
        const des = interaction.message.embeds[0].description;

        const webhook = new WebhookClient({ url: `${webhookURL}` });
        const message = interaction.message;

        const newFields = [
          { name: "Rate :", value: "⭐⭐⭐" },
        ];

        const newEmbed = new MessageEmbed()
        .setDescription(des)
        .setTitle(feedbackowner)
        .setURL(EmbedURL)
        .setColor(Embedcolor)
        .addFields(newFields)
        .setTimestamp(Date.now());

      await webhook.editMessage(message.id, {
        content: null,
        embeds: [newEmbed],
        components: []
      }).then(()=>{
        unWantedJson.delete(`FeedBackWebhook_${messageID}`)
      })
      }
    }else if(interaction.customId ===`feedback_4`){
      const feedbackowner = interaction.message.embeds[0].title;
      if (!feedbackowner.includes(interaction.user.id)) {
        await interaction.deferUpdate();
      }else{
        await interaction.deferUpdate();
        const messageID = interaction.message.id;
        const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
        const Embedcolor = interaction.message.embeds[0].color;
        const EmbedURL = interaction.message.embeds[0].url;
        const des = interaction.message.embeds[0].description;

        const webhook = new WebhookClient({ url: `${webhookURL}` });
        const message = interaction.message;

        const newFields = [
          { name: "Rate :", value: "⭐⭐⭐⭐" },
        ];

        const newEmbed = new MessageEmbed()
        .setDescription(des)
        .setTitle(feedbackowner)
        .setURL(EmbedURL)
        .setColor(Embedcolor)
        .addFields(newFields)
        .setTimestamp(Date.now());

      await webhook.editMessage(message.id, {
        content: null,
        embeds: [newEmbed],
        components: []
      }).then(()=>{
        unWantedJson.delete(`FeedBackWebhook_${messageID}`)
      })
      }
    }else if(interaction.customId ===`feedback_5`){
      const feedbackowner = interaction.message.embeds[0].title;
      if (!feedbackowner.includes(interaction.user.id)) {
        await interaction.deferUpdate();
      }else{
        await interaction.deferUpdate();
        const messageID = interaction.message.id;
        const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
        const Embedcolor = interaction.message.embeds[0].color;
        const EmbedURL = interaction.message.embeds[0].url;
        const des = interaction.message.embeds[0].description;

        const webhook = new WebhookClient({ url: `${webhookURL}` });
        const message = interaction.message;

        const newFields = [
          { name: "Rate :", value: "⭐⭐⭐⭐⭐" },
        ];

        const newEmbed = new MessageEmbed()
        .setDescription(des)
        .setTitle(feedbackowner)
        .setURL(EmbedURL)
        .setColor(Embedcolor)
        .addFields(newFields)
        .setTimestamp(Date.now());

      await webhook.editMessage(message.id, {
        content: null,
        embeds: [newEmbed],
        components: []
      }).then(()=>{
        unWantedJson.delete(`FeedBackWebhook_${messageID}`)
      })
      }
    }
  })


  client13.login(data.token).catch(() => {
    let autofilter = feed.filter(a => a.BotID != data.BotID)
            db2.set(`feedback` , autofilter)
    
  });
});


setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_feedback');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`feedback`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);

        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client13 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
        client13.setMaxListeners(999);
        const fs = require('fs');
        const { readdirSync } = require("fs");
      
      
      
        client13.events = new Discord.Collection();
        require("./handlers/events")(client13);
      
        client13.on('ready', async () => {
            const data = feeddb.get(`feed_Status_${client13.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
      
            client13.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client13.user.setPresence({
              status: botstatus,
            });
        });
      
      
        client13.Feedbackbotsslashcommands = new Collection();
        const Feedbackbotsslashcommands = [];
      
      
        client13.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(DB.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                body: Feedbackbotsslashcommands,
              });
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        const folderPath = path.join(__dirname, 'slashcommand13');
      
        const ascii = require("ascii-table");
        const table = new ascii("Log commands").setJustify();
        for (let folder of readdirSync(folderPath).filter(
          (folder) => !folder.includes(".")
        )) {
          for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
            f.endsWith(".js")
          )) {
            let command = require(`${folderPath}/${folder}/${file}`);
            if (command) {
              Feedbackbotsslashcommands.push(command.data);
              client13.Feedbackbotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
        client13.on("messageCreate", async (message) => {
          if (message.author.bot) return;
          const feedbackrooms = feeddb.get(`feedback_room_${message.guild.id}`)
          if (feeddb.has(`feedback_webhook_${message.guild.id}`) && message.channel.id.includes(feedbackrooms)) {
            let weburl = feeddb.get(`feedback_webhook_${message.guild.id}`);
            await message.delete();
            const embed = new Discord.MessageEmbed()
              .setDescription(`**Feedback :**\n${message.content}`)
              .setURL(`https://discord.com/users/${message.author.id}`)
              .setTitle(`[${message.author.username}] (${message.author.id})`)
              .setColor("DARK_BUT_NOT_BLACK")
              .addFields({
                name: "Rate :", value: "⭐⭐⭐⭐⭐"
              })
              .setTimestamp(Date.now());
      
            const row = new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('feedback_1')
                  .setLabel('1 ⭐')
                  .setStyle('PRIMARY')
                  .setDisabled(false),
                  new MessageButton()
                  .setCustomId('feedback_2')
                  .setLabel('2 ⭐')
                  .setStyle('PRIMARY')
                  .setDisabled(false),
                  new MessageButton()
                  .setCustomId('feedback_3')
                  .setLabel('3 ⭐')
                  .setStyle('PRIMARY')
                  .setDisabled(false),
                  new MessageButton()
                  .setCustomId('feedback_4')
                  .setLabel('4 ⭐')
                  .setStyle('PRIMARY')
                  .setDisabled(false),
                  new MessageButton()
                  .setCustomId('feedback_5')
                  .setLabel('5 ⭐')
                  .setStyle('PRIMARY')
                  .setDisabled(false),
              )
      
              const line = feeddb.get(`feedback_line_${message.guild.id}`)
              const mode = feeddb.get(`Rating_System_${message.guild.id}`) || `true`
              if(mode === `true`){
                await new WebhookClient({ url: weburl }).send({
                  username: message.author.username,
                  avatarURL: message.author.avatarURL(),
                  embeds: [embed],
                  components: [row]
                }).then((msg) => {
                  if(line){
                    message.channel.send({files:[line]})
                  }
                  unWantedJson.set(`FeedBackWebhook_${msg.id}`, weburl);
                  setInterval(async() => {
                    const webhook = new WebhookClient({ url: `${weburl}` });
                    await webhook.editMessage(msg.id, {
                      content: null,
                      components: []
                    });
                    unWantedJson.delete(`FeedBackWebhook_${msg.id}`)
                  }, 30000);
                });
              }else{
                await new WebhookClient({ url: weburl }).send({
                  username: message.author.username,
                  avatarURL: message.author.avatarURL(),
                  embeds: [embed]
                }).then(()=>{
                  if(line){
                    message.channel.send({files:[line]})
                  }
                })
              }
          }
        });
      
        client13.on(`interactionCreate`, async interaction =>{
          if(interaction.customId ===`feedback_1`){
            const feedbackowner = interaction.message.embeds[0].title;
            if (!feedbackowner.includes(interaction.user.id)) {
              await interaction.deferUpdate();
            }else{
              await interaction.deferUpdate();
              const messageID = interaction.message.id;
              const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
              const Embedcolor = interaction.message.embeds[0].color;
              const EmbedURL = interaction.message.embeds[0].url;
              const des = interaction.message.embeds[0].description;
      
              const webhook = new WebhookClient({ url: `${webhookURL}` });
              const message = interaction.message;
      
              const newFields = [
                { name: "Rate :", value: "⭐" },
              ];
      
              const newEmbed = new MessageEmbed()
              .setDescription(des)
              .setTitle(feedbackowner)
              .setURL(EmbedURL)
              .setColor(Embedcolor)
              .addFields(newFields)
              .setTimestamp(Date.now());
      
            await webhook.editMessage(message.id, {
              content: null,
              embeds: [newEmbed],
              components: []
            }).then(()=>{
              unWantedJson.delete(`FeedBackWebhook_${messageID}`)
            })
            }
          }else if(interaction.customId ===`feedback_2`){
            const feedbackowner = interaction.message.embeds[0].title;
            if (!feedbackowner.includes(interaction.user.id)) {
              await interaction.deferUpdate();
            }else{
              await interaction.deferUpdate();
              const messageID = interaction.message.id;
              const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
              const Embedcolor = interaction.message.embeds[0].color;
              const EmbedURL = interaction.message.embeds[0].url;
              const des = interaction.message.embeds[0].description;
      
              const webhook = new WebhookClient({ url: `${webhookURL}` });
              const message = interaction.message;
      
              const newFields = [
                { name: "Rate :", value: "⭐⭐" },
              ];
      
              const newEmbed = new MessageEmbed()
              .setDescription(des)
              .setTitle(feedbackowner)
              .setURL(EmbedURL)
              .setColor(Embedcolor)
              .addFields(newFields)
              .setTimestamp(Date.now());
      
            await webhook.editMessage(message.id, {
              content: null,
              embeds: [newEmbed],
              components: []
            }).then(()=>{
              unWantedJson.delete(`FeedBackWebhook_${messageID}`)
            })
            }
          }else if(interaction.customId ===`feedback_3`){
            const feedbackowner = interaction.message.embeds[0].title;
            if (!feedbackowner.includes(interaction.user.id)) {
              await interaction.deferUpdate();
            }else{
              await interaction.deferUpdate();
              const messageID = interaction.message.id;
              const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
              const Embedcolor = interaction.message.embeds[0].color;
              const EmbedURL = interaction.message.embeds[0].url;
              const des = interaction.message.embeds[0].description;
      
              const webhook = new WebhookClient({ url: `${webhookURL}` });
              const message = interaction.message;
      
              const newFields = [
                { name: "Rate :", value: "⭐⭐⭐" },
              ];
      
              const newEmbed = new MessageEmbed()
              .setDescription(des)
              .setTitle(feedbackowner)
              .setURL(EmbedURL)
              .setColor(Embedcolor)
              .addFields(newFields)
              .setTimestamp(Date.now());
      
            await webhook.editMessage(message.id, {
              content: null,
              embeds: [newEmbed],
              components: []
            }).then(()=>{
              unWantedJson.delete(`FeedBackWebhook_${messageID}`)
            })
            }
          }else if(interaction.customId ===`feedback_4`){
            const feedbackowner = interaction.message.embeds[0].title;
            if (!feedbackowner.includes(interaction.user.id)) {
              await interaction.deferUpdate();
            }else{
              await interaction.deferUpdate();
              const messageID = interaction.message.id;
              const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
              const Embedcolor = interaction.message.embeds[0].color;
              const EmbedURL = interaction.message.embeds[0].url;
              const des = interaction.message.embeds[0].description;
      
              const webhook = new WebhookClient({ url: `${webhookURL}` });
              const message = interaction.message;
      
              const newFields = [
                { name: "Rate :", value: "⭐⭐⭐⭐" },
              ];
      
              const newEmbed = new MessageEmbed()
              .setDescription(des)
              .setTitle(feedbackowner)
              .setURL(EmbedURL)
              .setColor(Embedcolor)
              .addFields(newFields)
              .setTimestamp(Date.now());
      
            await webhook.editMessage(message.id, {
              content: null,
              embeds: [newEmbed],
              components: []
            }).then(()=>{
              unWantedJson.delete(`FeedBackWebhook_${messageID}`)
            })
            }
          }else if(interaction.customId ===`feedback_5`){
            const feedbackowner = interaction.message.embeds[0].title;
            if (!feedbackowner.includes(interaction.user.id)) {
              await interaction.deferUpdate();
            }else{
              await interaction.deferUpdate();
              const messageID = interaction.message.id;
              const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
              const Embedcolor = interaction.message.embeds[0].color;
              const EmbedURL = interaction.message.embeds[0].url;
              const des = interaction.message.embeds[0].description;
      
              const webhook = new WebhookClient({ url: `${webhookURL}` });
              const message = interaction.message;
      
              const newFields = [
                { name: "Rate :", value: "⭐⭐⭐⭐⭐" },
              ];
      
              const newEmbed = new MessageEmbed()
              .setDescription(des)
              .setTitle(feedbackowner)
              .setURL(EmbedURL)
              .setColor(Embedcolor)
              .addFields(newFields)
              .setTimestamp(Date.now());
      
            await webhook.editMessage(message.id, {
              content: null,
              embeds: [newEmbed],
              components: []
            }).then(()=>{
              unWantedJson.delete(`FeedBackWebhook_${messageID}`)
            })
            }
          }
        })
      
          runDB.pull('Runs_feedback',botID).then(()=>{
            client13.login(DB.token).then(()=>{
           }).catch((err) => {
            let autofilter = feed.filter(a => a != DB.BotID)
            db2.set(`feedback` , autofilter)
             });
          })
            

      }
    }
  }
  } catch (error) {
    console.log(error)
  }
}, 5000);