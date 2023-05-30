//const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
//const client = require('../index')
// npm install ethers@5.7.2
const ethers = require('ethers')
const fs = require('fs')

const abi = "../abi/flareTheFlaremingosNFT.abi"
const contractAbi = JSON.parse(fs.readFileSync(abi))
const contractAddress = "0xE2432F1e376482Ec914ebBb910D3BfD8E3F3F29e"
//const contractAddress = "0x595FA9efFad5c0c214b00b1e3004302519BfC1Db"

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

// The block number to start fetching events from (0 = genesis block)
const startBlock = 8405102;

// The block number to end fetching events at (latest block = "latest")
const endBlock = 8405132;

// Create a new instance of the contract object
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

// Fetch the events using the "queryFilter" method
contract.queryFilter('Transfer', startBlock, endBlock).then((events) => {
  console.log('Found', events.length, 'Transfer events:');
  events.forEach((event) => {
    console.log(' - from:', event.args.from);
    console.log('   to:', event.args.to);
    //console.log('   value:', event.args.value.toString());
    console.log('   tokenId:', event.args.tokenId);
  });
}).catch((err) => {
  console.log('Error fetching events:', err);
});


const ethers = require('ethers');

// The address of the NFT smart contract
const nftContractAddress = '0x1234567890123456789012345678901234567890';

// The ABI of the NFT smart contract
const nftContractAbi = [/* insert ABI here */];

// The provider for the blockchain you want to connect to
const provider = new ethers.providers.JsonRpcProvider('https://your-json-rpc-provider.com');

// The account address that will be used to make the calls to the NFT contract
const accountAddress = '0x1234567890123456789012345678901234567890';

// The lowest price found so far
let lowestPrice = ethers.constants.MaxUint256;

// Create an instance of the NFT contract
const nftContract = new ethers.Contract(nftContractAddress, nftContractAbi, provider);

// Get the total supply of the NFT
const totalSupply = await nftContract.balanceOf(accountAddress);

// Loop over each token ID and get its owner, approved address, and offer price
for (let i = 0; i < totalSupply; i++) {
  const tokenId = await nftContract.tokenOfOwnerByIndex(accountAddress, i);

  const owner = await nftContract.ownerOf(tokenId);
  const approvedAddress = await nftContract.getApproved(tokenId);
  const offer = await nftContract.getOffer(tokenId);

  // Only consider tokens that are owned by the account address
  if (owner === accountAddress) {
    // If there is a current offer and it is lower than the lowest price found so far, update the lowest price
    if (offer > 0 && offer < lowestPrice) {
      lowestPrice = offer;
    }
  }
}

console.log(`The floor price of the NFT is ${ethers.utils.formatEther(lowestPrice)} ETH.`);
