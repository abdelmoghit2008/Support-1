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
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require('st.db');
const giveawaydb = require("../../../../Schema/BotsDB/Giveaway")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")

const ms = require('ms')
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('gresumed')
    .setDescription('Resumed running giveaway')
    .addStringOption(option =>
      option.setName('message-id')
        .setDescription('ايدي رساله القيف اواي')
        .setRequired(true)
    )
  ,
  botPermission: [""],
  authorPermission: ["MANAGE_MESSAGES"],
  ownerOnly: false,
  async run(client, interaction) {
    try {
      const messageID = interaction.options.get(`message-id`).value;


      const ErrorEmbed = new MessageEmbed()
        .setColor(`YELLOW`)
        .setDescription(`❌**هذا القيف اواي منتهي بالفعل او غير متوقف**`)

      const guild = client.guilds.cache.get(interaction.guild.id);
      const channel = guild.channels.cache.get(interaction.channel.id);
      if (!channel || channel.type !== "GUILD_TEXT") return;

      const Message = await channel.messages.fetch(messageID);
      if (!Message) return;

      const ServerData = await giveawaydb.findOne({ messageID: messageID });

      if (!ServerData) {
        const notFoundEmbed = new MessageEmbed()
          .setColor('RED')
          .setDescription('**لا استطيع ايجاد القيف اواي**');
        return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
      }

      const PusedTimeMoment = moment(ServerData.Pause, 'YYYY-MM-DD HH:mm:ss');
      const RealEndTimeMoment = moment(ServerData.RealEndsTime, 'YYYY-MM-DD HH:mm:ss');

      const timeLeftDuration = moment.duration(RealEndTimeMoment.diff(PusedTimeMoment));
      const secondsLeft = timeLeftDuration.asSeconds();
      const endTime = moment().add(secondsLeft, 'seconds').format('YYYY-MM-DD HH:mm:ss');

      const giveawayEmbed = new MessageEmbed()
        .setColor(Message.guild.me.displayHexColor)
        .setTitle(Message.embeds[0].title)
        .setDescription(Message.embeds[0].description)
        .addFields(
          { name: ` `, value: `🔹Ends on  ${endTime}` },
          { name: ` `, value: `🔸 **💨 unPaused**` },
        );


      if (ServerData.Ended === "true" || ServerData.Pause === "false") {
        return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
      } else {
        Message.edit({ embeds: [giveawayEmbed] });
        await giveawaydb.findOneAndUpdate(
          { messageID: messageID },
          {
            Time: endTime,
            Pause: "false",
            Status: "true"
          }
        );
      }

    } catch (error) {
      console.log(error)
      await interaction.reply({ content: `حدث خطا`, ephemeral: true })
    }
  },
};
