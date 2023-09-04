const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Database } = require("st.db");
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-shop-probot")
    .setDescription("تحديد / تغير ايدي برو بوت")
    .addUserOption((option) =>
      option
        .setName("probotid")
        .setDescription("قم باختيار البرو بوت ")
        .setRequired(true)
    ),
  botPermission: [""],
  authorPermission: [""],
  ownerOnly: true,
  async run(client, interaction) {
    try {
        const probot = interaction.options.getUser(`probotid`).id
        const bot = interaction.guild.members.cache.get(probot)
        if(!bot.user.bot) return interaction.reply(`[!] قم بتحديد البرو بوت`)
        await shopdb.findOneAndUpdate(
          { guildID: interaction.guild.id },
          {
              "Buy.Probot": probot
          },
          { upsert: true }
      )
      .then(()=>{
           return interaction.reply(`[+] تم تحديد ايدي برو بوت ${probot}`)
        })
    } catch (error) {
      console.log(error);
      await interaction.reply(`حدث خطا`);
    }
  },
};
