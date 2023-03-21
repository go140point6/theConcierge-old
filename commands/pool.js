const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const axios = require('axios');

var hrWFLR
var flrPoolUSD

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pool')
        .setDescription('MingoPool balance in wFLR'),
        async execute(interaction) {
            await interaction.deferReply();

			await axios.get(`https://flare-explorer.flare.network/api?module=account&action=tokenlist&address=0xF837a20EE9a11BA1309526A4985A3B72278FA722`).then(res => {
				let results = res.data.result
				//console.log(res.data.results)
	
				for (const res of results) {
					if (res.contractAddress === "0x1d80c49bbbcd1c0911346656b529df9e5c2f783d") {
						let wflr = Number(res.balance / 10 ** 18)
						console.log(wflr.toFixed(2))
						hrWFLR = wflr.toFixed(2)
					}
				}
			})
			
			await axios.get(`https://api.coingecko.com/api/v3/coins/flare-networks`).then(res => {
				//console.log(res.data)
				let flr = res.data.market_data.current_price.usd;
				console.log(flr)
				flrPoolUSD = (flr * hrWFLR).toFixed(2)
				console.log(flrPoolUSD)
			})

			const embedPool = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				//.setDescription(`The query results for ${ticker}:`)
				.setThumbnail(client.user.avatarURL())
				.addFields(
					{ name: 'Pool Value (wFLR):', value: `${hrWFLR}`},
					{ name: 'Pool USD Value:', value: `$${flrPoolUSD}`},
				)
				//.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
				.setTimestamp()
				//.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

				interaction.editReply({ embeds: [embedPool]});
		}
	}