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
    .setName('gstart')
    .setDescription('Start New Giveaway')
    .addStringOption(option =>
        option.setName('duration')
            .setDescription('قم بتحديد مده القيف اواي')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('winners')
            .setDescription('عدد الفائزين')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('prize')
            .setDescription('الجائزه')
            .setRequired(true)
    )
,
    botPermission: [""],
    authorPermission: ["MANAGE_MESSAGES"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const time = interaction.options.get(`duration`).value;
            const winners = interaction.options.get(`winners`).value;
            const prize = interaction.options.get(`prize`).value;
            
            

            const hasTimeUnit = /[mdhs]/i.test(time);
            if (!hasTimeUnit || isNaN(winners)) {
                const usageEmbed = new MessageEmbed()
                  .setColor(`YELLOW`)
                  .setTitle(`Wrong usage`)
                  .setDescription(`__**تاكد ان تضع في الوقت s/h/d التي ترمز الي الثواني و ساعات و ايام او تاكد انك قمت بوضع عدد الفائزين بطريقه صحيحه**__`)
                return interaction.reply({ embeds: [usageEmbed], ephemeral: true })
              }

              const remainingTimeSeconds = ms(time) / 1000;

              const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
              const endTime = moment().add(remainingTimeSeconds, 'seconds').format('YYYY-MM-DD HH:mm:ss');
          
              const giveawayEmbed = new MessageEmbed()
                .setColor(interaction.guild.me.displayHexColor)
                .setTitle(`${prize}`)
                .setDescription(
                  `🔹 Click on button below to enter!
              🔹 ${winners} **Winners**
              🔹 **Hosted by:** <@!${interaction.user.id}>`)
                .addFields(
                  { name: ` `, value: `🔹 <t:${Math.floor((Date.now() + ms(time)) / 1000)}:R>` }
                )
              const GiveawayButton = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId(`Giveaway`)
                  .setStyle(`PRIMARY`)
                  .setLabel("🎉0")
                  .setDisabled(true),
              ]);
          
              await interaction.channel.send({ embeds: [giveawayEmbed], components: [GiveawayButton] }).then(async msg => {
                const GiveawayButton = new MessageActionRow().addComponents([
                  new MessageButton()
                    .setCustomId(`Giveaway_${msg.id}`)
                    .setStyle(`PRIMARY`)
                    .setLabel("🎉0")
                    .setDisabled(false),
                ]);
                await msg.edit({ components: [GiveawayButton] }).then(()=>{
                  interaction.reply({content: "القيف اواي قد بدا!!", ephemeral: true})
                })
          
          
                await giveawaydb.create({
                  ClintID: client.user.id,
                  Time: endTime,
                  RealEndsTime: endTime,
                  StartedTime: startTime,
                  messageID: msg.id,
                  Status: "true",
                  channelID: interaction.channel.id,
                  EntriesCounter: 0,
                  guild: interaction.guild.id,
                  Winners: winners,
                  Pause: "false",
                  Started: "false",
                  Prize: prize,
                  Ended: "false",
                });
                
              })

        } catch (error) {
            console.log(error)
            await interaction.reply({content:`حدث خطا`, ephemeral: true})
        }
    },
};
