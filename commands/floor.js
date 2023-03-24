//const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
//const client = require('../index')
const ethers = require('ethers')
const fs = require('fs')
//const { ftsoReg } = require('../utils/getFtsoRegistry')
//const PI = require('../utils/getFtsoRegistry')
//const { sleep } = require('../utils/sleep')

/*
async function getFtsoReg() {
    await ftsoRegCA()
}
*/

var fCR = "../abi/flareContractRegistry.abi"
var fFR = "../abi/flareFtsoRegistry.abi"
var fCRabi = JSON.parse(fs.readFileSync(fCR))
var fFRabi = JSON.parse(fs.readFileSync(fFR))
var ftsoRegCA
var ftsoRegistryContract
var flrPrice

var provider = new ethers.JsonRpcProvider(
    "https://flare-api.flare.network/ext/C/rpc"
    )

const flareContractRegistry = {
    address: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    abi: fCRabi,
}

// Create Flare Contract Registry instance to get FTSO
const flareContractRegistryInstance = new ethers.Contract(
    flareContractRegistry.address,
    flareContractRegistry.abi,
    provider
)

/*
// Get FTSO
const flareFtsoRegistry = {
    address: ftsoRegCA,
    abi: fFRabi,
}
*/

//console.log(flareContractRegistryInstance.getContractAddressByName)
//console.log(flareContractRegistryInstance.getAllContracts)
//flareContractRegistryInstance.getAllContracts().then(res => console.log(res))

/*
flareContractRegistryInstance.getAllContracts().then(res => {
    console.log(res)
})
*/

/*
flareContractRegistryInstance.getContractAddressByName('FtsoRegistry').then(res => {
    //console.log(res)
    //ftsoReg = res
})
*/


async function getFtsoRegCA() {
    ftsoRegCA = await flareContractRegistryInstance.getContractAddressByName('FtsoRegistry')
    //console.log("FTSO Registry Contract Address: ", ftsoRegCA)
}

async function getFtsoContract() {
    // Get FTSO
    const flareFtsoRegistry = {
        address: ftsoRegCA,
        abi: fFRabi,
    }
    //console.log(flareFtsoRegistry)

    ftsoRegistryContract = new ethers.Contract(
        flareFtsoRegistry.address,
        flareFtsoRegistry.abi,
        provider
    )
}

async function getFlrPrice() {
    let flrBN = await ftsoRegistryContract["getCurrentPrice(string)"]("FLR")
    flrPrice = Number(flrBN._price) / 10 ** 5;
}

async function main() {
    await getFtsoRegCA()
    console.log("FTSO Registry Contract Address: ", ftsoRegCA)

    await getFtsoContract()
    await getFlrPrice()
    console.log("FLR price ", flrPrice)


}

main()



