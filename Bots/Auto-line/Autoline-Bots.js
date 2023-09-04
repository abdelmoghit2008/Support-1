const { Database } = require("st.db")
const autolinedb = require("../../Schema/BotsDB/Autoline");
const jsonDB = new Database("/Json-db/Bots/AutolineDB.json")

const runDB = new Database("/Json-db/Others/RunDB");

const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let autoline = db2.get('autoline') || []
const path = require('path');
const { readdirSync } = require("fs");

autoline.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client2 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")


  client2.commands = new Discord.Collection();
  client2.events = new Discord.Collection();
  require("../../handlers/Auto-line-commands")(client2);
  require("./handlers/events")(client2);



  client2.on('ready', async () => {
    const data = await jsonDB.get(`Autoline_Status_${client2.user.id}`) || []
    const Activity = await  data.Activity
    const type = await data.Type

      const botstatus = await data.Presence || "online"


      client2.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
      client2.user.setPresence({
        status: botstatus,
      });

  });

  client2.on(`messageCreate`, async message =>{
    if (message.content === `-` || message.content === `خط`){
      try {
      if (!message.guild) return;
      const ServerData = await autolinedb.findOne({ guildID: message.guild.id }) || []

      const embed = new Discord.MessageEmbed()
        .setColor('YELLOW')
        .setDescription('❗  __**Please set line url !set-line command**__');
        
      if (!message.member.permissions.has("ADMINISTRATOR") && ServerData && ServerData.allowedchannels &&!ServerData.allowedchannels.includes(message.channel.id)) return;
      if (!ServerData || !ServerData.line) return message.reply({ embeds: [embed] });

      await message.channel.send(ServerData.line).then(()=>{
         message.delete()
      })
      } catch (err) {
        console.error(err);
      }
    }
  });


  client2.on('messageCreate', async message => {
    try {
      if (!message.guild || message.author.bot) return;
      const embed = new Discord.MessageEmbed()
        .setColor('YELLOW')
        .setDescription('❗  __**Please set line url !set-line command**__');
      const ServerData = await autolinedb.findOne({ guildID: message.guild.id })
      if (!ServerData || !ServerData.channels && !ServerData.channels.includes(message.channel.id)) return;

      if(ServerData.channels.includes(message.channel.id)){
        if (!ServerData.line) return message.reply({ embeds: [embed] });
        await message.channel.send(ServerData.line);
      }

    } catch (err) {
      console.error(err);
    }
  });

  client2.Autolinebotsslashcommands = new Collection();
  const Autolinebotsslashcommands = [];


  client2.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Autolinebotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand2');

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
        Autolinebotsslashcommands.push(command.data);
        client2.Autolinebotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }
  

  client2.login(data.token).catch(() => {
    let autofilter = autoline.filter(a => a.BotID != data.BotID)
               db2.set(`autoline` , autofilter)
  });
});





setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_autoline');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`autoline`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);

          const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
          const Discord = require('discord.js');
          const client2 = new Client({ intents: 32767 });
          const { REST } = require("@discordjs/rest")
          const { Routes } = require("discord-api-types/v9")

          client2.commands = new Discord.Collection();
          client2.events = new Discord.Collection();
          require("../../handlers/Auto-line-commands")(client2);
          require("./handlers/events")(client2);
        
          client2.on('ready', async () => {
        
            const data = await jsonDB.get(`Autoline_Status_${client2.user.id}`) || []
            const Activity = await  data.Activity
            const type = await data.Type
        
              const botstatus = await data.Presence || "online"

        
              client2.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
              client2.user.setPresence({
                status: botstatus,
              });
        
          });
        
          client2.on(`messageCreate`, async message =>{
            if (message.content === `-` || message.content === `خط`){
              try {
              if (!message.guild) return;
              const ServerData = await autolinedb.findOne({ guildID: message.guild.id }) || []
        
              const embed = new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setDescription('❗  __**Please set line url !set-line command**__');
                
              if (!message.member.permissions.has("ADMINISTRATOR") && ServerData && ServerData.allowedchannels &&!ServerData.allowedchannels.includes(message.channel.id)) return;
              if (!ServerData || !ServerData.line) return message.reply({ embeds: [embed] });
        
              await message.channel.send(ServerData.line).then(()=>{
                 message.delete()
              })
              } catch (err) {
                console.error(err);
              }
            }
          });
        
        
          client2.on('messageCreate', async message => {
            try {
              if (!message.guild || message.author.bot) return;
              const embed = new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setDescription('❗  __**Please set line url !set-line command**__');
              const ServerData = await autolinedb.findOne({ guildID: message.guild.id })
              if (!ServerData || !ServerData.channels && !ServerData.channels.includes(message.channel.id)){
                return;
              } 
        
              if (!ServerData.line) return message.reply({ embeds: [embed] });
        
              await message.channel.send(ServerData.line);
            } catch (err) {
              console.error(err);
            }
          });
        
          client2.Autolinebotsslashcommands = new Collection();
          const Autolinebotsslashcommands = [];
        
        
          client2.on("ready", async () => {
            const rest = new REST({ version: "9" }).setToken(DB.token);
            (async () => {
              try {
                await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                  body: Autolinebotsslashcommands,
                });
              } catch (error) {
                console.error(error);
              }
            })();
          });
        
          const folderPath = path.join(__dirname, 'slashcommand2');
        
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
                Autolinebotsslashcommands.push(command.data);
                client2.Autolinebotsslashcommands.set(command.data.name, command);
                if (command.data.name) {
                  table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
                  table.addRow(`/${command.data.name}`, "🔴 Not Working");
                }
              }
            }
          }
          
      
          runDB.pull('Runs_autoline',botID).then(()=>{
            client2.login(DB.token).then(()=>{
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