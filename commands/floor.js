//const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
//const client = require('../index')
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

//getLatestBlock()

async function getLogs() {
    console.log(`Getting the Flaremingos Transfer events...`);

    //const cryptopunkContractAddress: string = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB'; 

    const currentBlock = await provider.getBlockNumber()
    console.log(currentBlock)

    const eventSignature = 'Transfer(address,address,uint256)';
    //const eventTopic = ethers.utils.id(eventSignature); // Get the data hex string
    const eventTopic = contractInstance(eventSignature); // Get the data hex string

    rawLogs = await provider.getLogs({
        address: contractAddress,
        topics: [eventTopic],
        topics: [],
        fromBlock: currentBlock - 30, 
        toBlock: currentBlock
    });
}

async function getEvents() {
    console.log(`Getting the Flaremingo Frens events...`);

    const currentBlock = await provider.getBlockNumber()
    console.log(currentBlock)
  
    let events = await contractInstance.queryFilter(currentBlock - 30, currentBlock);
  
    console.log(events);
  }

getEvents()

//getLogs()