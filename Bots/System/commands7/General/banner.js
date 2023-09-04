const Discord = require('discord.js')
const {
  Client,
  Collection,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  Intents,
  Modal,
  TextInputComponent
} = require("discord.js");

const axios = require("axios");
const { Database } = require("st.db");
const token = new Database("/Json-tokens/Tokens.json")

module.exports = {
  name: "banner",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: ["MANAGE_CHANNELS"],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    try {
      let member = message.mentions.users.first();

      const systemtoken = token.get(`system`)
      const data = systemtoken.find((data) => data.CLIENTID === client.user.id);
  
  
      if (!member) {
        try {
          const user = await client.users.fetch(args[1]);
          member = message.guild.members.cache.get(user.id);
        } catch (error) {
          member = message.member;
        }
      }
  
      axios
        .get(`https://discord.com/api/users/${member.id}`, {
          headers: {
            Authorization: `Bot ${data.token}`,
          },
        })
        .then((res) => {
          const { banner, accent_color } = res.data;
  
          if (banner) {
            const extension = banner.startsWith("a_") ? ".gif" : ".png";
            const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=2048`;
  
            let button = new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("LINK")
                .setLabel("Download")
                .setURL(url)
            );
  
            const embed = new MessageEmbed()
              .setAuthor(
                `${member.user.username}`,
                member.displayAvatarURL({ dynamic: true })
              )
              .setTitle("Banner Link")
              .setURL(url)
              .setImage(url)
              .setColor(message.guild.me.displayColor)
              .setFooter(
                `Requested by ${message.author.username}`,
                message.author.displayAvatarURL({ dynamic: true })
              );
  
            message
              .reply({ embeds: [embed], components: [button] })
              
          } else {
            if (accent_color) {
              message
                .reply(
                  `**${member} does not have a banner but they have an accent color.**`
                )
            } else {
              message
                .reply(
                  `**${member} does not have a banner but do they have an accent color.**`
                )
            }
          }
      })
    } catch (error) {
      console.log(error)
    }
  }
};