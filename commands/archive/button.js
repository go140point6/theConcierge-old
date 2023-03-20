const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Shows how buttons work'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Click me!')
                .setStyle(ButtonStyle.Primary),
        );

    await interaction.reply({ content: 'I think you should,', components: [row] });
    },
};