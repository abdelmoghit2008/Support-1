const { Database } = require("st.db")
const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")

const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../Schema/BotsDB/Shop")
const runDB = new Database("/Json-db/Others/RunDB");

let shop = db2.get('shop') || []
const embedscolor = '#000000';
const _ = require('lodash');
const path = require('path');
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');
const ms = require('ms');
const internal = require("stream")

shop.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client12 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")
  client12.setMaxListeners(999);
  const fs = require('fs');
  const { readdirSync } = require("fs");


  client12.ShopSelectmenu = new Discord.Collection();
  client12.Shopcommands = new Discord.Collection();
  client12.events = new Discord.Collection();
  require("../../handlers/Shop-Selectmenu")(client12);
  require("../../handlers/Shop-commands")(client12);
  require("./handlers/events")(client12);

  client12.on('ready', async () => {
      const data = await jsonDB.get(`shop_Status_${client12.user.id}`) || []
      const Activity = await data.Activity
      const type = await data.Type
      const botstatus = await data.Presence || "online"


      client12.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
      client12.user.setPresence({
        status: botstatus,
      });
  });


  client12.Shopbotsslashcommands = new Collection();
  const Shopbotsslashcommands = [];

  client12.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Shopbotsslashcommands,
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

  const folderPath = path.join(__dirname, 'slashcommand12');

  const ascii = require("ascii-table");
  const table = new ascii("Shop commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
  )) {
    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
    )) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        Shopbotsslashcommands.push(command.data);
        client12.Shopbotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }


  //Timers things
  client12.on('ready', () => {
    try {
      //الرومات الخاصه
      setInterval(async () => {
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        const subscriptions = jsonDB.get(`PrivateRoom_${client12.user.id}`) || []
        if (subscriptions) {
          subscriptions.forEach(async subscription => {
            const { owner, endsTime, channelID, message, Status, guildID } = subscription;
            if (moment(currentTime).isAfter(endsTime) && Status !== "true") {
              const server = client12.guilds.cache.get(guildID);
              if(!server) return
              const channel = server.channels.cache.get(channelID);
              const ownerUser = await client12.users.fetch(owner).catch(err => { });

              if (server && channel && ownerUser) {
                const embed = new MessageEmbed()
                  .setColor("#ff0000")
                  .setDescription(`[-]** مده الروم قد انتهت**`)
                channel.send({ content: `${ownerUser}`, embeds: [embed] }).catch(err => { });
                const themessage = await channel.messages.fetch(message)

                const endedembed = new MessageEmbed()
                  .setColor("YELLOW")
                  .setDescription(themessage.embeds[0].description)
                  .setTitle(`${themessage.embeds[0].title}`)
                  .setAuthor(ownerUser.tag, ownerUser.displayAvatarURL({ dynamic: true }))
                  .setFooter(server.name, server.iconURL({ dynamic: true }));

                themessage.edit({ embeds: [endedembed] })
                await channel.permissionOverwrites.edit(server.roles.everyone, { VIEW_CHANNEL: false }).catch(err => { });
                await channel.permissionOverwrites.edit(ownerUser, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ATTACH_FILES: false }).catch(err => { });

                subscription.Status = "true";

                jsonDB.set(`PrivateRoom_${client12.user.id}`, subscriptions);
              }
            } else {
            }
          });
        }
      }, 10000);
      //فتح و غلق رومات الشوب تلقائي
      setInterval(async () => {
        const currentTime = moment().tz('Africa/Cairo').format('HH:mm');
        const guildID = jsonDB.get(`Guild_${client12.user.id}`);

        if(guildID){
          const time = jsonDB.get(`Auto-open-close-shop-rooms_${guildID}`);
          const serverData = await shopdb.find({ guildID: guildID });
  
          const filteredServerData = serverData.filter(data => data.Setup && data.Setup.shop_rooms_category)
  
          if(serverData && filteredServerData && filteredServerData.length > 0){
            const data1 = filteredServerData[0].Setup
  
            const data2 = jsonDB.get(`Shop_Rooms_${guildID}`);
    
            if (time && data2) {
              if (data2.length !== 0) {
                const { open, close, status } = time;
                const { shop_rooms_category, shop_mention_room } = data1;
    
                if (currentTime > open && currentTime < close && status === 'closed') {
                  const guild = client12.guilds.cache.get(guildID)
                  if(guild){
                    const category = guild.channels.cache.find(c => c.id === shop_rooms_category && c.type === "GUILD_CATEGORY")
                    if(category){
                      data2.forEach(async c => {
                        const role1 = c.RoleID1 || client12.user.id
                        const role2 = c.RoleID2 || client12.user.id
                        const role3 = c.RoleID3 || client12.user.id
        
        
                        const thechannel = await guild.channels.create(`${c.name}`, {
                          type: "text",
                          parent: category,
                          permissionOverwrites: [
                            {
                              id: guild.roles.everyone.id,
                              deny: ["SEND_MESSAGES"],
                            },
                            {
                              id: role1,
                              allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                            },
                            {
                              id: role2,
                              allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                            },
                            {
                              id: role3,
                              allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                            },
                          ],
                          topic: `${c.name}`,
                        })
                        time.status = 'opened'
                        jsonDB.push(`Shop_CreatedRooms_${guildID}`, thechannel.id).then(() => {
                          jsonDB.set(`Auto-open-close-shop-rooms_${guildID}`, time)
                        })
                      })
                      const statusch = client12.channels.cache.get(shop_mention_room)
                      if (statusch) {
                        statusch.send(`تم فتح رومات الشوب\n\\@here`).then(async msg => {
                          jsonDB.set(`shoprooms_status_on_${guildID}`, msg.id)
                          const oldmessageID = jsonDB.get(`shoprooms_status_off_${guildID}`)
                          const oldmessage = await statusch.messages.fetch({ around: oldmessageID, limit: 1 })
                          if (oldmessage && oldmessage.first()) {
                            await oldmessage.first().delete().catch(err => { });
                          }
                        }).catch(err =>{console.log(`shop`+err)})
                      }
                    }
                  }
                }
    
                if (currentTime > close && currentTime > open && status === 'opened') {
                  const channels = jsonDB.get(`Shop_CreatedRooms_${guildID}`)
                  if (channels.length === 0 || !channels) return
    
    
                  channels.forEach(async channelId => {
                    const channel = client12.channels.cache.get(channelId);
                    if (channel) {
                      await channel.delete();
                    }
                    time.status = 'closed'
                    jsonDB.pull(`Shop_CreatedRooms_${guildID}`, channelId).then(() => {
                      jsonDB.set(`Auto-open-close-shop-rooms_${guildID}`, time)
                    })
                  });
                  const statusch = client12.channels.cache.get(shop_mention_room)
                  if (statusch) {
                    statusch.send(`تم اغلاق رومات الشوب`).then(async msg => {
                      jsonDB.set(`shoprooms_status_off_${guildID}`, msg.id)
                      const oldmessageID = jsonDB.get(`shoprooms_status_on_${guildID}`)
                      const oldmessage = await statusch.messages.fetch({ around: oldmessageID, limit: 1 })
                      if (oldmessage && oldmessage.first()) {
                        await oldmessage.first().delete().catch(err => { });
                      }
                    })
                  }
                }
              }
    
            }
          }
        }


      }, 10000);

    } catch (error) {
      
    }
  });

  //badWords
  client12.on('messageCreate', async m => {
    try {
      const channels = jsonDB.get(`Shop_CreatedRooms_${m.guild?.id}`) || [];
      if (!channels.includes(m.channel.id) || m.member.permissions.has('ADMINISTRATOR')) return;
  
      const ServerData = await shopdb.findOne({ guildID: m.guild.id });
      if (ServerData && ServerData.Badwords && ServerData.Badwords.length > 0) {
        const badwords = ServerData.Badwords;
        const content = m.content.toLowerCase();
        const containsBadWord = badwords.some(badword => content.includes(badword.toLowerCase()));
  
        if (containsBadWord) {
          const member = m.guild.members.cache.get(m.author.id);
  
          m.delete().catch(err => {}).then(() => {
            const embed = new MessageEmbed()
              .setColor(m.guild.me.displayHexColor)
              .setTitle('تم اسكاتك ✔')
              .setDescription(m.content)
              .setFooter(m.guild.name, m.guild.iconURL({ dynamic: true }))
              .setAuthor(m.author.username, m.author.displayAvatarURL({ dynamic: true }));
  
            member.timeout(ms('10m'), `done by: ${m.member.nickname} , ${client12.user.id}`)
            m.author.send({ embeds: [embed] }).catch(err => {});
          });
        }
      }
    } catch (error) {
    }
  });
  
  
  //حذف طلب
  client12.on('interactionCreate', async i => {
    if (i.customId === 'delete_order') {
      if (!i.member.permissions.has('ADMINISTRATOR')) {
        await i.reply({ content: `❌` ,ephemeral: true });
        return;
      }
  
      i.message.delete().catch(err => {});
      i.reply({ content: '[✔] تم حذف الطلب بنجاح', ephemeral: true });
    }
  });
  
  
  


  client12.login(data.token).catch(() => {
    let autofilter = shop.filter(a => a.BotID != data.BotID)
            db2.set(`shop` , autofilter)
    
  });
});



setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_shop');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`shop`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);


        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client12 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
        client12.setMaxListeners(999);
        const fs = require('fs');
        const { readdirSync } = require("fs");
      
      
        client12.ShopSelectmenu = new Discord.Collection();
        client12.Shopcommands = new Discord.Collection();
        client12.events = new Discord.Collection();
        require("../../handlers/Shop-Selectmenu")(client12);
        require("../../handlers/Shop-commands")(client12);
        require("./handlers/events")(client12);
      
        client12.on('ready', async () => {
            const data = await jsonDB.get(`shop_Status_${client12.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
            const statuses = [
              Activity
            ];
      
            client12.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client12.user.setPresence({
              status: botstatus,
            });
        });
      
      
        client12.Shopbotsslashcommands = new Collection();
        const Shopbotsslashcommands = [];
      
        client12.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(DB.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                body: Shopbotsslashcommands,
              });
            } catch (error) {
              console.error(error);
            }
          })();
        });
      
        const folderPath = path.join(__dirname, 'slashcommand12');
      
        const ascii = require("ascii-table");
        const table = new ascii("Shop commands").setJustify();
        for (let folder of readdirSync(folderPath).filter(
          (folder) => !folder.includes(".")
        )) {
          for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
            f.endsWith(".js")
          )) {
            let command = require(`${folderPath}/${folder}/${file}`);
            if (command) {
              Shopbotsslashcommands.push(command.data);
              client12.Shopbotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
      
        //Timers things
        client12.on('ready', () => {
          try {
            //الرومات الخاصه
            setInterval(async () => {
              const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      
              const subscriptions = jsonDB.get(`PrivateRoom_${client12.user.id}`) || []
              if (subscriptions) {
                subscriptions.forEach(async subscription => {
                  const { owner, endsTime, channelID, message, Status, guildID } = subscription;
                  if (moment(currentTime).isAfter(endsTime) && Status !== "true") {
                    const server = client12.guilds.cache.get(guildID);
                    if(!server) return
                    const channel = server.channels.cache.get(channelID);
                    const ownerUser = await client12.users.fetch(owner).catch(err => { });
      
                    if (server && channel && ownerUser) {
                      const embed = new MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription(`[-]** مده الروم قد انتهت**`)
                      channel.send({ content: `${ownerUser}`, embeds: [embed] }).catch(err => { });
                      const themessage = await channel.messages.fetch(message)
      
                      const endedembed = new MessageEmbed()
                        .setColor("YELLOW")
                        .setDescription(themessage.embeds[0].description)
                        .setTitle(`${themessage.embeds[0].title}`)
                        .setAuthor(ownerUser.tag, ownerUser.displayAvatarURL({ dynamic: true }))
                        .setFooter(server.name, server.iconURL({ dynamic: true }));
      
                      themessage.edit({ embeds: [endedembed] })
                      await channel.permissionOverwrites.edit(server.roles.everyone, { VIEW_CHANNEL: false }).catch(err => { });
                      await channel.permissionOverwrites.edit(ownerUser, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ATTACH_FILES: false }).catch(err => { });
      
                      subscription.Status = "true";
      
                      jsonDB.set(`PrivateRoom_${client12.user.id}`, subscriptions);
                    }
                  } else {
                  }
                });
              }
            }, 10000);
            //فتح و غلق رومات الشوب تلقائي
            setInterval(async () => {
              const currentTime = moment().tz('Africa/Cairo').format('HH:mm');
              const guildID = jsonDB.get(`Guild_${client12.user.id}`);
      
              if(guildID){
                const time = jsonDB.get(`Auto-open-close-shop-rooms_${guildID}`);
                const serverData = await shopdb.find({ guildID: guildID });
        
                const filteredServerData = serverData.filter(data => data.Setup && data.Setup.shop_rooms_category);
        
                if(serverData && filteredServerData){
                  const data1 = filteredServerData[0].Setup;
        
                  const data2 = jsonDB.get(`Shop_Rooms_${guildID}`);
          
                  if (time && data2) {
                    if (data2.length !== 0) {
                      const { open, close, status } = time;
                      const { shop_rooms_category, shop_mention_room } = data1;
          
                      console.log(shop_rooms_category,shop_mention_room )
                      if (currentTime > open && currentTime < close && status === 'closed') {
                        const guild = client12.guilds.cache.get(guildID)
                        if(guild){
                          const category = guild.channels.cache.find(c => c.id === shop_rooms_category && c.type === "GUILD_CATEGORY")
                          if(category){
                            data2.forEach(async c => {
                              const role1 = c.RoleID1 || client12.user.id
                              const role2 = c.RoleID2 || client12.user.id
                              const role3 = c.RoleID3 || client12.user.id
              
              
                              const thechannel = await guild.channels.create(`${c.name}`, {
                                type: "text",
                                parent: category,
                                permissionOverwrites: [
                                  {
                                    id: guild.roles.everyone.id,
                                    deny: ["SEND_MESSAGES"],
                                  },
                                  {
                                    id: role1,
                                    allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                                  },
                                  {
                                    id: role2,
                                    allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                                  },
                                  {
                                    id: role3,
                                    allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                                  },
                                ],
                                topic: `${c.name}`,
                              })
                              time.status = 'opened'
                              jsonDB.push(`Shop_CreatedRooms_${guildID}`, thechannel.id).then(() => {
                                jsonDB.set(`Auto-open-close-shop-rooms_${guildID}`, time)
                              })
                            })
                            const statusch = client12.channels.cache.get(shop_mention_room)
                            if (statusch) {
                              statusch.send(`تم فتح رومات الشوب\n\\@here`).then(async msg => {
                                jsonDB.set(`shoprooms_status_on_${guildID}`, msg.id)
                                const oldmessageID = jsonDB.get(`shoprooms_status_off_${guildID}`)
                                const oldmessage = await statusch.messages.fetch({ around: oldmessageID, limit: 1 })
                                if (oldmessage && oldmessage.first()) {
                                  await oldmessage.first().delete().catch(err => { });
                                }
                              }).catch(err =>{console.log(`shop`+err)})
                            }
                          }
                        }
                      }
          
                      if (currentTime > close && currentTime > open && status === 'opened') {
                        const channels = jsonDB.get(`Shop_CreatedRooms_${guildID}`)
                        if (channels.length === 0 || !channels) return
          
          
                        channels.forEach(async channelId => {
                          const channel = client12.channels.cache.get(channelId);
                          if (channel) {
                            await channel.delete();
                          }
                          time.status = 'closed'
                          jsonDB.pull(`Shop_CreatedRooms_${guildID}`, channelId).then(() => {
                            jsonDB.set(`Auto-open-close-shop-rooms_${guildID}`, time)
                          })
                        });
                        const statusch = client12.channels.cache.get(shop_mention_room)
                        if (statusch) {
                          statusch.send(`تم اغلاق رومات الشوب`).then(async msg => {
                            jsonDB.set(`shoprooms_status_off_${guildID}`, msg.id)
                            const oldmessageID = jsonDB.get(`shoprooms_status_on_${guildID}`)
                            const oldmessage = await statusch.messages.fetch({ around: oldmessageID, limit: 1 })
                            if (oldmessage && oldmessage.first()) {
                              await oldmessage.first().delete().catch(err => { });
                            }
                          })
                        }
                      }
                    }
          
                  }
                }
              }
      
      
            }, 10000);
      
          } catch (error) {
            
          }
        });
      
        //badWords
        client12.on('messageCreate', async m => {
          try {
           const channels = jsonDB.get(`Shop_CreatedRooms_${m.guild?.id}`) || []
            if(!channels.includes(m.channel.id) || m.member.permissions.has(`ADMINISTRATOR`)) return
            const data = await shopdb.get(`BadWords_${m.guild?.id}`) || [];//
            if (data.length === 0) return;
            const member = m.guild.members.cache.get(m.author.id);
            const word = data[0].word;
            if (word && m.content.includes(word)) {
              m.delete().catch(err => {}).then(() => {
                const embed = new MessageEmbed()
                  .setColor(m.guild.me.displayHexColor)
                  .setTitle('تم اسكاتك ✔')
                  .setDescription(m.content)
                  .setFooter(m.guild.name, m.guild.iconURL({ dynamic: true }))
                  .setAuthor(m.author.username, m.author.displayAvatarURL({ dynamic: true }));
        
                  member.timeout(ms('10m') , `done by: ${m.member.nickname} , ${client12.user.id}`)
                m.author.send({ embeds: [embed] }).catch(err => { });
              });
            }
          } catch (error) {
          }
        });
        
        //حذف طلب
        client12.on('interactionCreate', async i => {
          if (i.customId === 'delete_order') {
            if (!i.member.permissions.has('ADMINISTRATOR')) {
              await i.reply({ content: `❌` ,ephemeral: true });
              return;
            }
        
            i.message.delete().catch(err => {});
            i.reply({ content: '[✔] تم حذف الطلب بنجاح', ephemeral: true });
          }
        });
        
          runDB.pull('Runs_shop',botID).then(()=>{
            client12.login(DB.token).then(()=>{
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