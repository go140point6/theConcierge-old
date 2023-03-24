const ethers = require('ethers')
const fs = require('fs')

var fCR = "../abi/flareContractRegistry.abi"
var fCRabi = JSON.parse(fs.readFileSync(fCR))

var provider = new ethers.JsonRpcProvider(
    "https://flare-api.flare.network/ext/C/rpc"
    )

const flareContractRegistry = {
    address: "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    abi: fCRabi,
}

// Create Flare Contract Registry instance
const flareContractRegistryInstance = new ethers.Contract(
    flareContractRegistry.address,
    flareContractRegistry.abi,
    provider
); //This semicolon is required here for the self-invoking function to run

/*
//const ftsoRegCA = await flareContractRegistryInstance.getContractAddressByName('FtsoRegistry')
(async () => {
    const ftsoRegCA = await flareContractRegistryInstance.getContractAddressByName('FtsoRegistry')
})
*/

//const ftsoRegCA = async () => await new Promise(r => flareContractRegistryInstance.getContractAddressByName('FtsoRegistry'));

//exports.ftsoRegCA = ftsoRegCA;

//const PI = 3.1416

/*
async () => {
    const ftsoReg = await flareContractRegistryInstance.getContractAddressByName('FtsoRegistry')
}
*/

const ftsoReg = async() => await new Promise(r => flareContractRegistryInstance.getContractAddressByName('FtsoRegistry'))

//const sleep = async (ms) => await new Promise(r => setTimeout(r,ms));

//exports.sleep = sleep;

//exports.ftsoRegCA = ftsoRegCA

//exports.PI = PI
exports.ftsoReg = ftsoReg

/*
async function getFtsoRegCA() {
    const ftsoRegCA = await flareContractRegistryInstance.getContractAddressByName('FtsoRegistry')
    console.log("FTSO Registry Contract Address: ", ftsoRegCA)
}

async function getFtso() {
    await getFtsoRegCA()
    //exports.ftsoRegCA = ftsoRegCA;
}

getFtso()
*/