const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Database } = require("st.db");
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-shop-bank")
    .setDescription("تحديد / تغير حساب البنك")
    .addUserOption((option) =>
      option
        .setName("bank-account")
        .setDescription("قم باختيار حساب سوف يكون كل التحويلات له")
        .setRequired(true)
    ),
  botPermission: [""],
  authorPermission: [""],
  ownerOnly: true,
  async run(client, interaction) {
    try {
        const bank = interaction.options.getUser(`bank-account`).id

        await shopdb.findOneAndUpdate(
          { guildID: interaction.guild.id },
          {
              "Buy.Bank": bank
          },
          { upsert: true }
      ).then(()=>{
            interaction.reply(`[+] تم تحديد حساب البنك <@!${bank}>`)
        })
    } catch (error) {
      console.log(error);
      await interaction.reply(`حدث خطا`);
    }
  },
};
