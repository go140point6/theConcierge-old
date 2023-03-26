//const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//const client = require('../index');
const axios = require('axios');
//const currentFLR = require('../events/onReady');
//const currentWFLR = require('../events/onReady');

async function getOwners() {
    await axios.get(`https://flare-explorer.flare.network/api?module=token&action=getTokenHolders&contractaddress=0xE2432F1e376482Ec914ebBb910D3BfD8E3F3F29e&page=1&offset=888`).then(res => {
	    let results = res.data.result
        console.log(results)
    })
}

async function getTokenInfo() {
    await axios.get(`https://flare-explorer.flare.network/api?module=account&action=tokenlist&address=0x8bead41be49466e4e1e8f0989eae785c44aaba53`).then(res => {
	    let results = res.data.result
        console.log(results)
    })
}

async function main() {
    //await getOwners()
    //await getTokenInfo()
}

main()

