const { Database } = require("st.db")
const db2 = new Database("Json-tokens/Tokens.json")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")
const logdb = new Database("/Json-db/Bots/LogDB.json")

const runDB = new Database("/Json-db/Others/RunDB");

let log = db2.get('log') || []
const embedscolor = '#000000';
const _ = require('lodash');
const path = require('path');
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');
const ms = require('ms');
const internal = require("stream")

log.forEach(data => {
  const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
  const Discord = require('discord.js');
  const client14 = new Client({ intents: 32767 });
  const { REST } = require("@discordjs/rest")
  const { Routes } = require("discord-api-types/v9")
  client14.setMaxListeners(999);
  const fs = require('fs');
  const { readdirSync } = require("fs");


  // client14.commands = new Discord.Collection();
  client14.events = new Discord.Collection();
  // require("../../handlers/System-commands")(client);
  require("./handlers/events")(client14);

  client14.on('ready', async () => {
      const data = await logdb.get(`log_Status_${client14.user.id}`) || []
      const Activity = await data.Activity
      const type = await data.Type
      const botstatus = await data.Presence || "online"


      client14.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
      client14.user.setPresence({
        status: botstatus,
      });
  });


  client14.Logbotsslashcommands = new Collection();
  const Logbotsslashcommands = [];


  client14.on("ready", async () => {
    const rest = new REST({ version: "9" }).setToken(data.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(data.CLIENTID), {
          body: Logbotsslashcommands,
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
        Logbotsslashcommands.push(command.data);
        client14.Logbotsslashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, "🟢 Working");
        } else {
          table.addRow(`/${command.data.name}`, "🔴 Not Working");
        }
      }
    }
  }


  client14.on("messageDelete", async (message) => {
    if (logdb.has(`log_messagedelete_${message.guild.id}`)) {
      let deletelog1 = logdb.get(`log_messagedelete_${message.guild.id}`)
      let deletelog2 = message.guild.channels.cache.get(deletelog1)
      const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE'
      });
      const deletionLog = fetchedLogs.entries.first();
      const { executor, target } = deletionLog;
      let deleteembed = new Discord.MessageEmbed()
        .setTitle(`**تم حذف رسالة**`)

        .addFields(
          {
            name: `**صاحب الرسالة : **`, value: `**\`\`\`${message.author.tag} - (${message.author.id})\`\`\`**`, inline: false
          },
          {
            name: `**حاذف الرسالة : **`, value: `**\`\`\`${executor.username} - (${executor.id})\`\`\`**`, inline: false
          },
          {
            name: `**محتوى الرسالة : **`, value: `**\`\`\`${message.content}\`\`\`**`, inline: false
          },
          {
            name: `**الروم الذي تم الحذف فيه : **`, value: `${message.channel}`, inline: false
          }
        )
        .setTimestamp();
      await deletelog2.send({ embeds: [deleteembed] })
    }
  })

  client14.on("messageUpdate", async (oldMessage, newMessage) => {
    if (logdb.has(`log_messageupdate_${oldMessage.guild.id}`)) {
      let updateLog1 = logdb.get(`log_messageupdate_${oldMessage.guild.id}`);
      let updateLog2 = oldMessage.guild.channels.cache.get(updateLog1);

      const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_UPDATE'
      });

      const updateLog = fetchedLogs.entries.first();
      const { executor } = updateLog;

      let updateEmbed = new Discord.MessageEmbed()
        .setTitle("**تم تحديث رسالة**")
        .addFields(
          {
            name: "**صاحب الرسالة:**",
            value: `**\`\`\`${oldMessage.author.tag} (${oldMessage.author.id})\`\`\`**`,
            inline: false
          },
          {
            name: "**المحتوى القديم:**",
            value: `**\`\`\`${oldMessage.content}\`\`\`**`,
            inline: false
          },
          {
            name: "**المحتوى الجديد:**",
            value: `**\`\`\`${newMessage.content}\`\`\`**`,
            inline: false
          },
          {
            name: "**الروم الذي تم التحديث فيه:**",
            value: `${oldMessage.channel}`,
            inline: false
          }
        )
        .setTimestamp();

      await updateLog2.send({ embeds: [updateEmbed] });
    }
  });

  client14.on('roleCreate', async (role) => {
    if (logdb.has(`log_rolecreate_${role.guild.id}`)) {
      let roleCreateLog1 = logdb.get(`log_rolecreate_${role.guild.id}`);
      let roleCreateLog2 = role.guild.channels.cache.get(roleCreateLog1);

      const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_CREATE'
      });

      const roleCreateLog = fetchedLogs.entries.first();
      const { executor } = roleCreateLog;

      let permissions = role.permissions.toArray().map((p) => `\`${p}\``).join(', ');

      let roleCreateEmbed = new Discord.MessageEmbed()
        .setTitle('**تم انشاء رتبة**')
        .addFields(
          { name: 'اسم الرتبة :', value: `\`\`\`${role.name}\`\`\``, inline: true },
          { name: 'الذي قام بانشاء الرتبة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
        )
        .setTimestamp();

      await roleCreateLog2.send({ embeds: [roleCreateEmbed] });
    }
  });
  client14.on('roleDelete', async (role) => {
    if (logdb.has(`log_roledelete_${role.guild.id}`)) {
      let roleDeleteLog1 = logdb.get(`log_roledelete_${role.guild.id}`);
      let roleDeleteLog2 = role.guild.channels.cache.get(roleDeleteLog1);

      const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: 'ROLE_DELETE'
      });

      const roleDeleteLog = fetchedLogs.entries.first();
      const { executor } = roleDeleteLog;

      let roleDeleteEmbed = new Discord.MessageEmbed()
        .setTitle('**تم حذف رتبة**')
        .addField('اسم الرتبة :', `\`\`\`${role.name}\`\`\``, true)
        .addField('الذي قام بحذف الرتبة :', `\`\`\`${executor.username} (${executor.id})\`\`\``, true)
        .setTimestamp();

      await roleDeleteLog2.send({ embeds: [roleDeleteEmbed] });
    }
  });
  client14.on('channelCreate', async (channel) => {
    if (logdb.has(`log_channelcreate_${channel.guild.id}`)) {
      let channelCreateLog1 = logdb.get(`log_channelcreate_${channel.guild.id}`);
      let channelCreateLog2 = channel.guild.channels.cache.get(channelCreateLog1);

      const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_CREATE'
      });

      const channelCreateLog = fetchedLogs.entries.first();
      const { executor } = channelCreateLog;

      let channelCategory = channel.parent ? channel.parent.name : 'None';

      let channelCreateEmbed = new Discord.MessageEmbed()
        .setTitle('**تم انشاء روم**')
        .addFields(
          { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
          { name: 'كاتيجوري الروم : ', value: `\`\`\`${channelCategory}\`\`\``, inline: true },
          { name: 'الذي قام بانشاء الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
        )
        .setTimestamp();

      await channelCreateLog2.send({ embeds: [channelCreateEmbed] });
    }
  });

  client14.on('channelDelete', async (channel) => {
    if (logdb.has(`log_channeldelete_${channel.guild.id}`)) {
      let channelDeleteLog1 = logdb.get(`log_channeldelete_${channel.guild.id}`);
      let channelDeleteLog2 = channel.guild.channels.cache.get(channelDeleteLog1);

      const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE'
      });

      const channelDeleteLog = fetchedLogs.entries.first();
      const { executor } = channelDeleteLog;

      let channelDeleteEmbed = new Discord.MessageEmbed()
        .setTitle('**تم حذف روم**')
        .addFields(
          { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
          { name: 'الذي قام بحذف الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
        )
        .setTimestamp();

      await channelDeleteLog2.send({ embeds: [channelDeleteEmbed] });
    }
  });
  client14.on('guildMemberUpdate', async (oldMember, newMember) => {
    const guild = oldMember.guild;

    const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
    const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));

    if (addedRoles.size > 0 && logdb.has(`log_rolegive_${guild.id}`)) {
      let roleGiveLog1 = logdb.get(`log_rolegive_${guild.id}`);
      let roleGiveLog2 = guild.channels.cache.get(roleGiveLog1);

      const fetchedLogs = await guild.fetchAuditLogs({
        limit: addedRoles.size,
        type: 'MEMBER_ROLE_UPDATE'
      });

      addedRoles.forEach((role) => {
        const roleGiveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
        const roleGiver = roleGiveLog ? roleGiveLog.executor : null;
        const roleGiverUsername = roleGiver ? `${roleGiver.username} (${roleGiver.id})` : `UNKNOWN`;

        let roleGiveEmbed = new Discord.MessageEmbed()
          .setTitle('**تم إعطاء رتبة لعضو**')
          .addFields(
            { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
            { name: 'تم إعطاءها بواسطة:', value: `\`\`\`${roleGiverUsername}\`\`\``, inline: true },
            { name: 'تم إعطائها للعضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
          )
          .setTimestamp();

        roleGiveLog2.send({ embeds: [roleGiveEmbed] });
      });
    }

    if (removedRoles.size > 0 && logdb.has(`log_roleremove_${guild.id}`)) {
      let roleRemoveLog1 = logdb.get(`log_roleremove_${guild.id}`);
      let roleRemoveLog2 = guild.channels.cache.get(roleRemoveLog1);

      const fetchedLogs = await guild.fetchAuditLogs({
        limit: removedRoles.size,
        type: 'MEMBER_ROLE_UPDATE'
      });

      removedRoles.forEach((role) => {
        const roleRemoveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
        const roleRemover = roleRemoveLog ? roleRemoveLog.executor : null;
        const roleRemoverUsername = roleRemover ? `${roleRemover.username} (${roleRemover.id})` : `UNKNOWN`;

        let roleRemoveEmbed = new Discord.MessageEmbed()
          .setTitle('**تم إزالة رتبة من عضو**')
          .addFields(
            { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
            { name: 'تم إزالتها بواسطة:', value: `\`\`\`${roleRemoverUsername}\`\`\``, inline: true },
            { name: 'تم إزالتها من العضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
          )
          .setTimestamp();

        roleRemoveLog2.send({ embeds: [roleRemoveEmbed] });
      });
    }
  });


  client14.on('guildMemberAdd', async (member) => {
    const guild = member.guild;

    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: 'BOT_ADD'
    });

    const botAddLog = fetchedLogs.entries.first();
    const { executor, target } = botAddLog;

    if (target instanceof Discord.User && target.bot) {
      let botAddLog1 = logdb.get(`log_botadd_${guild.id}`);
      let botAddLog2 = guild.channels.cache.get(botAddLog1);

      let botAddEmbed = new Discord.MessageEmbed()
        .setTitle('**تم اضافة بوت جديد الى السيرفر**')
        .addFields(
          { name: 'اسم البوت :', value: `\`\`\`${member.user.username}\`\`\``, inline: true },
          { name: 'ايدي البوت :', value: `\`\`\`${member.user.id}\`\`\``, inline: true },
          { name: 'هل لدية صلاحية الادمن ستريتور ؟ :', value: member.permissions.has('ADMINISTRATOR') ? `\`\`\`نعم لديه\`\`\`` : `\`\`\`لا ليس لديه\`\`\``, inline: true },
          { name: 'تم اضافته بواسطة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: false }
        )
        .setTimestamp();

      botAddLog2.send({ embeds: [botAddEmbed] });
    }
  });

  client14.on('guildBanAdd', async (guild, user) => {
    if (logdb.has(`log_banadd_${guild.id}`)) {
      let banAddLog1 = logdb.get(`log_banadd_${guild.id}`);
      let banAddLog2 = guild.channels.cache.get(banAddLog1);

      const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD'
      });

      const banAddLog = fetchedLogs.entries.first();
      const banner = banAddLog ? banAddLog.executor : null;
      const bannerUsername = banner ? `\`\`\`${banner.username} (${banner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;

      let banAddEmbed = new Discord.MessageEmbed()
        .setTitle('**تم حظر عضو**')
        .addFields(
          { name: 'العضو المحظور:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
          { name: 'تم حظره بواسطة:', value: bannerUsername },
        )
        .setTimestamp();

      banAddLog2.send({ embeds: [banAddEmbed] });
    }
  });

  client14.on('guildBanRemove', async (guild, user) => {
    if (logdb.has(`log_bandelete_${guild.id}`)) {
      let banRemoveLog1 = logdb.get(`log_bandelete_${guild.id}`);
      let banRemoveLog2 = guild.channels.cache.get(banRemoveLog1);

      const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_REMOVE'
      });

      const banRemoveLog = fetchedLogs.entries.first();
      const unbanner = banRemoveLog ? banRemoveLog.executor : null;
      const unbannerUsername = unbanner ? `\`\`\`${unbanner.username} (${unbanner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;

      let banRemoveEmbed = new Discord.MessageEmbed()
        .setTitle('**تم إزالة حظر عضو**')
        .addFields(
          { name: 'العضو المفكّر الحظر عنه:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
          { name: 'تم إزالة الحظر بواسطة:', value: unbannerUsername }
        )
        .setTimestamp();

      banRemoveLog2.send({ embeds: [banRemoveEmbed] });
    }
  });

  client14.on('guildMemberRemove', async (member) => {
    const guild = member.guild;
    if (logdb.has(`log_kickadd_${guild.id}`)) {
      const kickLogChannelId = logdb.get(`log_kickadd_${guild.id}`);
      const kickLogChannel = guild.channels.cache.get(kickLogChannelId);

      const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
      });

      const kickLog = fetchedLogs.entries.first();
      const kicker = kickLog ? kickLog.executor : null;
      const kickerUsername = kicker ? `\`\`\`${kicker.username} (${kicker.id})\`\`\`` : 'Unknown';

      const kickEmbed = new Discord.MessageEmbed()
        .setTitle('**تم طرد عضو**')
        .addFields(
          { name: 'العضو المطرود:', value: `\`\`\`${member.user.tag} (${member.user.id})\`\`\`` },
          { name: 'تم طرده بواسطة:', value: kickerUsername },
        )
        .setTimestamp();

      kickLogChannel.send({ embeds: [kickEmbed] });
    }
  });

  client14.on('guildUpdate', async (oldGuild, newGuild) => {
    const guild = newGuild;
    if (oldGuild.name !== newGuild.name || oldGuild.region !== newGuild.region || oldGuild.icon !== newGuild.icon) {
      if (logdb.has(`log_serversettings_${guild.id}`)) {
        const serverSettingsLogChannelId = logdb.get(`log_serversettings_${guild.id}`);
        const serverSettingsLogChannel = guild.channels.cache.get(serverSettingsLogChannelId);

        const serverSettingsEmbed = new Discord.MessageEmbed()
          .setTitle('**تم تغيير إعدادات السيرفر**')
          .addFields(
            { name: 'الاسم الجديد للسيرفر:', value: `\`\`\`${newGuild.name}\`\`\`` },
            { name: 'المنطقة الجديدة للسيرفر:', value: `\`\`\`${newGuild.region ?? "لم يتم التحديد"}\`\`\`` },
            { name: 'مستوى التحقق الجديد:', value: `\`\`\`${guild.verificationLevel ?? "لم يتم التحديد"}\`\`\`` },

          )
          .setTimestamp();

        serverSettingsLogChannel.send({ embeds: [serverSettingsEmbed] });
      }
    }
  });

  client14.login(data.token).catch(() => {
    let autofilter = log.filter(a => a.BotID != data.BotID)
            db2.set(`log` , autofilter)
    
  });
});


setInterval(() => {
  try {
    const botIDArray = runDB.get('Runs_log');

  if (Array.isArray(botIDArray) && botIDArray.length > 0) {
    const botID = botIDArray.shift();

    if(botIDArray){
      const database = db2.get(`log`);
      if(database){
        const DB =  database.find(da => da.CLIENTID === botID);
      

        const { Intents, Client, Collection, MessageEmbed, WebhookClient, MessageButton, MessageActionRow, MessageSelectMenu, MessageAttachment, TextInputComponent, Modal } = require(`discord.js`)
        const Discord = require('discord.js');
        const client14 = new Client({ intents: 32767 });
        const { REST } = require("@discordjs/rest")
        const { Routes } = require("discord-api-types/v9")
        client14.setMaxListeners(999);
        const fs = require('fs');
        const { readdirSync } = require("fs");
      
      
        // client14.commands = new Discord.Collection();
        client14.events = new Discord.Collection();
        // require("../../handlers/System-commands")(client);
        require("./handlers/events")(client14);
      
        client14.on('ready', async () => {
            const data = await logdb.get(`log_Status_${client14.user.id}`) || []
            const Activity = await data.Activity
            const type = await data.Type
            const botstatus = await data.Presence || "online"
      
      
            client14.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
            client14.user.setPresence({
              status: botstatus,
            });
        });
      
      
        client14.Logbotsslashcommands = new Collection();
        const Logbotsslashcommands = [];
      
      
        client14.on("ready", async () => {
          const rest = new REST({ version: "9" }).setToken(DB.token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(DB.CLIENTID), {
                body: Logbotsslashcommands,
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
              Logbotsslashcommands.push(command.data);
              client14.Logbotsslashcommands.set(command.data.name, command);
              if (command.data.name) {
                table.addRow(`/${command.data.name}`, "🟢 Working");
              } else {
                table.addRow(`/${command.data.name}`, "🔴 Not Working");
              }
            }
          }
        }
      
      
        client14.on("messageDelete", async (message) => {
          if (logdb.has(`log_messagedelete_${message.guild.id}`)) {
            let deletelog1 = logdb.get(`log_messagedelete_${message.guild.id}`)
            let deletelog2 = message.guild.channels.cache.get(deletelog1)
            const fetchedLogs = await message.guild.fetchAuditLogs({
              limit: 1,
              type: 'MESSAGE_DELETE'
            });
            const deletionLog = fetchedLogs.entries.first();
            const { executor, target } = deletionLog;
            let deleteembed = new Discord.MessageEmbed()
              .setTitle(`**تم حذف رسالة**`)
      
              .addFields(
                {
                  name: `**صاحب الرسالة : **`, value: `**\`\`\`${message.author.tag} - (${message.author.id})\`\`\`**`, inline: false
                },
                {
                  name: `**حاذف الرسالة : **`, value: `**\`\`\`${executor.username} - (${executor.id})\`\`\`**`, inline: false
                },
                {
                  name: `**محتوى الرسالة : **`, value: `**\`\`\`${message.content}\`\`\`**`, inline: false
                },
                {
                  name: `**الروم الذي تم الحذف فيه : **`, value: `${message.channel}`, inline: false
                }
              )
              .setTimestamp();
            await deletelog2.send({ embeds: [deleteembed] })
          }
        })
      
        client14.on("messageUpdate", async (oldMessage, newMessage) => {
          if (logdb.has(`log_messageupdate_${oldMessage.guild.id}`)) {
            let updateLog1 = logdb.get(`log_messageupdate_${oldMessage.guild.id}`);
            let updateLog2 = oldMessage.guild.channels.cache.get(updateLog1);
      
            const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
              limit: 1,
              type: 'MESSAGE_UPDATE'
            });
      
            const updateLog = fetchedLogs.entries.first();
            const { executor } = updateLog;
      
            let updateEmbed = new Discord.MessageEmbed()
              .setTitle("**تم تحديث رسالة**")
              .addFields(
                {
                  name: "**صاحب الرسالة:**",
                  value: `**\`\`\`${oldMessage.author.tag} (${oldMessage.author.id})\`\`\`**`,
                  inline: false
                },
                {
                  name: "**المحتوى القديم:**",
                  value: `**\`\`\`${oldMessage.content}\`\`\`**`,
                  inline: false
                },
                {
                  name: "**المحتوى الجديد:**",
                  value: `**\`\`\`${newMessage.content}\`\`\`**`,
                  inline: false
                },
                {
                  name: "**الروم الذي تم التحديث فيه:**",
                  value: `${oldMessage.channel}`,
                  inline: false
                }
              )
              .setTimestamp();
      
            await updateLog2.send({ embeds: [updateEmbed] });
          }
        });
      
        client14.on('roleCreate', async (role) => {
          if (logdb.has(`log_rolecreate_${role.guild.id}`)) {
            let roleCreateLog1 = logdb.get(`log_rolecreate_${role.guild.id}`);
            let roleCreateLog2 = role.guild.channels.cache.get(roleCreateLog1);
      
            const fetchedLogs = await role.guild.fetchAuditLogs({
              limit: 1,
              type: 'ROLE_CREATE'
            });
      
            const roleCreateLog = fetchedLogs.entries.first();
            const { executor } = roleCreateLog;
      
            let permissions = role.permissions.toArray().map((p) => `\`${p}\``).join(', ');
      
            let roleCreateEmbed = new Discord.MessageEmbed()
              .setTitle('**تم انشاء رتبة**')
              .addFields(
                { name: 'اسم الرتبة :', value: `\`\`\`${role.name}\`\`\``, inline: true },
                { name: 'الذي قام بانشاء الرتبة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
              )
              .setTimestamp();
      
            await roleCreateLog2.send({ embeds: [roleCreateEmbed] });
          }
        });
        client14.on('roleDelete', async (role) => {
          if (logdb.has(`log_roledelete_${role.guild.id}`)) {
            let roleDeleteLog1 = logdb.get(`log_roledelete_${role.guild.id}`);
            let roleDeleteLog2 = role.guild.channels.cache.get(roleDeleteLog1);
      
            const fetchedLogs = await role.guild.fetchAuditLogs({
              limit: 1,
              type: 'ROLE_DELETE'
            });
      
            const roleDeleteLog = fetchedLogs.entries.first();
            const { executor } = roleDeleteLog;
      
            let roleDeleteEmbed = new Discord.MessageEmbed()
              .setTitle('**تم حذف رتبة**')
              .addField('اسم الرتبة :', `\`\`\`${role.name}\`\`\``, true)
              .addField('الذي قام بحذف الرتبة :', `\`\`\`${executor.username} (${executor.id})\`\`\``, true)
              .setTimestamp();
      
            await roleDeleteLog2.send({ embeds: [roleDeleteEmbed] });
          }
        });
        client14.on('channelCreate', async (channel) => {
          if (logdb.has(`log_channelcreate_${channel.guild.id}`)) {
            let channelCreateLog1 = logdb.get(`log_channelcreate_${channel.guild.id}`);
            let channelCreateLog2 = channel.guild.channels.cache.get(channelCreateLog1);
      
            const fetchedLogs = await channel.guild.fetchAuditLogs({
              limit: 1,
              type: 'CHANNEL_CREATE'
            });
      
            const channelCreateLog = fetchedLogs.entries.first();
            const { executor } = channelCreateLog;
      
            let channelCategory = channel.parent ? channel.parent.name : 'None';
      
            let channelCreateEmbed = new Discord.MessageEmbed()
              .setTitle('**تم انشاء روم**')
              .addFields(
                { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
                { name: 'كاتيجوري الروم : ', value: `\`\`\`${channelCategory}\`\`\``, inline: true },
                { name: 'الذي قام بانشاء الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
              )
              .setTimestamp();
      
            await channelCreateLog2.send({ embeds: [channelCreateEmbed] });
          }
        });
      
        client14.on('channelDelete', async (channel) => {
          if (logdb.has(`log_channeldelete_${channel.guild.id}`)) {
            let channelDeleteLog1 = logdb.get(`log_channeldelete_${channel.guild.id}`);
            let channelDeleteLog2 = channel.guild.channels.cache.get(channelDeleteLog1);
      
            const fetchedLogs = await channel.guild.fetchAuditLogs({
              limit: 1,
              type: 'CHANNEL_DELETE'
            });
      
            const channelDeleteLog = fetchedLogs.entries.first();
            const { executor } = channelDeleteLog;
      
            let channelDeleteEmbed = new Discord.MessageEmbed()
              .setTitle('**تم حذف روم**')
              .addFields(
                { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
                { name: 'الذي قام بحذف الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
              )
              .setTimestamp();
      
            await channelDeleteLog2.send({ embeds: [channelDeleteEmbed] });
          }
        });
        client14.on('guildMemberUpdate', async (oldMember, newMember) => {
          const guild = oldMember.guild;
      
          const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
          const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));
      
          if (addedRoles.size > 0 && logdb.has(`log_rolegive_${guild.id}`)) {
            let roleGiveLog1 = logdb.get(`log_rolegive_${guild.id}`);
            let roleGiveLog2 = guild.channels.cache.get(roleGiveLog1);
      
            const fetchedLogs = await guild.fetchAuditLogs({
              limit: addedRoles.size,
              type: 'MEMBER_ROLE_UPDATE'
            });
      
            addedRoles.forEach((role) => {
              const roleGiveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
              const roleGiver = roleGiveLog ? roleGiveLog.executor : null;
              const roleGiverUsername = roleGiver ? `${roleGiver.username} (${roleGiver.id})` : `UNKNOWN`;
      
              let roleGiveEmbed = new Discord.MessageEmbed()
                .setTitle('**تم إعطاء رتبة لعضو**')
                .addFields(
                  { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
                  { name: 'تم إعطاءها بواسطة:', value: `\`\`\`${roleGiverUsername}\`\`\``, inline: true },
                  { name: 'تم إعطائها للعضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
                )
                .setTimestamp();
      
              roleGiveLog2.send({ embeds: [roleGiveEmbed] });
            });
          }
      
          if (removedRoles.size > 0 && logdb.has(`log_roleremove_${guild.id}`)) {
            let roleRemoveLog1 = logdb.get(`log_roleremove_${guild.id}`);
            let roleRemoveLog2 = guild.channels.cache.get(roleRemoveLog1);
      
            const fetchedLogs = await guild.fetchAuditLogs({
              limit: removedRoles.size,
              type: 'MEMBER_ROLE_UPDATE'
            });
      
            removedRoles.forEach((role) => {
              const roleRemoveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
              const roleRemover = roleRemoveLog ? roleRemoveLog.executor : null;
              const roleRemoverUsername = roleRemover ? `${roleRemover.username} (${roleRemover.id})` : `UNKNOWN`;
      
              let roleRemoveEmbed = new Discord.MessageEmbed()
                .setTitle('**تم إزالة رتبة من عضو**')
                .addFields(
                  { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
                  { name: 'تم إزالتها بواسطة:', value: `\`\`\`${roleRemoverUsername}\`\`\``, inline: true },
                  { name: 'تم إزالتها من العضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
                )
                .setTimestamp();
      
              roleRemoveLog2.send({ embeds: [roleRemoveEmbed] });
            });
          }
        });
      
      
        client14.on('guildMemberAdd', async (member) => {
          const guild = member.guild;
      
          const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'BOT_ADD'
          });
      
          const botAddLog = fetchedLogs.entries.first();
          const { executor, target } = botAddLog;
      
          if (target instanceof Discord.User && target.bot) {
            let botAddLog1 = logdb.get(`log_botadd_${guild.id}`);
            let botAddLog2 = guild.channels.cache.get(botAddLog1);
      
            let botAddEmbed = new Discord.MessageEmbed()
              .setTitle('**تم اضافة بوت جديد الى السيرفر**')
              .addFields(
                { name: 'اسم البوت :', value: `\`\`\`${member.user.username}\`\`\``, inline: true },
                { name: 'ايدي البوت :', value: `\`\`\`${member.user.id}\`\`\``, inline: true },
                { name: 'هل لدية صلاحية الادمن ستريتور ؟ :', value: member.permissions.has('ADMINISTRATOR') ? `\`\`\`نعم لديه\`\`\`` : `\`\`\`لا ليس لديه\`\`\``, inline: true },
                { name: 'تم اضافته بواسطة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: false }
              )
              .setTimestamp();
      
            botAddLog2.send({ embeds: [botAddEmbed] });
          }
        });
      
        client14.on('guildBanAdd', async (guild, user) => {
          if (logdb.has(`log_banadd_${guild.id}`)) {
            let banAddLog1 = logdb.get(`log_banadd_${guild.id}`);
            let banAddLog2 = guild.channels.cache.get(banAddLog1);
      
            const fetchedLogs = await guild.fetchAuditLogs({
              limit: 1,
              type: 'MEMBER_BAN_ADD'
            });
      
            const banAddLog = fetchedLogs.entries.first();
            const banner = banAddLog ? banAddLog.executor : null;
            const bannerUsername = banner ? `\`\`\`${banner.username} (${banner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;
      
            let banAddEmbed = new Discord.MessageEmbed()
              .setTitle('**تم حظر عضو**')
              .addFields(
                { name: 'العضو المحظور:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
                { name: 'تم حظره بواسطة:', value: bannerUsername },
              )
              .setTimestamp();
      
            banAddLog2.send({ embeds: [banAddEmbed] });
          }
        });
      
        client14.on('guildBanRemove', async (guild, user) => {
          if (logdb.has(`log_bandelete_${guild.id}`)) {
            let banRemoveLog1 = logdb.get(`log_bandelete_${guild.id}`);
            let banRemoveLog2 = guild.channels.cache.get(banRemoveLog1);
      
            const fetchedLogs = await guild.fetchAuditLogs({
              limit: 1,
              type: 'MEMBER_BAN_REMOVE'
            });
      
            const banRemoveLog = fetchedLogs.entries.first();
            const unbanner = banRemoveLog ? banRemoveLog.executor : null;
            const unbannerUsername = unbanner ? `\`\`\`${unbanner.username} (${unbanner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;
      
            let banRemoveEmbed = new Discord.MessageEmbed()
              .setTitle('**تم إزالة حظر عضو**')
              .addFields(
                { name: 'العضو المفكّر الحظر عنه:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
                { name: 'تم إزالة الحظر بواسطة:', value: unbannerUsername }
              )
              .setTimestamp();
      
            banRemoveLog2.send({ embeds: [banRemoveEmbed] });
          }
        });
      
        client14.on('guildMemberRemove', async (member) => {
          const guild = member.guild;
          if (logdb.has(`log_kickadd_${guild.id}`)) {
            const kickLogChannelId = logdb.get(`log_kickadd_${guild.id}`);
            const kickLogChannel = guild.channels.cache.get(kickLogChannelId);
      
            const fetchedLogs = await guild.fetchAuditLogs({
              limit: 1,
              type: 'MEMBER_KICK',
            });
      
            const kickLog = fetchedLogs.entries.first();
            const kicker = kickLog ? kickLog.executor : null;
            const kickerUsername = kicker ? `\`\`\`${kicker.username} (${kicker.id})\`\`\`` : 'Unknown';
      
            const kickEmbed = new Discord.MessageEmbed()
              .setTitle('**تم طرد عضو**')
              .addFields(
                { name: 'العضو المطرود:', value: `\`\`\`${member.user.tag} (${member.user.id})\`\`\`` },
                { name: 'تم طرده بواسطة:', value: kickerUsername },
              )
              .setTimestamp();
      
            kickLogChannel.send({ embeds: [kickEmbed] });
          }
        });
      
        client14.on('guildUpdate', async (oldGuild, newGuild) => {
          const guild = newGuild;
          if (oldGuild.name !== newGuild.name || oldGuild.region !== newGuild.region || oldGuild.icon !== newGuild.icon) {
            if (logdb.has(`log_serversettings_${guild.id}`)) {
              const serverSettingsLogChannelId = logdb.get(`log_serversettings_${guild.id}`);
              const serverSettingsLogChannel = guild.channels.cache.get(serverSettingsLogChannelId);
      
              const serverSettingsEmbed = new Discord.MessageEmbed()
                .setTitle('**تم تغيير إعدادات السيرفر**')
                .addFields(
                  { name: 'الاسم الجديد للسيرفر:', value: `\`\`\`${newGuild.name}\`\`\`` },
                  { name: 'المنطقة الجديدة للسيرفر:', value: `\`\`\`${newGuild.region ?? "لم يتم التحديد"}\`\`\`` },
                  { name: 'مستوى التحقق الجديد:', value: `\`\`\`${guild.verificationLevel ?? "لم يتم التحديد"}\`\`\`` },
      
                )
                .setTimestamp();
      
              serverSettingsLogChannel.send({ embeds: [serverSettingsEmbed] });
            }
          }
        });

          runDB.pull('Runs_log',botID).then(()=>{
            client14.login(DB.token).then(()=>{
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