const { SlashCommandBuilder } = require("@discordjs/builders");
const { Database } = require("st.db");
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/SellRolesShopDB")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-role")
    .setDescription("حذف رتبه من البيع")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("قم باختيار الرتبه")
        .setRequired(true)
    ),
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  ownerOnly: false,
  async run(client, interaction) {
    try {
      const role = interaction.options.getRole("role");
      if (!role) return interaction.reply(`يجب عليك تحديد رتبة صحيحة.`);

      const roleID = role.id;

      const existingRole = await shopdb.findOne({
        guildID: interaction.guild.id,
        "SellsRoles.Role": roleID,
      });

      if (!existingRole) {
        return interaction.reply(`الرتبة غير موجودة في قائمة البيع.`);
      }

      await shopdb.deleteOne({
        guildID: interaction.guild.id,
        "SellsRoles.Role": roleID,
      });

      interaction.reply(`[-] تم حذف الرتبة <@&${roleID}>`);
    } catch (error) {
      console.log(error);
      await interaction.reply(`حدث خطأ`);
    }
  },
};
