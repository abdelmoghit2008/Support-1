const Discord = require ('discord.js')
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "say",
  aliases: ["",""], 
  description: "Makes the bot say something for you",
  usage: ["!say [channel mention] [the message]"], 
  botPermission: [""],
  authorPermission: ["MANAGE_MESSAGES"],
  cooldowns: [], 
  ownerOnly: false, 
  run: async (client, message, args, config) => {
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    msg1=message.content.split(' ').slice(2).join(' ')
    const msg = args.slice(1).join(' ')
    if(!channel) {
      return  message.reply('❌ __**Please mention a channel**__').catch(async(error)=>{return console.log(error.message)})
    }
    if(!msg1) return message.reply(`❌ __**Please say something in the messgae!**__`)
    if(channel) {
        let image = message.attachments.first()
        if (image) {
            channel.send({ content: `${msg}`, files: [image.proxyURL] }).then(() => {
                message.delete()
            }).catch(async(error)=>{return console.log(error.message)})
        }
        if(!image) {
            channel.send(`${msg}`).then(() => {
                message.delete()
            }).catch(async(error)=>{return console.log(error.message)})
        }
    }
  }}