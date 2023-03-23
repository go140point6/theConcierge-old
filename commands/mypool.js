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
var myFlrShare
var myUsdShare
var mingos

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
        .setName('mypool')
        .setDescription('Your MingoPool share in wFLR and USD.')
		.addStringOption((option) =>
		option
			.setName("mingos")
			.setDescription("How many mingos in your flamboyance?")
			.setRequired(true)
	),
        async execute(interaction) {
            await interaction.deferReply();

			mingos = (interaction.options.getString("mingos", true));

			try {
			//await axios.get(`https://flare-explorer.flare.network/api?module=account&action=tokenlist&address=0xF837a20EE9a11BA1309526A4985A3B72278FA722`).then(res => {
				//let results = res.data.result
				//console.log(res.data.results)
	
				//for (const res of results) {
					//if (res.contractAddress === "0x1d80c49bbbcd1c0911346656b529df9e5c2f783d") {
						let wflrBalance = currentWFLR.currentWFLR
						//wflrBalance = Number(res.balance / 10 ** 18)
						//console.log(wflr.toFixed(2))
						hrWFLR = formatterDecimal.format(wflrBalance)
						flrShare = wflrBalance/888
						formatFlrShare = formatterDecimal.format(flrShare)
						myFlrShare = formatterDecimal.format(flrShare*mingos)
					//}
				//}
			//})
			
			//await axios.get(`https://api.coingecko.com/api/v3/coins/flare-networks`).then(res => {
				//console.log(res.data)
				let flr = currentFLR.currentFLR
				
				//console.log(flr)
				//flrPoolUSD = (flr * hrWFLR).toFixed(2)
				flrPoolUSD = formatterUSD.format(flr * wflrBalance)
				usdShare = (flr * wflrBalance)/888
				formatUsdShare = formatterUSD.format(usdShare/888)
				myUsdShare = formatterUSD.format((usdShare*mingos))
			//})

			const embedPool = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				.setDescription(`Your flamboyance of ${mingos} mingos:`)
				.setThumbnail(client.user.avatarURL())
				.addFields(
					{ name: 'Your share (wFLR):', value: `${myFlrShare}`},
					{ name: 'Your share (USD):', value: `${myUsdShare}`},
				)
				//.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
				.setTimestamp()
				//.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

				interaction.editReply({ embeds: [embedPool], ephemeral: true });
		} catch(err) {
			console.error(err);
            interaction.editReply({ content: `Some error building embed, please try again or see if the poolboy is sober enough to assist.`});
		}
	}
}