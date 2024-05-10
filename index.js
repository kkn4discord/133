const { GatewayIntentBits, Integration } = require('discord.js');
const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,ApplicationCommandOptionType
} = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const config = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
require('dotenv').config();
const express = require("express")
const app = express();
var listener = app.listen(process.env.PORT || 2000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
app.listen(() => console.log("I'm Ready To Work..! 24H"));
app.get('/', (req, res) => {
  res.send(`
  <body>
  <center><h1>Bot 24H ON!</h1></center
  </body>`)
});
client.on('ready', async () => {
  const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'setup',
    description: 'setup Apply',
  },
  {
    name: "block",
    description: "Block user from using command",
    options: [
      {
        name: "block",
        description: "Please Mention User to block",
        required: true,
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
  {
    name: "remove-block",
    description: "Remove block from user",
    options: [
      {
        name: "remove-block",
        description: "Please Mention User to remove block",
        required: true,
        type: ApplicationCommandOptionType.User,
      },
    ],
  },  
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(config.idbot), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
  console.log(`Logged in as ${client.user.tag}!`);
});

const fs = require('fs');

let blocklist = [];

try {
  const data = fs.readFileSync('blocklist.json', 'utf8');
  blocklist = JSON.parse(data);
} catch (err) {
  console.error('حدث خطأ أثناء قراءة الملف أو الملف غير موجود. قم بإنشاء الملف ووضعه. []', err);
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'block') { 
        if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
      !interaction.member.roles.cache.some(role => rolesallowed.includes(role.id))
    ) {
      return interaction.reply("لا يمكنك استخدام هذا الأمر لأنك لا تملك الصلاحيات أو الرتب اللازمة.");
    }
    const member1 = interaction.options.getMember('block'); 

    if (!member1) {
      return interaction.reply('ضع علامة على الشخص الذي تريد حظره'); 
    }

    if (blocklist.includes(member1.id)) { 
      return interaction.reply('لقد تم حظر هذا الشخص!');
    }
    interaction.reply(`تم حظر جهة الاتصال بنجاح ${member1}.`); 

    blocklist.push(member1.id); 

    fs.writeFileSync('blocklist.json', JSON.stringify(blocklist)); 
  }
    if (interaction.commandName === 'remove-block') { 
          if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
      !interaction.member.roles.cache.some(role => rolesallowed.includes(role.id))
    ) {
      return interaction.reply("لا يمكنك استخدام هذا الأمر لأنك لا تملك الصلاحيات أو الرتب اللازمة.");
    }
      let userToRemove = interaction.options.getMember('remove-block'); 
      if (!userToRemove) return interaction.reply('ضع علامة على الشخص الذي تريد رفع الحظر عنه'); 
      const index = blocklist.indexOf(userToRemove.id); 
      if (index !== -1) {
        try {
          await interaction.reply(`تم إلغاء حظر جهة الاتصال بنجاح ${userToRemove}.`);
          blocklist.splice(index, 1);
          fs.writeFileSync('blocklist.json', JSON.stringify(blocklist));
        } catch (err) {
          console.error(err);
          return interaction.followUp(":x: حدث خطأ أثناء معالجة الطلب.");
        }
      } else {
        interaction.reply(`${userToRemove} هذا الشخص غير محظور.`)
          .catch(err => console.error(err));
      }
    }
})



client.on('interactionCreate',async (interaction) => {
  let rolesallowed = config.roles
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'setup') {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
      !interaction.member.roles.cache.some(role => rolesallowed.includes(role.id))
    ) {
      return interaction.reply("لا يمكنك استخدام هذا الأمر لأنك لا تملك الصلاحيات أو الرتب اللازمة.");
    }
      const embed = new EmbedBuilder()
      .setTitle(config.title)
      .setDescription('اضغط للاسفل للتقديم👇🏽')
      .setColor(config.embedcolor)
      const row = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(config.title)
          .setCustomId('apply')
      )
      await interaction.channel.send({
          embeds: [embed],
          components: [row]
      })
  }
})

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
      if (interaction.customId === 'apply') {
        if (blocklist.includes(interaction.user.id)) {
          await interaction.reply({content:'عزيز المواطن تم حظرك من اداره عرب تاور الرجاء فتح تذكره لاعاده السبب 🚫',ephemeral:true});
          return;
        }    
          const modal = new ModalBuilder()
          .setTitle('استمارة الطلب')
          .setCustomId('staff_apply')
          const nameComponent = new TextInputBuilder()
          .setCustomId('q1')
          .setLabel(`${config.q1}`)
          .setMinLength(2)
          .setMaxLength(25)
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          const ageComponent = new TextInputBuilder()
          .setCustomId('q2')
          .setLabel(`${config.q2}`)
          .setMinLength(1)
          .setMaxLength(2)
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          const whyYou = new TextInputBuilder()
          .setCustomId(`q3`)
          .setLabel(`${config.q3}`)
          .setMinLength(2)
          .setMaxLength(120)
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          const q4 = new TextInputBuilder()
          .setCustomId('q4')
          .setLabel(`${config.q4}`)
          .setMaxLength(400)
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          const q5 = new TextInputBuilder()
          .setCustomId('q5')
          .setLabel(`${config.q5}`)
          .setMaxLength(400)
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)

          const rows = [nameComponent, ageComponent,whyYou,q4,q5].map(
              (component) => new ActionRowBuilder().addComponents(component)
          )
          modal.addComponents(...rows);
          interaction.showModal(modal);
      }
      if (interaction.customId === 'staff_accept') {
        const getIdFromFooter = interaction.message.embeds[0].footer.text;
        const getMember = await interaction.guild.members.fetch(getIdFromFooter);
        try {
          await getMember.send('✅ تم قبولك بالاداره حياك انتظار المقابله.');
        } catch (error) {
          console.error('لا يمكن إرسال رسالة إلى المستخدم:', error);
        }
        try {
          await getMember.roles.add(config.staffid);
        } catch (err) {
          console.error(err);
          return interaction.reply({
            content: ":x: حدث خطأ، لا يمكن تنفيذ العملية.",
          });
        }      
          await interaction.reply({
              content: `${config.yesmessage} ${getMember.user.tag}`
          })
          const newDisabledRow = new ActionRowBuilder()
          .setComponents(
              new ButtonBuilder()
              .setCustomId('staff_accept_ended')
              .setDisabled()
              .setStyle(ButtonStyle.Success)
              .setEmoji("✅")
              .setLabel('قبول')
          )
          .addComponents(
              new ButtonBuilder()
              .setCustomId('staff_deny_ended')
              .setDisabled()
              .setEmoji("❌")
              .setStyle(ButtonStyle.Secondary)
              .setLabel('رفض')
          )
          .addComponents(
            new ButtonBuilder()
            .setCustomId('staff_block')
            .setEmoji("🚫")
            .setDisabled()
            .setStyle(ButtonStyle.Danger)
            .setLabel('حضر')
        )
          interaction.message.edit({ components: [newDisabledRow] })
      }
      if (interaction.customId === 'staff_deny') {
          const getIdFromFooter = interaction.message.embeds[0].footer?.text;
          const getMember = await interaction.guild.members.fetch(getIdFromFooter);
          await interaction.reply({
              content: `${config.nomessage} ${getMember.user}.`
          })
          try {
            await getMember.send('❌ للأسف، تم رفض طلبك. نتمنى لك حظا أفضل في المرة القادمة.');
          } catch (error) {
            console.error('لا يمكن إرسال رسالة إلى المستخدم:', error);
          }
          const newDisabledRow = new ActionRowBuilder()
          .setComponents(
            new ButtonBuilder()
            .setCustomId('staff_accept_ended')
            .setDisabled()
            .setStyle(ButtonStyle.Success)
            .setEmoji("✅")
            .setLabel('قبول')
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('staff_deny_ended')
            .setDisabled()
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary)
            .setLabel('رفض')
        )
        .addComponents(
          new ButtonBuilder()
          .setCustomId('staff_block')
          .setEmoji("🚫")
          .setDisabled()
          .setStyle(ButtonStyle.Danger)
          .setLabel('حضر')
      )
          interaction.message.edit({ components: [newDisabledRow] })
      }
      if (interaction.customId === 'staff_block') {
        const getIdFromFooter = interaction.message.embeds[0].footer?.text;
        const getMember = await interaction.guild.members.fetch(getIdFromFooter);
        if (blocklist.includes(getMember.id)) {
          return interaction.reply('هذا المستخدم موجود بالفعل في القائمة المحظورة.');
        }
        interaction.reply("تم حظر المستخدم تمامًا من الإرسال")

        blocklist.push(getMember.id);

        fs.writeFileSync('blocklist.json', JSON.stringify(blocklist));
      }
  }
  if (interaction.isModalSubmit()) {
      if (interaction.customId === 'staff_apply') {
          const q1 = interaction.fields.getTextInputValue('q1');
          const q2 = interaction.fields.getTextInputValue('q2');
          const q3 = interaction.fields.getTextInputValue('q3');
          const q4 = interaction.fields.getTextInputValue('q4');
          const q5 = interaction.fields.getTextInputValue('q5');

          interaction.reply({
              content: `${config.donesend}`,
              ephemeral: true
          })
          const staffSubmitChannel = interaction.guild.channels.cache.get(config.staffroom);
          if (!staffSubmitChannel) return;
          const embed = new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
          .setColor(config.embedcolor)
          .setFooter({ text: interaction.user.id })
          .setTimestamp()
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields(
              {
                  name: `${config.q1}`,
                  value: q1,
                  inline:true
              },
              {
                  name: `${config.q2}`,
                  value: q2,
                  inline:true
              },
              {
                  name: `${config.q3}`,
                  value: q3,
                  inline:true
              },
              {
                  name: `${config.q4}`,
                  value: q4,
                  inline:true
              },
              {
                  name: `${config.q5}`,
                  value: q5,
                  inline:true
              }

          )
          const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
              .setCustomId('staff_accept')
              .setLabel('قبول')
              .setEmoji("✅")
              .setStyle(ButtonStyle.Success)
          )
          .addComponents(
              new ButtonBuilder()
              .setCustomId('staff_deny')
              .setLabel('رفض')
              .setEmoji("❌")
              .setStyle(ButtonStyle.Secondary)
          )
          .addComponents(
            new ButtonBuilder()
            .setCustomId('staff_block')
            .setEmoji("🚫")
            .setStyle(ButtonStyle.Danger)
            .setLabel('حضر')
        )
          staffSubmitChannel.send({
              embeds: [embed],
              components: [row]
          })
      }
  }
})
client.login(process.env.TOKEN)