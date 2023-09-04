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

const { Database } = require('st.db');

const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
const shopdb = require("../../../../Schema/BotsDB/SellRolesShopDB")

const { Probot } = require("discord-probot-transfer");
const checkdb = new Database("/Json-db/Others/BuyerChecker");
module.exports = {
  name: "Shop_AutoSell_Roles",
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: [""],
  cooldowns: [],
  ownerOnly: false,
  run: async (client, interaction, args, config) => {
    const roleData = await shopdb.find({ guildID: interaction.guild.id });
    const ServerData = await shopdb.find({ guildID: interaction.guild.id });

    const filteredServerData = ServerData.filter(data => data.Buy && data.Buy.Probot);



    const filteredRoleData = roleData.filter(data => data.SellsRoles && data.SellsRoles.Role && data.SellsRoles.Price);

    const rolesData = filteredRoleData.map(data => ({
      roleID: data.SellsRoles.Role,
      price: data.SellsRoles.Price
    }));

    const roles = rolesData.map(data => data.roleID);


    const Selected = interaction.values[0];
    const selectedRole = roles.find(roleID => roleID === Selected);
    const Price = rolesData.find(data => data.roleID === selectedRole).price;
    
    if (!selectedRole) {
      interaction.reply('[!] لا استطيع ايجاد الرتبه المحدده او الرتبه غير متوفره للبيع')
    }
    
    
    const bank = filteredServerData[0].Buy.Bank
    const probotid = filteredServerData[0].Buy.Probot
    if(!bank){
      return interaction.repely(`[!] رجاء قم بتحديد حساب البنك\n/set-shop-bank`)
    }else if(!probotid){
      return interaction.repely(`[!] رجاء قم بتحديد ايدي البرو بوت\n/set-shop-probot`)
    }

    if (checkdb.has(`Buying_${interaction.guild.id}_${interaction.channel.id}`)) return interaction.reply(`[!] قم باكمال عمليه الشراء الحاليه`)

    if (interaction.member.roles.cache.has(selectedRole)) return interaction.reply(`[!] انت تمتلك هذه الرتبه بالفعل`)
    checkdb.set(`Buying_${interaction.guild.id}_${interaction.channel.id}`, true)
    if (Selected === selectedRole) {
      if (interaction.replied) {
        return;
      } else {
        try {
          await interaction.deferReply({ ephemeral: false });
          const price = parseInt(Price)
          const totalP = Math.floor(price * (20 / 19) + 1);

          await interaction.editReply(`- لشراء **${interaction.guild.roles.cache.get(selectedRole).name}**\n- قم بكتابه الامر التالي\n**c ${bank} ${totalP}**`)
            .then((msg) => {
              const filter = ({ content, author: { id } }) => {
                return (
                  content.startsWith(
                    `**:moneybag: | ${interaction.user.username}, has transferred `
                  ) &&
                  content.includes(`${bank}`) &&
                  id === probotid &&
                  Number(
                    content.slice(
                      content.lastIndexOf("`") - String(price).length,
                      content.lastIndexOf("`")
                    )
                  ) >= price
                );
              };
              interaction.channel
                .awaitMessages({
                  filter,
                  max: 1,
                  time: 300_000,
                  errors: ["time"],
                })
                .then((msg) => {
                  const role = interaction.guild.roles.cache.get(selectedRole)
                  interaction.member.roles.add(selectedRole).then(() => {
                    interaction.channel.send(`[+] تم شراء الرتبه بنجاح ${interaction.guild.roles.cache.get(selectedRole).name}`).then(() => {
                      checkdb.delete(`Buying_${interaction.guild.id}_${interaction.channel.id}`);
                    })
                  })
                })
                .catch((err) => {
                  cooldown = false;
                  console.log(err);
                  return interaction.channel.send(`[!] الوقت انتهي`).then(() => {
                    checkdb.delete(`Buying_${interaction.guild.id}_${interaction.channel.id}`);
                  })
                })
                .then(() => {
                  cooldown = false;
                  if (checkdb.has("notif")) {
                    notif = checkdb.get("notif");
                    if (notif) {
                      client.channels.cache.get(notif);
                    }
                  }
                })
                .catch((err) => {
                  cooldown = false;
                  console.log(err);

                  return interaction.channel.send(`[!] الوقت انتهي`).then(() => {
                    checkdb.delete(`Buying_${interaction.guild.id}_${interaction.channel.id}`);
                  })
                });
            });
        } catch (error) {
          console.log(error)
          interaction.channel.send('حدث خطا!')
        }
      }
    }
  }
}