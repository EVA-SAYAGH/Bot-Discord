const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const { token } = require("./config.json");
const Sequelize = require("sequelize");
const Filter = require('bad-words'); // Importer la bibliothèque bad-words


const filtreMotsOffensants = new Filter();


const motsOffensantsASupprimer = ["connard", "va te faire foutre", "ferme ta gueule", "batard", "trou du cul", "sac à merde", "enfoiré", "va te faire foutre", "salope", "pétasse", "abruti", "pute", "tête de bite", "abruti", "sale conne", "sale con", "sale merde", "tocard", "sous-merde", "mange-merde", "pouffiasse", "bouffon", "grognasse", "salaud", "fils de chien", "ta mère", "baltringue", "fils de pute", "connasse", "ta gueule", "tg", "fdp", "batard", "batarde", "je t'encule", "va te faire voir"];


function filtrageContenu(message) {
  const contenu = message.content.toLowerCase();
  

  if (filtreMotsOffensants.isProfane(contenu) || motsOffensantsASupprimer.some(mot => contenu.includes(mot))) {
    message.delete().catch(err => console.error("Erreur lors de la suppression du message:", err));
    
  }
}

// Create a new client to run the bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLITE only
  storage: "database.sqlite"
});

const Tags = sequelize.define("tags", {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowfull: false
  }
});

// Create a command collection
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Get the individual commands from their respective subfolder inside "commands"
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Get the events from the "event" folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
    if (event.name == Events.ClientReady) {
      Tags.sync();
      console.log('Database Tags successfully synced ! ');
    }
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "bender_addtag") {
    const tagName = interaction.options.getString("name");
    const tagDescritpion = interaction.options.getString("description");

    try {
      const tag = await Tags.create({
        name: tagName,
        descritpion: tagDescription,
        username: interaction.user.username
      });

      return interaction.reply('Tag ${tag.name} added.');
    } catch (error) {
      if (error.name == "SequelizeUniqueConstraintError") {
        return interaction.reply("That tag already exists.")
      }
      return interaction.reply("Something went wrong with adding a tag.");
    }
  }
});


client.on(Events.MessageCreate, message => {
  filtrageContenu(message);

 
  if (filtreMotsOffensants.isProfane(message.content.toLowerCase())) {
    attribuerAvertissement(message.author.id);
  }
});


client.on(Events.MessageCreate, message => {
  if (message.channel.type === 'GUILD_TEXT' || message.channel.type === 'GUILD_VOICE') {
    filtrageContenu(message);
  }
});


const warnings = new Collection();


function attribuerAvertissement(utilisateurId) {
  if (!warnings.has(utilisateurId)) {
    warnings.set(utilisateurId, 1);
  } else {
    const count = warnings.get(utilisateurId);
    if (count >= 3) {
    
      const utilisateur = client.users.cache.get(utilisateurId);
      if (utilisateur) {
        utilisateur.send("Vous avez été banni temporairement pour comportement inapproprié.").then(() => {
          
        }).catch(err => console.error("Erreur lors de l'envoi du message:", err));
      }
    } else {
      warnings.set(utilisateurId, count + 1);
    }
  }
}



client.login(token);







