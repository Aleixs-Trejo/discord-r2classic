require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { levels } = require("./icons");
const path = require("node:path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.on('ready', () => console.log(`Bot está conectado como ${client.user.tag}`));

client.on('messageCreate', async (message) => {
  if (message.author.tag !== "Naree#4654") return;
  console.log("Mensaje: ", message.content);
  console.log("Autor: ", message.author.tag);

  const regex = /subiste a nivel (\d+)/i;
  const found = message.content.match(regex);

  if(!found) return;

  const level = parseInt(found[1]);
  const user = message.mentions.users.first() || message.author;

  const rango = levels.find(r => level >= r.min && level <= r.max);
  const imgPath = path.join(__dirname, 'img', rango.img);
  const attachment = new AttachmentBuilder(imgPath);

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`¡Subió de nivel!`)
    .setDescription(`${user} ha subido a nivel ${level}!`)
    .setThumbnail(`attachment://${rango.img}`)
    .setTimestamp();

  const [guildID, channelIDPublico] = process.env.CANAL_PUBLICO.split('/');
  const canalPublico = await client.channels.fetch(channelIDPublico);

  await canalPublico.send({ embeds: [embed], files: [attachment] });
});

client.login(process.env.DISCORD_TOKEN);