const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Database } = require("st.db");
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles-embed")
    .setDescription("قم باختيار وصف لرساله شراء الرتب")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("الوصف")
        .setRequired(true)
    ),
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  ownerOnly: false,
  async run(client, interaction) {
    try {
        const content = interaction.options.getString(`content`)
        const formattedContent = content.replace(/\\n/g, '\n');
        await shopdb.findOneAndUpdate(
          { guildID: interaction.guild.id },
          {
            RolesEmbed: formattedContent
          },
          { upsert: true }
      ).then(() => {
            const embed = new MessageEmbed()
            .setColor(interaction.guild.me.displayHexColor)
            .setDescription(formattedContent)
            interaction.reply({content: `[+] تم تحديد وصف لرساله بيع الرتب الجديده`,embeds: [embed]})
        })
        
    } catch (error) {
      console.log(error);
      await interaction.reply(`حدث خطا`);
    }
  },
};
