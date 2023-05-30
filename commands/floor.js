//const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
//const client = require('../index')
// npm install ethers@5.7.2
const ethers = require('ethers')
const fs = require('fs')

const abi = "../abi/flareTheFlaremingosNFT.abi"
const contractAbi = JSON.parse(fs.readFileSync(abi))
//const contractAddress = "0xE2432F1e376482Ec914ebBb910D3BfD8E3F3F29e"
const contractAddress = "0x595FA9efFad5c0c214b00b1e3004302519BfC1Db"

console.log(ethers.version)

var provider = new ethers.providers.JsonRpcProvider(
    "https://flare-api.flare.network/ext/C/rpc"
    )


// Create instance of contact
const contractInstance = new ethers.Contract(
    contractAddress,
    contractAbi,
    provider
)

async function getName() {
    let nftName = await contractInstance.name() 
    console.log(nftName)
}

getName()

async function getLatestBlock() {
    let latest = await provider.getBlockNumber()
    console.log(latest)
}

getLatestBlock()

