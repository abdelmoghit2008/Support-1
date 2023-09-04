const { SlashCommandBuilder } = require("@discordjs/builders");
const { Database } = require("st.db");
const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/Shop")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-shop-room")
    .setDescription("حذف روم من لرومات الشوب")
    .addStringOption((option) =>
      option
        .setName("channel-name")
        .setDescription("اسم الروم")
        .setRequired(true)
    ),
  botPermission: [""],
  authorPermission: ["ADMINISTRATOR"],
  ownerOnly: false,
  async run(client, interaction) {
    try {
      const channelName = interaction.options.getString("channel-name");

      const rooms = jsonDB.get(`Shop_Rooms_${interaction.guild.id}`);

      const updatedRooms = rooms.filter((room) => room.name !== channelName);

      if (rooms.length === updatedRooms.length) {
        return interaction.reply(`[!] لا توجد روم بهذا الاسم`);
      }

      jsonDB.set(`Shop_Rooms_${interaction.guild.id}`, updatedRooms).then(() => {
        interaction.reply(`[-] تم حذف الروم **${channelName}**`);
      });
    } catch (error) {
      console.log(error);
      await interaction.reply(`حدث خطا`);
    }
  },
};
