const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('happy-hour')
        .setDescription('Request for the happy hour menu.'),
        async execute(interaction) {
            await interaction.deferReply();

			const embedPool = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				.setDescription(`Here's the happy hour menu you requested.`)
				.setThumbnail(client.user.avatarURL())
				//.addFields(
				//	{ name: 'Your drinks:', value: ':beer: :wine_glass: :cocktail:'},
				//)
				.setImage('https://media-cdn.tripadvisor.com/media/photo-s/10/61/c0/d7/let-s-flamingle-with.jpg')
				.setTimestamp()
				//.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

				interaction.editReply({ embeds: [embedPool]});
		} 
}