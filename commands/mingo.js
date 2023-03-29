const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const axios = require('axios');

var thumb
var author

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mingo')
        .setDescription('Show me a random mingo.'),
        async execute(interaction) {
            //await interaction.deferReply();

			await axios.get(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=flamingo`).then(res => {
				//let results = res.data
				//console.log(results)
				thumb = res.data.urls.thumb
				author = res.data.user.username
				//console.log(thumb)
				//console.log(author)
			})

			const embedPool = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				.setDescription(`How's this beautiful mingo?`)
				.setThumbnail(client.user.avatarURL())
				//.addFields(
				//	{ name: 'Your drinks:', value: ':beer: :wine_glass: :cocktail:'},
				//)
				.setImage(`${thumb}`)
				.setTimestamp()
				.setFooter({ text: `Thanks to https://unsplash.com/@${author}` });

				interaction.reply({ embeds: [embedPool]});
		} 
}