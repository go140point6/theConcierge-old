require('dotenv').config();
// Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
// Node's native path utility module. path helps construct paths to access files and directories. One of the advantages of the path module is that it automatically detects the operating system and uses the appropriate joiners.
const path = require('node:path');
const client = require('../index');
const { REST, Routes, Collection, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Database = require('better-sqlite3');
const chalk = require('chalk'); // npm install chalk@v4.1.2
const decrease = chalk.bold.red
const increase = chalk.bold.green

const formatterDecimal = new Intl.NumberFormat('en-US', {
	style: 'decimal',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

const formatterPercent = new Intl.NumberFormat('en-US', {
	style: 'percent',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

var channelID_Pool = process.env.CHANNEL_ID_POOL
var channelID_Mint = process.env.CHANNEL_ID_MINT
var currentWFLR = 0
var prevWFLR = 0
var currentMint
var prevMint = 0
var count = 0

function onReady(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
    var channel_pool = client.channels.cache.get(channelID_Pool)
    var channel_mint = client.channels.cache.get(channelID_Mint)
    //client.channels.cache.get('935385528520540243').send('Hello here!');

    setInterval(async function() {
        await doMintCalls()
        await doAPICalls()
        //console.log(currentWFLR)
        //console.log(prevWFLR)
        if ( prevWFLR === 0 ) {
            //console.log("zero")
            //console.log(channel)
            prevWFLR = currentWFLR
            //prevWFLR = 900000
            //console.log(prevWFLR)
        } else if ( prevWFLR > currentWFLR ) {
            let hrPercentage = formatterPercent.format(1-(currentWFLR/prevWFLR))
            console.log(`The Mingo Pool has ${decrease('decreased')}!`)
            console.log(`The decrease was ${hrPercentage}`)
            let hrCurrWFLR = formatterDecimal.format(currentWFLR)
            let hrPrevWFLR = formatterDecimal.format(prevWFLR)
            //client.channels.cache.get(channelID).send('Hello there!');
            
            const embedPoolChange = new EmbedBuilder()
                .setColor('LuminousVividPink')
                .setTitle(`Flavio here, need anything else?`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`The Mingo Pool has decreased by ${hrPercentage}!`)
                .setThumbnail(client.user.avatarURL())
                .addFields(
                    { name: 'Old Balance: ', value: `${hrPrevWFLR}` },
                    { name: 'New Balance: ', value: `${hrCurrWFLR}` },
                )
                //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
                .setTimestamp()
                //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

            channel_pool.send({ embeds: [embedPoolChange] })
            prevWFLR = currentWFLR
            //channel.send('Hello there!');
        } else if ( prevWFLR < currentWFLR ) {
            let hrPercentage = formatterPercent.format(-(1-(currentWFLR/prevWFLR)))
            console.log(`The Mingo Pool has ${increase('increased')}!`)
            console.log(`The increase was ${hrPercentage}`)
            let hrCurrWFLR = formatterDecimal.format(currentWFLR)
            let hrPrevWFLR = formatterDecimal.format(prevWFLR)
            //client.channels.cache.get(channelID).send('Hello there!');
            
            const embedPoolChange = new EmbedBuilder()
                .setColor('LuminousVividPink')
                .setTitle(`Flavio here, need anything else?`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`The Mingo Pool has increased by ${hrPercentage}!`)
                .setThumbnail(client.user.avatarURL())
                .addFields(
                    { name: 'Old Balance: ', value: `${hrPrevWFLR}` },
                    { name: 'New Balance: ', value: `${hrCurrWFLR}` },
                )
                //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
                .setTimestamp()
                //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

            channel_pool.send({ embeds: [embedPoolChange] })
            prevWFLR = currentWFLR
        }

        //let prevMint = 275
        count++
        console.log(count)
        console.log("prevMint: ", prevMint)
        console.log("currentMint: ", currentMint)
        if (count === 15 ) {
            if ( currentMint > prevMint) {
            //count++
            //console.log(count)
            //if ( count === 15 ) { 
                let last30 = (Number(currentMint) - Number(prevMint))
                let totalPerc = formatterPercent.format(Number(currentMint)/888)
                //let hrPercentage = formatterPercent.format(1-(currentWFLR/prevWFLR))
                console.log(`The Frens Mint is at ${currentMint}!`)
                console.log(`The total minted is ${totalPerc}`)
                //let hrCurrWFLR = formatterDecimal.format(currentWFLR)
                //let hrPrevWFLR = formatterDecimal.format(prevWFLR)
                //client.channels.cache.get(channelID).send('Hello there!');
                
                const embedMint = new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(`Flavio here, need anything else?`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`Mingo Frens update:`)
                    .setThumbnail(client.user.avatarURL())
                    .addFields(
                        { name: 'Number of recent mints (last 30 minutes): ', value: `${last30}` },
                        { name: 'Total Mingo Frens mints: ', value: `${currentMint}` },
                        { name: 'Percentage to sell out: ', value: `${totalPerc}` },
                    )
                    //.setImage('https://media.tenor.com/Egt2H3v94ZYAAAAd/dog-pool.gif')
                    .setTimestamp()
                    //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

                channel_mint.send({ embeds: [embedMint] })
                prevMint = currentMint
                console.log("New prevMint: ", prevMint)
                //count = 0
                //channel.send('Hello there!');
                }
                count = 0
            }    
    }, process.env.INTERVAL_POOL);
        
    client.commands = new Collection();

    const commands = [];

    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    // and deploy your commands!
    (async () => {
	    try {
		    // The put method is used to fully refresh all commands in the guild with the current set.
		    const data = await rest.put(
			    Routes.applicationGuildCommands(
                    process.env.CLIENT_ID, 
                    process.env.GUILD_ID
                    ),
			    { body: commands },
		    );

		    console.log(`Successfully loaded ${data.length} application (/) commands.`);
	    } catch (error) {
		    // Catch and log any errors.
		    console.error(error);
	    }
    })();

    //getXRPToken(); 
    //setInterval(getXRPToken, Math.max(1, 5 || 1) * 60 * 1000);
    //getFLRToken();
    //setInterval(getFLRToken, Math.max(1, 5 || 1) * 60 * 1000);
    doAPICalls();
    doMintCalls();
    // the functions above setIntervalMint and Pool, are self running based on that interval
    //setInterval(doAPICalls, Math.max(1, 5 || 1) * 60 * 1 * 1000);
    //setInterval(doMintCalls, Math.max(1, 10 || 1) * 60 * 1 * 1000);
    //doCheckPool();
    //setInterval(doCheckPool, Math.max(1, 3 || 1) * 60 * 1 * 1000);
    
};

async function getFLR() {
    await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=flare-networks`).then(res => {
            if (res.data && res.data[0].current_price) {
                const currentFLR = res.data[0].current_price.toFixed(4) || 0 
                console.log("FLR current price: " + currentFLR);
                module.exports.currentFLR = currentFLR;
            } else {
                console.log("Error loading coin data")
            }
            //return;
        }).catch(err => {
            console.log("An error with the Coin Gecko api call: ", err.response.status, err.response.statusText);
    })
};

async function getMint(client) {
    await axios.get(`https://flare-explorer.flare.network/api?module=stats&action=tokensupply&contractaddress=0x595FA9efFad5c0c214b00b1e3004302519BfC1Db`).then(res => {
        currentMint = res.data.result
        if (prevMint === 0) {
            prevMint = currentMint
        }
        console.log("Frens mint stands at: ", currentMint)
        module.exports.currentMint = currentMint;
    })
}

async function getPoolBalance(client) {
    //try {
    await axios.get(`https://flare-explorer.flare.network/api?module=account&action=tokenlist&address=0xF837a20EE9a11BA1309526A4985A3B72278FA722`).then(res => {
            let results = res.data.result
            if (results) {
                for (const res of results) {
                    if (res.contractAddress === "0x1d80c49bbbcd1c0911346656b529df9e5c2f783d") {
                        currentWFLR = Number(res.balance / 10 ** 18)

                        console.log("wFLR current balance: ", currentWFLR.toFixed(2));
                        module.exports.currentWFLR = currentWFLR;
                        //hrWFLR = formatterDecimal.format(wflrBalance)
                        //flrShare = formatterDecimal.format(wflrBalance/888)
                        }
                    }
                } else {
                    console.log("Error loading token data")
                }
        })
        //catch(err) {
		//	console.error(err);
        //    interaction.editReply({ content: `Some error building embed, please try again or see if the poolboy is sober enough to assist.`});
		//}
};

/*
async function checkPoolBalance(currentWFLR) {
    console.log("From function checkPoolBalance: ", currentWFLR)
    //console.log(client)
    //client.channels.cache.get('935385528520540243').send('Bingo');
}
*/

/*
async function sendMessage(client) {
    //client.channels.cache.get('935385528520540243').send('Bingo');
    //console.log("From function sendMessage: ", currentWFLR)
    if (prevWFLR === 0) {
        prevWFLR = currentWFLR
        console.log(prevWFLR)
    }
    if (prevWFLR === currentWFLR) {
        client.channels.cache.get('935385528520540243').send('wFLR has not changed');
    } else {
        client.channels.cache.get('935385528520540243').send('wFLR HAS changed');
    }
}
*/

async function doMintCalls() {
    await getMint();
}

async function doAPICalls() {
    await getFLR();
    await getPoolBalance();
    //await sendMessage(client);
}

/*
async function doCheckPool(currentWFLR, client) {
    await checkPoolBalance(currentWFLR, client);
}
*/

module.exports = { 
    onReady
}