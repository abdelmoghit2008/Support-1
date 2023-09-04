const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { Database } = require("st.db")
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
module.exports = {
  name: "help",
  aliases: [""],
  description: "",
  usage: [""],
  botPermission: [""],
  authorPermission: [""],
  cooldowns: [10],
  ownerOnly: false,
  run: async (client, message, args, config) => {
        const prefix = prefixDB.get(`Prefix_${client.user.id}_system`)
    const embeds = [
      new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
        .setTitle('General')
        .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          { name: `${prefix}**avatar**`, value: '__Display someone avatar__', inline: false },
          { name: `${prefix}**banner**`, value: '__Display someone banner__', inline: false },
          { name: `${prefix}**roles**`, value: '__Return all roles in the server__', inline: false },
          { name: `${prefix}**server**`, value: '__Display some information about the server__', inline: false },
          { name: `${prefix}**user**`, value: '__Return some information about spical user__', inline: false }
        ),
      new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
        .setTitle('Admin')
        .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          { name: `${prefix}**ban**`, value: '__Ban member from the server__', inline: true },
          { name: `${prefix}**unban**`, value: '__unban member from the server__', inline: true },
          { name: `${prefix}**unban-all**`, value: '__unban all banned users from the server__', inline: true },
          { name: `${prefix}**kick**`, value: '__kick member from the server__', inline: true },
          { name: `${prefix}**clear**`, value: '__clear messages in channel up to 100__', inline: true },
          { name: `${prefix}**hide**`, value: '__hide the channel from "@everyone"__', inline: true },
          { name: `${prefix}**unhide**`, value: '__hide the channel from "@everyone"__', inline: true },
          { name: `${prefix}**lock**`, value: '__lock the channel from "@everyone"__', inline: true },
          { name: `${prefix}**unlock**`, value: '__unlock the channel from "@everyone"__', inline: true },
          { name: `${prefix}**embed**`, value: '__send an embed message by the bot__', inline: true },
          { name: `${prefix}**say**`, value: '__send a message by the bot__', inline: true },
          { name: `${prefix}**send**`, value: '__Send a private message to targeted member__', inline: true },
          { name: `${prefix}**come**`, value: '__Send DM message to spical member to come__', inline: true },
          { name: `${prefix}**mute**`, value: '__Mute spical member in server__', inline: true },
          { name: `${prefix}**unmute**`, value: '__unMute spical member in server__', inline: true },
          { name: `${prefix}**timeout**`, value: '__Timeout spical member in server__', inline: true },
          { name: `${prefix}**untimeout**`, value: '__unTimeout spical member in server__', inline: true },
          { name: `${prefix}**role**`, value: '__Add/Remove role from someone__', inline: true },
          { name: `${prefix}**setnick**`, value: '__Change the nickname for spical member in server__', inline: true },
        ),
      new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
        .setTitle(client.user.username)
        .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription('Owner')
        .addFields(
          { name: `${prefix}**set-owner**`, value: '__Change the owner of the bot__', inline: false },
          { name: `${prefix}**set-prefix**`, value: '__Change the prefix of the bot__', inline: false },

        )
    ];

    const selectMenuOptions = embeds.map((embed, index) => ({
      label: embed.title,
      value: index.toString(),
      description: `To view ${embed.title} commands`,
      emoji: '📄'
    }));

    const selectMenu = new MessageSelectMenu()
      .setCustomId('help_select')
      .setPlaceholder('Select a page...')
      .addOptions(selectMenuOptions);

    const actionRow = new MessageActionRow().addComponents(selectMenu);

    const initialEmbed = embeds[0];

    const helpMessage = await message.reply({
      embeds: [initialEmbed],
      components: [actionRow]
    });

    const filter = (interaction) =>
      interaction.isSelectMenu() && interaction.user.id === message.author.id;

    const collector = helpMessage.createMessageComponentCollector({
      filter,
      time: 60000
    });

    collector.on('collect', (interaction) => {
      const selectedPageIndex = parseInt(interaction.values[0]);
      const selectedEmbed = embeds[selectedPageIndex];
      interaction.update({
        embeds: [selectedEmbed]
      });
    });

    collector.on('end', () => {
      helpMessage.edit({
        components: []
      });
    });
  }
};
