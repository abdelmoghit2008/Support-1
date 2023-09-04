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
const { Database } = require("st.db");
const db2 = new Database("/Json-tokens/Tokens.json");

const systemDB = new Database("/Json-db/Bots/SystemDB.json");
const runDB = new Database("/Json-db/Others/RunDB");

let system = db2.get("system") || [];
const fs = require('fs');
const path = require('path');
const { readdirSync } = require("fs");

const prefixDB = new Database("/Json-db/Others/PrefixDB.json")

system.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client7 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")
  client7.setMaxListeners(999);

  client7.commands = new Discord.Collection();
  client7.events = new Discord.Collection();
  require("../../handlers/System-commands")(client7);
  require("./handlers/events")(client7);

  client7.on('ready', async () => {
      const data = systemDB.get(`system_Status_${client7.user.id}`) || []
      const Activity = data.Activity
      const type = data.Type
      const botstatus = data.Presence || "online"
      const statuses = [
        Activity
      ];

      client7.user.setActivity(statuses[Activity], { type: type, url: 'https://www.twitch.tv/Coder' });
      client7.user.setPresence({
        status: botstatus,
      });
  });


  client7.SystemBotsslashcommands = new Collection();
  const SystemBotsslashcommands = [];


  client7.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: SystemBotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand7');

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
        SystemBotsslashcommands.push(command.data);
        client7.SystemBotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }

  client7.on(`messageCreate`, async message =>{
    if(!message.guild || message.author.bot) return;
    const DB = new Database("/Json-db/Bots/SystemAutoReplyDB.json")
    const theReplysDB = DB.get(`Autoreply_${message.guild.id}`)
    if(!theReplysDB) return;
    theReplysDB.forEach(data =>{
      const {word ,reply , replyonmessage ,mention , deletemessage , Wildcard} = data
      if(word === message.content && replyonmessage === "False" && mention === "False" && deletemessage === "False" && Wildcard === "False"){
        return message.channel.send({content: `${reply}`})
      }else if(word === message.content && replyonmessage === "True" && mention === "False" && deletemessage === "False" && Wildcard === "False"){
        return message.reply(`${reply}`)
      }else if(word === message.content && replyonmessage === "True" && mention === "True" && deletemessage === "False" && Wildcard === "False"){
        return message.reply(`${reply} <@!${message.author.id}>`)
      }else if(word === message.content && replyonmessage === "True" && mention === "True" && deletemessage === "True" && Wildcard === "False"){
        return message.reply(`${reply} <@!${message.author.id}>`).then(()=>{
          message.delete().catch(err =>{})
        })
      }else if(message.content.includes(word) && replyonmessage === "True" && mention === "True" && deletemessage === "True" && Wildcard === "True"){
        return message.reply(`${reply} <@!${message.author.id}>`).then(()=>{
          message.delete().catch(err =>{})
        })
      }else if(message.content.includes(word) && replyonmessage === "False" && mention === "True" && deletemessage === "True" && Wildcard === "True"){
        return message.channel.send(`${reply} <@!${message.author.id}>`).then(()=>{
          message.delete().catch(err =>{})
        })
      }else if(message.content.includes(word) && replyonmessage === "False" && mention === "False" && deletemessage === "True" && Wildcard === "True"){
        return message.channel.send(`${reply}`).then(()=>{
          message.delete().catch(err =>{})
        })
      }else if(message.content.includes(word) && replyonmessage === "False" && mention === "False" && deletemessage === "False" && Wildcard === "True"){
        return message.channel.send(`${reply}`)
      }else if(word === message.content && replyonmessage === "False" && mention === "False" && deletemessage === "True" && Wildcard === "False"){
        return message.channel.send({content: `${reply}`}).then(()=>{
          message.delete().catch(err =>{})
        })
      }else if(word === message.content && replyonmessage === "False" && mention === "True" && deletemessage === "True" && Wildcard === "False"){
        return message.channel.send({content: `${reply} <@!${message.author.id}>`}).then(()=>{
          message.delete().catch(err =>{})
        })
      }else if(word === message.content && replyonmessage === "True" && mention === "False" && deletemessage === "True" && Wildcard === "False"){
        return message.reply({content: `${reply}`}).then(()=>{
          message.delete().catch(err =>{})
        })
      }else if(message.content.includes(word) && replyonmessage === "False" && mention === "True" && deletemessage === "False" && Wildcard === "True"){
        return message.channel.send({content: `${reply} @!${message.author.id}>`})
      }else if(message.content.includes(word) && replyonmessage === "True" && mention === "False" && deletemessage === "False" && Wildcard === "True"){
        return message.reply({content: `${reply}`})
      }else if(message.content.includes(word) && replyonmessage === "True" && mention === "True" && deletemessage === "False" && Wildcard === "True"){
        return message.reply({content: `${reply} <@!${message.author.id}>`})
      }
    })
  })

  client7.login(data.token).catch(() => {
    let autofilter = system.filter(a => a.BotID != data.BotID)
            db2.set(`system` , autofilter)
    
  });
});



setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_system');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`system`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);
          

        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client7 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
        client7.setMaxListeners(999);
      
        client7.commands = new Discord.Collection();
        client7.events = new Discord.Collection();
        require("../../handlers/System-commands")(client7);
        require("./handlers/events")(client7);
      
        client7.on('ready', async () => {
            const data = await systemDB.get(`system_Status_${client7.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
            client7.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client7.user.setPresence({
              status: botstatus,
            });
        });
      
      
        client7.SystemBotsslashcommands = new Collection();
        const SystemBotsslashcommands = [];
      
      
        client7.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(DB.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                body: SystemBotsslashcommands,
              });
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        const folderPath = path.join(__dirname, 'slashcommand7');
      
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
              SystemBotsslashcommands.push(command.data);
              client7.SystemBotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
        client7.on(`messageCreate`, async message =>{
          if(!message.guild || message.author.bot) return;
          const DB = new Database("/Json-db/Bots/SystemAutoReplyDB.json")
          const theReplysDB = DB.get(`Autoreply_${message.guild.id}`)
          if(!theReplysDB) return;
          theReplysDB.forEach(data =>{
            const {word ,reply , replyonmessage ,mention , deletemessage , Wildcard} = data
            if(word === message.content && replyonmessage === "False" && mention === "False" && deletemessage === "False" && Wildcard === "False"){
              return message.channel.send({content: `${reply}`})
            }else if(word === message.content && replyonmessage === "True" && mention === "False" && deletemessage === "False" && Wildcard === "False"){
              return message.reply(`${reply}`)
            }else if(word === message.content && replyonmessage === "True" && mention === "True" && deletemessage === "False" && Wildcard === "False"){
              return message.reply(`${reply} <@!${message.author.id}>`)
            }else if(word === message.content && replyonmessage === "True" && mention === "True" && deletemessage === "True" && Wildcard === "False"){
              return message.reply(`${reply} <@!${message.author.id}>`).then(()=>{
                message.delete().catch(err =>{})
              })
            }else if(message.content.includes(word) && replyonmessage === "True" && mention === "True" && deletemessage === "True" && Wildcard === "True"){
              return message.reply(`${reply} <@!${message.author.id}>`).then(()=>{
                message.delete().catch(err =>{})
              })
            }else if(message.content.includes(word) && replyonmessage === "False" && mention === "True" && deletemessage === "True" && Wildcard === "True"){
              return message.channel.send(`${reply} <@!${message.author.id}>`).then(()=>{
                message.delete().catch(err =>{})
              })
            }else if(message.content.includes(word) && replyonmessage === "False" && mention === "False" && deletemessage === "True" && Wildcard === "True"){
              return message.channel.send(`${reply}`).then(()=>{
                message.delete().catch(err =>{})
              })
            }else if(message.content.includes(word) && replyonmessage === "False" && mention === "False" && deletemessage === "False" && Wildcard === "True"){
              return message.channel.send(`${reply}`)
            }else if(word === message.content && replyonmessage === "False" && mention === "False" && deletemessage === "True" && Wildcard === "False"){
              return message.channel.send({content: `${reply}`}).then(()=>{
                message.delete().catch(err =>{})
              })
            }else if(word === message.content && replyonmessage === "False" && mention === "True" && deletemessage === "True" && Wildcard === "False"){
              return message.channel.send({content: `${reply} <@!${message.author.id}>`}).then(()=>{
                message.delete().catch(err =>{})
              })
            }else if(word === message.content && replyonmessage === "True" && mention === "False" && deletemessage === "True" && Wildcard === "False"){
              return message.reply({content: `${reply}`}).then(()=>{
                message.delete().catch(err =>{})
              })
            }else if(message.content.includes(word) && replyonmessage === "False" && mention === "True" && deletemessage === "False" && Wildcard === "True"){
              return message.channel.send({content: `${reply} @!${message.author.id}>`})
            }else if(message.content.includes(word) && replyonmessage === "True" && mention === "False" && deletemessage === "False" && Wildcard === "True"){
              return message.reply({content: `${reply}`})
            }else if(message.content.includes(word) && replyonmessage === "True" && mention === "True" && deletemessage === "False" && Wildcard === "True"){
              return message.reply({content: `${reply} <@!${message.author.id}>`})
            }
          })
        })
      
          runDB.pull('Runs_system',botID).then(()=>{
            client7.login(DB.token).then(()=>{
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