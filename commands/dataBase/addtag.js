const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bender_addtag")
    .setDescription("Use it to test different options") 
    .addStringOption(option =>
     option.setName("name").setDescription("NOM").setRequired(true)
    )
     .addStringOption(option =>
        option.setName("description").setDescription("Description").setRequired(true)
    ),
  async execute(interaction) {
    //await interaction.reply({
      //content: "Saucisse potentiellement privée",
      //ephemeral: interaction.options.getBoolean("ephemeral"),
    //});
  },
};
