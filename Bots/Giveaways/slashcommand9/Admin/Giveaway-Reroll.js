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
const _ = require('lodash');

const ms = require('ms')
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greroll')
        .setDescription('Reroll winners for giveaway')
        .addStringOption(option =>
            option.setName('message-id')
                .setDescription('ايدي رساله القيف اواي')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('winners-count')
                .setDescription('عدد الفائزين')
                .setRequired(true)
        )
    ,
    botPermission: [""],
    authorPermission: ["MANAGE_MESSAGES"],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const messageID = interaction.options.get(`message-id`).value;
            const winnerCount = interaction.options.get(`winners-count`).value;
            

            const WrongEmbed = new MessageEmbed()
                .setColor(`YELLOW`)
                .setDescription(`قم بادخال المعلومات بطريقه صحيحه`)

            if (isNaN(messageID) || isNaN(winnerCount)) return interaction.reply({ embeds: [WrongEmbed], ephemeral: true })

            const ErrorEmbed = new MessageEmbed()
                .setColor(`YELLOW`)
                .setDescription(`**هذا القيف اواي غير منتهي**`)



            const WrongWinnersNumber = new MessageEmbed()
                .setColor(`YELLOW`)
                .setDescription(`**لا يمكنك جلب فائزين اكثر من عدد الفائزين المحدده في القيف اواي**`)

                const ServerData = await giveawaydb.findOne({ messageID: messageID });

                if(ServerData.Ended === "false"){
                  return interaction.reply({embeds: [ErrorEmbed], ephemeral: true})
                } else if(ServerData.Winners < winnerCount || ServerData.Entries < parseInt(winnerCount)){
                  return interaction.reply({embeds: [WrongWinnersNumber], ephemeral: true})
                } else {
          
                  const Prize = ServerData.Prize;
          
                  const participants = ServerData.Joined
          
                  const winnersCount = parseInt(winnerCount);
          
                  const newWinners = _.sampleSize(_.difference(participants, ServerData.winner, ServerData.Reroll), Math.min(winnersCount, participants?.length));
                  
                  ServerData.Reroll = [...ServerData.Reroll, ...newWinners];
          
                  await ServerData.save();
                  
                  const newWinner = newWinners.map(winner => `<@!${winner}>`).join(", ");
                  const giveawaymessage = await interaction.channel.messages.fetch(messageID);
                  const GiveawayLink = new MessageActionRow().addComponents([
                      new MessageButton()
                      .setStyle("LINK")
                      .setLabel("Giveaway")
                      .setURL(`${giveawaymessage.url}`)
                    ]);
                  if(newWinner){
                    interaction.reply({content:`تم اختيار فائز`, ephemeral: true})
                    interaction.channel.send({ content: `*Giveaway has been Rerroled*\n**Congratulations** 🎉 ${newWinner} You won **__${Prize}__**`, components: [GiveawayLink] });
                  }else{
                    interaction.reply({content:`تم اختيار فائز`, ephemeral: true})
                    interaction.channel.send({ content: `*❌ No Entries/Winners found*`, components: [GiveawayLink] });
                  }
                }

        } catch (error) {
            console.log(error)
            await interaction.reply({content:`حدث خطا`, ephemeral: true})
        }
    },
};
