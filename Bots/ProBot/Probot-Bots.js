const { Database } = require("st.db")
const probotdb = new Database("/Json-db/Bots/probot.json")
const runDB = new Database("/Json-db/Others/RunDB");

const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let probot = db2.get('probot') || []
const path = require('path');
const { readdirSync } = require("fs");

probot.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client15 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")


  client15.events = new Discord.Collection();
  require("./handlers/events")(client15);

  client15.on('ready', async () => {
    const data = await probotdb.get(`Probot_Status_${client15.user.id}`) || []
    const Activity = await data.Activity
    const type = await data.Type
    const botstatus = await data.Presence || "online"


    client15.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
    client15.user.setPresence({
      status: botstatus,
    });
  });

  client15.Probotbotsslashcommands = new Collection();
  const Probotbotsslashcommands = [];


  client15.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Probotbotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand15');

  const ascii = require("ascii-table");
  const table = new ascii("probot commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
  )) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
    )) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        Probotbotsslashcommands.push(command.data);
        client15.Probotbotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }


  client15.on('messageCreate', async (message) => {
    const status = probotdb.get(`probotSystem_${message.guild.id}`) || "on"
    if (status === "on") {
      if (message.content.includes('type these numbers to confirm')) return;

      if (message.author.id === '282859044593598464') {
        try {
          if (message.content.includes('You are eligible to receive your daily for the bot!')) {
            const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
            await message.delete();
            const row = new MessageActionRow()
              .addComponents(buttonComponent);
            return message.channel.send({
              content: `${message.content}`,
              components: [row]
            });
          }
          if (message.content.includes('You can get up to 2600 credits if you vote for ProBot!')) {
            const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
            await message.delete();
            const row = new MessageActionRow()
              .addComponents(buttonComponent);
            return message.channel.send({
              content: `${message.content}`,
              components: [row]
            });
          }
          if (message.author.bot && message.embeds.length > 0) {
            await message.delete();
            const embed = new MessageEmbed(message.embeds[0]);
            return message.channel.send({ embeds: [embed] });
          }

          if (message.content && message.attachments.size > 0) {
            const attach = message.attachments.first();
            await message.delete();
            return message.channel.send({ content: `${message}`, files: [{ name: `'pic.png'`, attachment: attach.url }] });
          }

          if (message.attachments.size > 0) {
            const attach = message.attachments.first();
            await message.delete();
            return message.channel.send({ files: [{ name: 'pic.png', attachment: attach.url }] });
          }

          await message.delete().catch(err => { })
          const sentMessage = await message.channel.send({ content: `${message}` });

          if (sentMessage.content.includes('Cool down')) {
            setTimeout(() => {
              sentMessage.delete();
            }, 3000);
          }
          if (sentMessage.content.includes(`Deleting messages`)) {
            setTimeout(() => {
              sentMessage.delete();
            }, 3000);
          }
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      return;
    }
  });

  client15.on("messageCreate", async (message) => {
    try {
      const status = probotdb.get(`probotSystem_${message.guild.id}`) || "on";
      if (status === "on") {
        const args = message.content.split(" ");
        let id = message.content.split(" ")[1];
        const member = message.mentions.members?.first() || message.guild.members.cache.get(id);
        if (message.author.id === "282859044593598464") {
          if (message.content.includes(`type these numbers to confirm`)) {
            user = message.mentions.repliedUser?.id;
            username = message.mentions.repliedUser.username;

            await message.channel.send({ files: [{ name: `pic.png`, attachment: `${message.attachments.first().url}` }], content: `${message}` }).then(async (msg) => {

              message.delete();

              const filter = (m) => m.author.id === user;
              const collector = message.channel.createMessageCollector({ filter, max: 1, time: 20000, errors: ["time"] });

              collector.on("collect", async (response) => {
                if(msg){
                  msg.delete();
                }
              });

              collector.on("end", (collected) => {
                if (collected.size === 0) {
                  if (msg) {
                    msg.delete()
                  }
                }
              });
            })
          }
        }
      } else {
        return;
      }
    } catch (error) {
      
    }
  });



  client15.login(data.token).catch(() => {
    let autofilter = probot.filter(a => a.BotID != data.BotID)
            db2.set(`probot` , autofilter)

  });
});


setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_probot');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`probot`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);


        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client15 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
      
      
        client15.events = new Discord.Collection();
        require("./handlers/events")(client15);
      
        client15.on('ready', async () => {
          const data = await probotdb.get(`Probot_Status_${client15.user.id}`) || []
          const Activity = await data.Activity
          const type = await data.Type
          const botstatus = await data.Presence || "online"
      
      
          client15.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
          client15.user.setPresence({
            status: botstatus,
          });
        });
      
        client15.Probotbotsslashcommands = new Collection();
        const Probotbotsslashcommands = [];
      
      
        client15.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(DB.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                body: Probotbotsslashcommands,
              });
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        const folderPath = path.join(__dirname, 'slashcommand15');
      
        const ascii = require("ascii-table");
        const table = new ascii("probot commands").setJustify();
        for (let folder of readdirSync(folderPath).filter(
          (folder) => !folder.includes(".")
        )) {
          for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
            f.endsWith(".js")
          )) {
            let command = require(`${folderPath}/${folder}/${file}`);
            if (command) {
              Probotbotsslashcommands.push(command.data);
              client15.Probotbotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
      
        client15.on('messageCreate', async (message) => {
          const status = probotdb.get(`probotSystem_${message.guild.id}`) || "on"
          if (status === "on") {
            if (message.content.includes('type these numbers to confirm')) return;
      
            if (message.author.id === '282859044593598464') {
              try {
                if (message.content.includes('You are eligible to receive your daily for the bot!')) {
                  const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
                  await message.delete();
                  const row = new MessageActionRow()
                    .addComponents(buttonComponent);
                  return message.channel.send({
                    content: `${message.content}`,
                    components: [row]
                  });
                }
                if (message.content.includes('You can get up to 2600 credits if you vote for ProBot!')) {
                  const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
                  await message.delete();
                  const row = new MessageActionRow()
                    .addComponents(buttonComponent);
                  return message.channel.send({
                    content: `${message.content}`,
                    components: [row]
                  });
                }
                if (message.author.bot && message.embeds.length > 0) {
                  await message.delete();
                  const embed = new MessageEmbed(message.embeds[0]);
                  return message.channel.send({ embeds: [embed] });
                }
      
                if (message.content && message.attachments.size > 0) {
                  const attach = message.attachments.first();
                  await message.delete();
                  return message.channel.send({ content: `${message}`, files: [{ name: `'pic.png'`, attachment: attach.url }] });
                }
      
                if (message.attachments.size > 0) {
                  const attach = message.attachments.first();
                  await message.delete();
                  return message.channel.send({ files: [{ name: 'pic.png', attachment: attach.url }] });
                }
      
                await message.delete().catch(err => { })
                const sentMessage = await message.channel.send({ content: `${message}` });
      
                if (sentMessage.content.includes('Cool down')) {
                  setTimeout(() => {
                    sentMessage.delete();
                  }, 3000);
                }
                if (sentMessage.content.includes(`Deleting messages`)) {
                  setTimeout(() => {
                    sentMessage.delete();
                  }, 3000);
                }
              } catch (error) {
                console.log(error)
              }
            }
          } else {
            return;
          }
        });
      
        client15.on("messageCreate", async (message) => {
          try {
            const status = probotdb.get(`probotSystem_${message.guild.id}`) || "on";
            if (status === "on") {
              const args = message.content.split(" ");
              let id = message.content.split(" ")[1];
              const member = message.mentions.members?.first() || message.guild.members.cache.get(id);
              if (message.author.id === "282859044593598464") {
                if (message.content.includes(`type these numbers to confirm`)) {
                  user = message.mentions.repliedUser?.id;
                  username = message.mentions.repliedUser.username;
      
                  await message.channel.send({ files: [{ name: `pic.png`, attachment: `${message.attachments.first().url}` }], content: `${message}` }).then(async (msg) => {
      
                    message.delete();
      
                    const filter = (m) => m.author.id === user;
                    const collector = message.channel.createMessageCollector({ filter, max: 1, time: 20000, errors: ["time"] });
      
                    collector.on("collect", async (response) => {
                      if(msg){
                        msg.delete();
                      }
                    });
      
                    collector.on("end", (collected) => {
                      if (collected.size === 0) {
                        if (msg) {
                          msg.delete()
                        }
                      }
                    });
                  })
                }
              }
            } else {
              return;
            }
          } catch (error) {
            
          }
        });


          runDB.pull('Runs_probot',botID).then(()=>{
            client15.login(DB.token).then(()=>{
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