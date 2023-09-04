const Discord = require('discord.js');
const { Database } = require("st.db")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")

module.exports = {
  name: "set-owner",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermissions:["ADMINISTRATOR"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
        let owner = message.mentions.users.first() || client.users.cache.get(args[0])
        if(!owner) return message.reply({content:`[x] قم بعمل منشن للاونر الجديد بعد الامر`})
        await ownerDB.set(`Owner_${client.user.id}_suggestion` , owner.id)
        return message.reply({content:`[${owner}] تم تحديد الاونر بنجاح`})
  }
};