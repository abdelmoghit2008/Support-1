const { Database } = require("st.db")
const db2 = new Database("Json-tokens/Tokens.json")
const scammerdb = new Database("/Json-db/Bots/ScammerDB.json")

const runDB = new Database("/Json-db/Others/RunDB");

const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let scammer = db2.get('scammer') || []
const path = require('path');
const { readdirSync } = require("fs");

scammer.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client16 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")

  client16.TaxButtons = new Discord.Collection();
  client16.commands = new Discord.Collection();
  client16.events = new Discord.Collection();
  require("../../handlers/Scammer-commands")(client16);
  // require("../../handlers/Scammer-button")(client16);
  require("./handlers/events")(client16);

  client16.on('ready', async () => {
      const data = scammerdb.get(`Scammer_Status_${client16.user.id}`) || []
      const Activity = data.Activity
      const type = data.Type
      const botstatus = data.Presence || "online"
      const statuses = [
        Activity
      ];

      client16.user.setActivity(statuses[Activity], { type: type, url: 'https://www.twitch.tv/Coder' });
      client16.user.setPresence({
        status: botstatus,
      });
  });

  
  client16.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: ScammerBotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  client16.ScammerBotsslashcommands = new Collection();
  const ScammerBotsslashcommands = [];

  const folderPath = path.join(__dirname, 'slashcommand16');

  const ascii = require("ascii-table");
  const table = new ascii("Tax commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
  )) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
    )) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        ScammerBotsslashcommands.push(command.data);
        client16.ScammerBotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }


  client16.on(`interactionCreate`, async i => {
    try {
      if (!i.isButton()) return;
  
      if (i.customId === `Scammer_BackButton_${i.message.id}` || i.customId === `Scammer_NextButton_${i.message.id}`) {
        i.deferUpdate();
        const messageId = i.customId.split(`_`).pop();
        const proof = scammerdb.get(`ScammerProof_${client16.user.id}_${messageId}`);
  
        if (!proof) return;
  
        const files = [
          proof.url1,
          proof.url2,
          proof.url3,
          proof.url4,
          proof.url5,
          proof.url6,
          proof.url7,
          proof.url8,
          proof.url9,
          proof.url10
        ];
  
        const currentIndex = files.findIndex(url => url === i.message.embeds[0].image.url);
        const nextIndex = i.customId.startsWith(`Scammer_NextButton_`) ? currentIndex + 1 : currentIndex - 1;
  
        if (nextIndex >= 0 && nextIndex < files.length) {
          const nextImageUrl = files[nextIndex];
          if (nextImageUrl) {
            const newEmbed = i.message.embeds[0].setImage(nextImageUrl);
            i.message.edit({ embeds: [newEmbed] });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
  
  


  client16.login(data.token).catch(() => {
    let autofilter = scammer.filter(a => a.BotID != data.BotID)
            db2.set(`scammer` , autofilter)
    
  });
});



setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_scammer');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`scammer`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);

          
          
        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client16 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
      
        client16.TaxButtons = new Discord.Collection();
        client16.commands = new Discord.Collection();
        client16.events = new Discord.Collection();
        require("../../handlers/Scammer-commands")(client16);
        // require("../../handlers/Scammer-button")(client16);
        require("./handlers/events")(client16);
      
        client16.on('ready', async () => {
            const data = scammerdb.get(`Scammer_Status_${client16.user.id}`) || []
            const Activity = data.Activity
            const type = data.Type
            const botstatus = data.Presence || "online"
            const statuses = [
              Activity
            ];
      
            client16.user.setActivity(statuses[Activity], { type: type, url: 'https://www.twitch.tv/Coder' });
            client16.user.setPresence({
              status: botstatus,
            });
        });
      
        
        client16.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(DB.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                body: ScammerBotsslashcommands,
              });
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        client16.ScammerBotsslashcommands = new Collection();
        const ScammerBotsslashcommands = [];
      
        const folderPath = path.join(__dirname, 'slashcommand16');
      
        const ascii = require("ascii-table");
        const table = new ascii("Tax commands").setJustify();
        for (let folder of readdirSync(folderPath).filter(
          (folder) => !folder.includes(".")
        )) {
          for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
            f.endsWith(".js")
          )) {
            let command = require(`${folderPath}/${folder}/${file}`);
            if (command) {
              ScammerBotsslashcommands.push(command.data);
              client16.ScammerBotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
      
        client16.on(`interactionCreate`, async i => {
          try {
            if (!i.isButton()) return;
        
            if (i.customId === `Scammer_BackButton_${i.message.id}` || i.customId === `Scammer_NextButton_${i.message.id}`) {
              i.deferUpdate();
              const messageId = i.customId.split(`_`).pop();
              const proof = scammerdb.get(`ScammerProof_${client16.user.id}_${messageId}`);
        
              if (!proof) return;
        
              const files = [
                proof.url1,
                proof.url2,
                proof.url3,
                proof.url4,
                proof.url5,
                proof.url6,
                proof.url7,
                proof.url8,
                proof.url9,
                proof.url10
              ];
        
              const currentIndex = files.findIndex(url => url === i.message.embeds[0].image.url);
              const nextIndex = i.customId.startsWith(`Scammer_NextButton_`) ? currentIndex + 1 : currentIndex - 1;
        
              if (nextIndex >= 0 && nextIndex < files.length) {
                const nextImageUrl = files[nextIndex];
                if (nextImageUrl) {
                  const newEmbed = i.message.embeds[0].setImage(nextImageUrl);
                  i.message.edit({ embeds: [newEmbed] });
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        });

      
          runDB.pull('Runs_scammer',botID).then(()=>{
            client16.login(DB.token).then(()=>{
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