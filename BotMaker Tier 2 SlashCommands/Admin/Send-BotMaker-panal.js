const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require("discord.js");
const { Database } = require("st.db");

const BOTMAKERDB = new Database("/Json-db/BotMaker/BOTMAKERDB");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-botmaker-panel")
    .setDescription("Send BotMaker panel"),
  botPermission: [],
  authorPermission: ["ADMINISTRATOR"],
  ownerOnly: false,
  async run(client, interaction) {

    try {
        const data = BOTMAKERDB.get(`BotMakerTicket_${interaction.guild.id}`);
        const Message = data.Message;
        const channelID = data.Channel;

        const channel = client.channels.cache.get(channelID);

        if (!channel)
          return interaction.reply({ content: "**لم يتم تحديد روم التكت.**" });

        const Bot_Embed = new MessageEmbed()
          .setColor(interaction.guild.me.displayHexColor)
          .setDescription(`${Message}`);

        const Bot_Selector = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("BOTMAKER_Selector")
            .setPlaceholder("Make your bot from here!")
            .setOptions([
              {
                label: "Autoline",
                value: "Autoline_Selected",
                emoji: '🤖',
                description: "لشراء بوت خط تلقائي",
              },
              {
                label: "Suggestion",
                value: "Suggestion_Selected",
                emoji: '🤔',
                description: "لشراء بوت اقتراحات",
              },
              {
                label: "Probot tax",
                value: "Tax_Selected",
                emoji: '💰',
                description: "لشراء بوت ضريبة تلقائية",
              },
              {
                label: "Credit",
                value: "Credit_Selected",
                emoji: '💵',
                description: "لشراء بوت كريدت وهمي",
              },
              {
                label: "Ticket",
                value: "Ticket_Selected",
                emoji: '🎟️',
                description: "لشراء بوت تكت",
              },
              {
                label: "System",
                value: "System_Selected",
                emoji: '⚙️',
                description: "لشراء بوت سيستم",
              },
              {
                label: "Brodcast",
                value: "Brodcast_Selected",
                emoji: '📢',
                description: "لشراء بوت برودكاست",
              },
              {
                label: "Scammers",
                value: "Scammers_Selected",
                emoji: '🚫',
                description: "لشراء بوت تشهير نصابين",
              },
              {
                label: "Giveaway",
                value: "Giveaway_Selected",
                emoji: '🎁',
                description: "لشراء بوت جيف اوي",
              },
              {
                label: "Probot-Prime",
                value: "Probot_selected",
                emoji: '🅿️',
                description: "لشراء بروبوت",
              },
              {
                label: "Feedback",
                value: "Feedback_selected",
                emoji: '💭',
                description: "لشراء بوت فيدباك",
              },
              {
                label: "Logs",
                value: "Logs_selected",
                emoji: '📃',
                description: "لشراء بوت لوغ",
              },
              {
                label: "Reset",
                value: "Reset_Selected",
                emoji: '🔃',
                description: "لتحديث المنيو",
              },
            ])
        );

        if (data.Message) {
          channel.send({ embeds: [Bot_Embed], components: [Bot_Selector] }).then((msg) => {
            BOTMAKERDB.set(`BOTMAKERTicketMSGID_${interaction.guild.id}`, msg.id);
            interaction.reply({ content: "BotMaker panel has been sent!" , ephemeral : true});
          });
        } else {
          channel.send({ components: [Bot_Selector] }).then((msg) => {
            BOTMAKERDB.set(`BOTMAKERTicketMSGID_${interaction.guild.id}`, msg.id);
            interaction.reply({ content: "BotMaker panel has been sent!" , ephemeral : true});
          });
        }
    } catch (error) {
      console.log(error);
      await interaction.reply("حدث خطأ.");
    }
  },
};
