const Discord = require('discord.js');
const { Database } = require("st.db")
const brodcastdb = new Database("/Json-db/Bots/BrodcastDB.json")
const prefixdb = new Database("/Json-db/Others/PrefixDB.json")
module.exports = {
    name: "rbc",
    aliases: [""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, message, args) => {
        try {
            const prefix = prefixdb.get(`Prefix_${client.user.id}_brodcast`)
            const broadcastMessage = args.slice(1).join(" ");
            const roleMention = message.mentions.roles.first();
            if (!roleMention) return message.reply(`❗usage: ${prefix}rbc [@Role] [Message]`);

            const guild = message.guild;
            const guildMembers = await guild.members.fetch();
            if (!broadcastMessage) return message.reply(`❗usage: ${prefix}rbc [@Role] [Message]`);


            const statusEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`حالة البرودكاست`)
            .addFields(
              { name: "نجح في إرسال الي ✔", value: `Starting...`, inline: false },
              { name: "فشل في إرسال الي ❌", value: `No Fails.🌟`, inline: false }
            );
          const statusMessage = await message.channel.send({ embeds: [statusEmbed] });
          brodcastdb.set(`BrodCastStartingMessage_${message.guild.id}_${client.user.id}`, statusMessage.id).then(async () => {
            const theStartingMessage = await brodcastdb.get(`BrodCastStartingMessage_${message.guild.id}_${client.user.id}`);
            const startedMessage = await message.channel.messages.fetch(theStartingMessage);
            guildMembers.forEach(async (member) => {
              try {
                if (member.user.bot) return;
                if (member.roles.cache.has(roleMention.id)) {
                  await member.send(broadcastMessage).catch(async (err) => {
                    const failedEmbed = startedMessage.embeds[0];
                    failedEmbed.fields[1].value = `${member.user.username} 🔴`;
                    return await startedMessage.edit({ embeds: [failedEmbed] });
                  });
                  const successField = startedMessage.embeds[0];
                  successField.fields[0].value = `${member.user.username} 🟢`;
                  await startedMessage.edit({ embeds: [successField] });
                }
              } catch (error) {
                console.log(error.message);
              }
            });
          });
        } catch (error) {
            console.log(error)
            return message.reply(`حدث خطا`)
        }
    }
};