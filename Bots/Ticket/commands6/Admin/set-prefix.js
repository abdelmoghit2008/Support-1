const Discord = require('discord.js');
const { Database } = require("st.db")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")

module.exports = {
  name: "set-prefix",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermissions:["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
        let prefix = args[0]
        if(!prefix) return message.reply(`[x] قم بوضع البرفكس بعد الامر`)
        await prefixDB.set(`Prefix_${client.user.id}_ticket` , prefix).then(()=>{
          message.reply({content:`[${prefix}] تم تحديد البريفكس بنجاح`})
        })
  }
};