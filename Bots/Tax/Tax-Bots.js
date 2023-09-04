const { Database } = require("st.db")
const db2 = new Database("Json-tokens/Tokens.json")
const taxdb = require("../../Schema/BotsDB/Tax")
const jsonDB = new Database("/Json-db/Bots/TaxDB.json")

const runDB = new Database("/Json-db/Others/RunDB");


const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
let tax = db2.get('tax') || []
const path = require('path');
const { readdirSync } = require("fs");

tax.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client4 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")

  client4.TaxButtons = new Discord.Collection();
  client4.commands = new Discord.Collection();
  client4.events = new Discord.Collection();
  require("../../handlers/Tax-commands")(client4);
  require("../../handlers/Tax-button")(client4);
  require("./handlers/events")(client4);

  client4.on('ready', async () => {
      const data = await jsonDB.get(`Tax_Status_${client4.user.id}`) || []
      const Activity = await data.Activity
      const type = await data.Type
      const botstatus = await data.Presence || "online"
      const statuses = [
        Activity
      ];

      client4.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
      client4.user.setPresence({
        status: botstatus,
      });

  });

  
  client4.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: TaxBotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  client4.TaxBotsslashcommands = new Collection();
  const TaxBotsslashcommands = [];

  const folderPath = path.join(__dirname, 'slashcommand4');

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
        TaxBotsslashcommands.push(command.data);
        client4.TaxBotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }

  client4.on("messageCreate", async function (message) {
    if (message.author.bot || !message.guild) return;
    let args = message.content.split(" ").slice(0).join(" ");

    if (args.endsWith("m")) args = args.replace(/m/gi, "") * 1000000;
    else if (args.endsWith("k")) args = args.replace(/k/gi, "") * 1000;
    else if (args.endsWith("K")) args = args.replace(/K/gi, "") * 1000;
    else if (args.endsWith("M")) args = args.replace(/M/gi, "") * 1000000;



    let args2 = parseInt(args)
    let number = (args2)

    let tax = Math.floor(args2 * (20) / (19) + (1))
    let tax2 = Math.floor(tax * (20) / (19) + (1))
    let tax3 = Math.floor(tax2 * (15.3265) / (15.1) + (0) - (tax2))
    let tax4 = Math.floor((tax2 + tax3) * (20) / (19.99999) + (0))
    let tax5 = Math.floor((tax) * (20) / (19) + (1))

    const ServerData = await taxdb.findOne({ guildID: message.guild.id }) || []

    if (ServerData && ServerData.channels &&ServerData.channels.includes(message.channel.id)) {
      const Taxmessage = ServerData.message || ''
      if (Taxmessage) {
        let messageContent = Taxmessage.replace("[amount]", args)
          .replace("[tax1]", tax)
          .replace("[tax2]", tax4)
          .replace("[tax3]", tax3)
          .replace("[tax4]", tax5);
        const embed = new Discord.MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setDescription(messageContent);
        if (ServerData.type === `embed`) {
          message.reply({ embeds: [embed] }).then(() => {
            if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})


          })
        } else {
          message.reply({ content: `${messageContent}` }).then(() => {
            if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})


          })
        }

      } else {
        let probottakes1 = Math.floor(args2 * (20) / (19) + (1) - (args2))

        MessageConetnt = `✔ __**The tax for**__ \`${number}\`\n**Is : **\`${tax}\`\n**Probot takes : **\`${probottakes1}\``
        const embed = new Discord.MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setDescription(MessageConetnt)


          if (ServerData.type === `embed`) {
            message.reply({ embeds: [embed] }).then(() => {
              if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})

            })
          } else {
            message.reply({ content: `${MessageConetnt}` }).then(() => {
              if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})

            })
          }
        
      }

    }
  });



  client4.on("interactionCreate", async (interaction) => {
    if (interaction.isModalSubmit() && interaction.customId === `AutoTax_Message`) {
      try {
        let messageText = interaction.fields.getTextInputValue("MessageText");

        await taxdb.findOneAndUpdate(
          { guildID: interaction.guild.id },
          { message: messageText },
          { upsert: true }
      ).then(() =>{
        interaction.reply(`[+] تم حفظ الرساله`)
      })


      } catch (error) {
        console.log(error);
      }
    }
  });



  client4.login(data.token).catch(() => {
    let autofilter = tax.filter(a => a.BotID != data.BotID)
            db2.set(`tax` , autofilter)
    
  });
});



setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_tax');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`tax`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);

        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client4 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
      
        client4.TaxButtons = new Discord.Collection();
        client4.commands = new Discord.Collection();
        client4.events = new Discord.Collection();
        require("../../handlers/Tax-commands")(client4);
        require("../../handlers/Tax-button")(client4);
        require("./handlers/events")(client4);
      
        client4.on('ready', async () => {
            const data = await jsonDB.get(`Tax_Status_${client4.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
            const statuses = [
              Activity
            ];
      
            client4.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client4.user.setPresence({
              status: botstatus,
            });
      
        });
      
        
        client4.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(data.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(data.CLIENTID), {
                body: TaxBotsslashcommands,
              });
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        client4.TaxBotsslashcommands = new Collection();
        const TaxBotsslashcommands = [];
      
        const folderPath = path.join(__dirname, 'slashcommand4');
      
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
              TaxBotsslashcommands.push(command.data);
              client4.TaxBotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
        client4.on("messageCreate", async function (message) {
          if (message.author.bot || !message.guild) return;
          let args = message.content.split(" ").slice(0).join(" ");
      
          if (args.endsWith("m")) args = args.replace(/m/gi, "") * 1000000;
          else if (args.endsWith("k")) args = args.replace(/k/gi, "") * 1000;
          else if (args.endsWith("K")) args = args.replace(/K/gi, "") * 1000;
          else if (args.endsWith("M")) args = args.replace(/M/gi, "") * 1000000;
      
      
      
          let args2 = parseInt(args)
          let number = (args2)
      
          let tax = Math.floor(args2 * (20) / (19) + (1))
          let tax2 = Math.floor(tax * (20) / (19) + (1))
          let tax3 = Math.floor(tax2 * (15.3265) / (15.1) + (0) - (tax2))
          let tax4 = Math.floor((tax2 + tax3) * (20) / (19.99999) + (0))
          let tax5 = Math.floor((tax) * (20) / (19) + (1))
      
          const ServerData = await taxdb.findOne({ guildID: message.guild.id }) || []
      
          if (ServerData && ServerData.channels &&ServerData.channels.includes(message.channel.id)) {
            const Taxmessage = ServerData.message || ''
            if (Taxmessage) {
              let messageContent = Taxmessage.replace("[amount]", args)
                .replace("[tax1]", tax)
                .replace("[tax2]", tax4)
                .replace("[tax3]", tax3)
                .replace("[tax4]", tax5);
              const embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setDescription(messageContent);
              if (ServerData.type === `embed`) {
                message.reply({ embeds: [embed] }).then(() => {
                  if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})
      
      
                })
              } else {
                message.reply({ content: `${messageContent}` }).then(() => {
                  if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})
      
      
                })
              }
      
            } else {
              let probottakes1 = Math.floor(args2 * (20) / (19) + (1) - (args2))
      
              MessageConetnt = `✔ __**The tax for**__ \`${number}\`\n**Is : **\`${tax}\`\n**Probot takes : **\`${probottakes1}\``
              const embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setDescription(MessageConetnt)
      
      
                if (ServerData.type === `embed`) {
                  message.reply({ embeds: [embed] }).then(() => {
                    if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})
      
                  })
                } else {
                  message.reply({ content: `${MessageConetnt}` }).then(() => {
                    if (ServerData && ServerData.line) return message.channel.send({files:[ServerData.line]})
      
                  })
                }
              
            }
      
          }
        });
      
      
      
        client4.on("interactionCreate", async (interaction) => {
          if (interaction.isModalSubmit() && interaction.customId === `AutoTax_Message`) {
            try {
              let messageText = interaction.fields.getTextInputValue("MessageText");
      
              await taxdb.findOneAndUpdate(
                { guildID: interaction.guild.id },
                { message: messageText },
                { upsert: true }
            ).then(() =>{
              interaction.reply(`[+] تم حفظ الرساله`)
            })
      
      
            } catch (error) {
              console.log(error);
            }
          }
        });
      
          runDB.pull('Runs_tax',botID).then(()=>{
            client4.login(DB.token).then(()=>{
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