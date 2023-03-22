const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../index');
const axios = require('axios');
const currentFLR = require('../events/onReady');
const currentWFLR = require('../events/onReady');

var hrWFLR
var flrPoolUSD
//var wflrBalance
var flrShare
var usdShare

const formatterUSD = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

const formatterDecimal = new Intl.NumberFormat('en-US', {
	style: 'decimal',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pool')
        .setDescription('MingoPool balance in wFLR and USD.'),
        async execute(interaction) {
            await interaction.deferReply();

			try {
			//await axios.get(`https://flare-explorer.flare.network/api?module=account&action=tokenlist&address=0xF837a20EE9a11BA1309526A4985A3B72278FA722`).then(res => {
				//let results = res.data.result
				//console.log(res.data.results)
	
				//for (const res of results) {
				//	if (res.contractAddress === "0x1d80c49bbbcd1c0911346656b529df9e5c2f783d") {
				//		wflrBalance = Number(res.balance / 10 ** 18)
				//		//console.log(wflr.toFixed(2))
						let wflrBalance = currentWFLR.currentWFLR 
						console.log("In pool command, wFLR: ", wflrBalance)
						hrWFLR = formatterDecimal.format(wflrBalance)
						flrShare = formatterDecimal.format(wflrBalance/888)
					//}
				//}
			//})
			
			//await axios.get(`https://api.coingecko.com/api/v3/coins/flare-networks`).then(res => {
				//console.log(res.data)
				let flr = currentFLR.currentFLR
				//console.log(flr)
				//flrPoolUSD = (flr * hrWFLR).toFixed(2)
				flrPoolUSD = formatterUSD.format(flr * wflrBalance)
				usdShare = formatterUSD.format((flr * wflrBalance)/888)
			//})

			const embedPool = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				//.setDescription(`The query results for ${ticker}:`)
				.setThumbnail(client.user.avatarURL())
				.addFields(
					{ name: 'Pool Value (wFLR):', value: `${hrWFLR}`},
					{ name: 'Pool USD Value:', value: `${flrPoolUSD}`},
					{ name: 'Pool Share per Mingo:', value: `${flrShare} wFLR (${usdShare})`},
				)
				//.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
				.setTimestamp()
				//.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

				interaction.editReply({ embeds: [embedPool]});
		} catch(err) {
			console.error(err);
            interaction.editReply({ content: `Some error building embed, please try again or see if the poolboy is sober enough to assist.`});
		}
	}
}