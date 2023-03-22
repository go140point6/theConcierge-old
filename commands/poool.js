const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poool')
        .setDescription('Someone sober up the poolboy, Clancy is in the pool again.'),
        async execute(interaction) {
            await interaction.deferReply();

			const embedPool = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				.setDescription(`Calling the poolboy to come get Clancy out of the pool again.`)
				.setThumbnail(client.user.avatarURL())
				//.addFields(
				//	{ name: 'Your drinks:', value: ':beer: :wine_glass: :cocktail:'},
				//)
				.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
				.setTimestamp()
				//.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

				interaction.editReply({ embeds: [embedPool]});
		} 
}