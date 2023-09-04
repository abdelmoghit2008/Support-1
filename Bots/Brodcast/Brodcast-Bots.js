const { Database } = require("st.db")
const brodcastdb = new Database("/Json-db/Bots/BrodcastDB.json")
const runDB = new Database("/Json-db/Others/RunDB");

const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let brodcast = db2.get('brodcast') || []
const path = require('path');
const { readdirSync } = require("fs");

brodcast.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client17 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")


  client17.commands = new Discord.Collection();
  client17.events = new Discord.Collection();
  require("./handlers/events")(client17);
  require("../../handlers/Brodcast-commands")(client17);
  client17.on('ready', async () => {
    brodcastdb.deleteAll()
      const data = await brodcastdb.get(`Brodcast_Status_${client17.user.id}`) || []
      const Activity = await data.Activity
      const type = await data.Type
      const botstatus = await data.Presence || "online"
      const statuses = [
        Activity
      ];

      client17.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
      client17.user.setPresence({
        status: botstatus,
      });
  });

  client17.Brodcastbotsslashcommands = new Collection();
  const Brodcastbotsslashcommands = [];


  client17.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Brodcastbotsslashcommands,
        });

      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand17');

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
        Brodcastbotsslashcommands.push(command.data);
        client17.Brodcastbotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }


  client17.login(data.token).catch(() => {
    let autofilter = brodcast.filter(a => a.BotID != data.BotID)
            db2.set(`brodcast` , autofilter)
  });
});


setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_brodcast');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`brodcast`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);

        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client17 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
      
      
        client17.commands = new Discord.Collection();
        client17.events = new Discord.Collection();
        require("./handlers/events")(client17);
        require("../../handlers/Brodcast-commands")(client17);
        client17.on('ready', async () => {
          brodcastdb.deleteAll()
            const data = await brodcastdb.get(`Brodcast_Status_${client17.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"

      
            client17.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client17.user.setPresence({
              status: botstatus,
            });
        });
      
        client17.Brodcastbotsslashcommands = new Collection();
        const Brodcastbotsslashcommands = [];
      
      
        client17.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(DB.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                body: Brodcastbotsslashcommands,
              });
      
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        const folderPath = path.join(__dirname, 'slashcommand17');
      
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
              Brodcastbotsslashcommands.push(command.data);
              client17.Brodcastbotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
          runDB.pull('Runs_brodcast',botID).then(()=>{
            client17.login(DB.token).then(()=>{
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