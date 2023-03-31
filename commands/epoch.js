const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const client = require('../index')
const ethers = require('ethers')
const fs = require('fs')

const fCR = "abi/flareContractRegistry.abi"
const fFR = "abi/flareFtsoRegistry.abi"
const fFM = "abi/flareFtsoManager.abi"
const fCRabi = JSON.parse(fs.readFileSync(fCR))
const fFRabi = JSON.parse(fs.readFileSync(fFR))
const fFMabi = JSON.parse(fs.readFileSync(fFM))

var ftsoRegistryCA
var ftsoManagerCA
var flrPrice
var flrCurrentEpoch
var flrCurrentEpochEnds
var flrCurrentLockzoneBegins

var provider = new ethers.JsonRpcProvider(
    "https://flare-api.flare.network/ext/C/rpc"
    )

// Flare Contract Regiatry address
// the only address that should be hard-coded
const flareContractRegistry = {
    address: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    abi: fCRabi,
}

// Create Flare Contract Registry instance
const flareContractRegistryInstance = new ethers.Contract(
    flareContractRegistry.address,
    flareContractRegistry.abi,
    provider
)

//console.log(flareContractRegistryInstance)

// FtsoManager for epoch information
// Use the flareContractRegistryInstance to get address
async function getFlrEpochInfo() {
    ftsoManagerCA = await flareContractRegistryInstance.getContractAddressByName('FtsoManager')
    //console.log("FTSO Manager CA: ", ftsoManagerCA)

    const flareFtsoManager = {
        address: ftsoManagerCA,
        abi: fFMabi,
    }

    const flareFtsoManagerInstance = new ethers.Contract(
        flareFtsoManager.address,
        flareFtsoManager.abi,
        provider
    )

    //console.log(flareFtsoManagerInstance)
    let flrEpoch = await flareFtsoManagerInstance.getCurrentRewardEpoch()
    let flrExpireEpoch = await flareFtsoManagerInstance.getRewardEpochToExpireNext()
    let flrEpochEnds = await flareFtsoManagerInstance.currentRewardEpochEnds()
    let flrEpochDuration = await flareFtsoManagerInstance.rewardEpochDurationSeconds()
    //console.log(typeof(flrEpoch))
    flrCurrentEpoch = Number(flrEpoch)
    //console.log("Current Flare Epoch ", Number(flrEpoch))
    //console.log("Reward Epoch to Expire Next: ", Number(flrExpireEpoch))

    let flrEpochEndsMS = Number(flrEpochEnds)*1000
    //console.log("Current Reward Epoch Ends (miliseconds): ", flrEpochEndsMS)
    let hrFlrEpochEnds = new Date(flrEpochEndsMS)
    //console.log("Current Reward Epoch Ends (UTC): ", hrFlrEpochEnds.toUTCString())
    //console.log("Current Reward Epoch Ends (Local): ", hrFlrEpochEnds.toLocaleString())
    flrCurrentEpochEnds = hrFlrEpochEnds.toLocaleString()
    
    let flrEpochDurationMS = Number(flrEpochDuration)*1000
    //console.log("Epoch Duration (miliseconds): ", flrEpochDurationMS)
    let flrLockDeadlineMS = flrEpochDurationMS/2
    //console.log("Epoch Lock Deadline (miliseconds): ", flrLockDeadlineMS)

    let flrLockCurrentDeadlineMS = flrEpochEndsMS - flrLockDeadlineMS
    //console.log("Epoch Lock Current Deadline (miliseconds): ", flrLockCurrentDeadlineMS)
    
    let hrFlrLockDeadline = new Date(flrLockCurrentDeadlineMS)
    //console.log("Current Lock Deadline (UTC): ", hrFlrLockDeadline.toUTCString())
    //console.log("Current Lock Deadline (Local): ", hrFlrLockDeadline.toLocaleString())
    flrCurrentLockzoneBegins = hrFlrLockDeadline.toLocaleString()
}

// FtsoRegistry for pricing information
// Use the flareContractRegistryInstance to get address
async function getFlrPriceInfo() {
    ftsoRegistryCA = await flareContractRegistryInstance.getContractAddressByName('FtsoRegistry')
    console.log("FTSO Registry CA: ", ftsoRegistryCA)

    const flareFtsoRegistry = {
        address: ftsoRegistryCA,
        abi: fFRabi,
    }

    const flareFtsoRegistryInstance = new ethers.Contract(
        flareFtsoRegistry.address,
        flareFtsoRegistry.abi,
        provider
    )

    let flrBN = await flareFtsoRegistryInstance["getCurrentPrice(string)"]("FLR")
    flrPrice = Number(flrBN._price) / 10 ** 5;

    //console.log("FLR price: ", flrPrice)
}

//getFlrPriceInfo()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('epoch')
        .setDescription('Get current Flare Epoch and Lock Deadline information.'),
        async execute(interaction) {
            //await interaction.deferReply();
            await getFlrEpochInfo()

			const embedEpoch = new EmbedBuilder()
				.setColor('LuminousVividPink')
				.setTitle(`Flavio here, need anything else?`)
				//.setAuthor({ name: client.user.username })
				.setDescription(`Current Flare Epoch and Lock Deadline information:`)
				.setThumbnail(client.user.avatarURL())
				.addFields(
					{ name: 'Current epoch: ', value: `${flrCurrentEpoch}`},
                    { name: 'Current epoch and lock zone ends (local): ', value: `${flrCurrentEpochEnds}`},
                    { name: 'Start of Lock Zone (local): ', value: `${flrCurrentLockzoneBegins}`},
				)
				//.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
				.setTimestamp()
				//.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

				interaction.reply({ embeds: [embedEpoch]});
		} 
}


