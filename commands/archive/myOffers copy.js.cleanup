const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const axios = require('axios');
const client = require('../index');
const { sleep } = require('../utils/sleep')

var commandInProgress = false;

var offers;
var sellOffers;
var currentOffers2;
var currentSellOffers2;
var currentIndex;
var lastIndexObj;
var rawAmount;
var amount;
var indexPrevState;
var indexNextState;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myoffers')
        .setDescription('Current BUY offers for an address')
        .addStringOption((option) =>
        option
            .setName("address")
            .setDescription("The address you want to check.")
            .setRequired(true)
    ),
    async execute(interaction) {
        if (commandInProgress === true) {
            //console.log("Command is in progress");

            const waitEmbed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle(`Welcome to The Terminal`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`I am currently processing another user's request, please wait until I am ready.`)
                .setThumbnail(client.user.avatarURL())
                //.addFields(embedFields)
                //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                .setTimestamp()
                //.setFooter({ text: `${address}` });
    
        await interaction.reply({ embeds: [waitEmbed], ephemeral: true });

        } else {
        commandInProgress = true
        const address = interaction.options.getString("address", true);

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('start')
                .setLabel('Get Started')
                .setStyle(ButtonStyle.Success),
        );

        const initialEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`I will show you the current HIGHEST BUY offers for this address.`)
            //.setDescription(`${interaction.user.username} has requestd to see the current HIGHEST BID offers.  Processing...`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            .setFooter({ text: `${address}` });

    await interaction.reply({ embeds: [initialEmbed], components: [row], ephemeral: true });

        //console.log((`Collected ${collected.size} items`));
        const noEmbed = new EmbedBuilder()
        .setColor('DarkRed')
        .setTitle(`Welcome to The Terminal`)
        //.setAuthor({ name: client.user.username })
        .setDescription(`I am currently processing a user's request, please do not use the /myoffers command until I am ready. All other commands are available.`)
        .setThumbnail(client.user.avatarURL())
        //.addFields(embedFields)
        //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
        .setTimestamp()
        //.setFooter({ text: `${address}` });
                
        await interaction.followUp({ embeds: [noEmbed] });

    //console.log(interaction.user.id);
    //console.log(interaction);
    
    //const originalSender = interaction.user.id;
    //const filter = interaction => interaction.user.id === originalSender;

    //const collector = interaction.channel.createMessageComponentCollector(filter, { componentType: ComponentType.Button, time: 120000 });
    const collector = interaction.channel.createMessageComponentCollector({componentType: ComponentType.Button, idle: 30000 });

    collector.on('collect', async i => {
        if (i.user.id === interaction.user.id && i.customId === 'start') {
            
            console.log('Address to check: ' + address);
            //collector.resetTimer(5000);
            //console.log(collector.options.time);
            //console.log(collector);
            buyOffers(i);

        } else if (i.user.id === interaction.user.id && i.customId === 'nextBuy') {

            currentIndex++
            //collector.resetTimer(5000);
            nextBuyOffer(i);

        } else if (i.user.id === interaction.user.id && i.customId === 'prevBuy') {
            
            currentIndex--
            //collector.resetTimer(5000);
            nextBuyOffer(i);

        } else {

            i.reply({ content: `These buttons are not for you!`, ephemeral: true });
        }
    }) 

    collector.on('end', async (collected, reason) => {
        //console.log(reason);
        //console.log(`Collected ${collected.size} items`)
        //if (collected.size == 0) {
            //console.log(`It was zero`);
            //await interaction.editReply({ components: [] });
            const shutdownEmbed = new EmbedBuilder()

            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`System inactive, The Terminal is shutting down.`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
        
            await interaction.editReply({ embeds: [shutdownEmbed], components: [], ephemeral: true });
            commandInProgress = false;
        
            
            //console.log((`Collected ${collected.size} items`));
            const availEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`I am available to show the next user their BUY offers. Proceed when ready.`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: `${address}` });

    
            await interaction.followUp({ embeds: [availEmbed] });
            commandInProgress = false;
            
    });

    async function buyOffers(i) {
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
            if(res.data) {
                //console.log(res.data.data.offers)
                //console.log(res.data.data.offers.length)

                offers = res.data.data.offers;
                let currentOffers = [];

                offers.forEach(offer => {
                    Object.entries(offer.buy).forEach(([key, val]) => {
                        
                        const findNFTIndex = currentOffers.findIndex(
                            (nftid) => nftid.NFTokenID === offer.buy[key].NFTokenID
                        )

                        if (findNFTIndex == -1) {
                            currentOffers.push({
                                "offerNo": key, 
                                "Amount":offer.buy[key].Amount, 
                                "NFTokenID": offer.buy[key].NFTokenID, 
                                "OfferID": offer.buy[key].OfferID, 
                                "Owner": offer.buy[key].Owner, 
                                "Destination": offer.buy[key].Destination, 
                                "Expiration": offer.buy[key].Expiration
                            })
                        } else {
                            currentOffers[findNFTIndex] = {
                                "offerNo": key, 
                                "Amount":offer.buy[key].Amount, 
                                "NFTokenID": offer.buy[key].NFTokenID, 
                                "OfferID": offer.buy[key].OfferID, 
                                "Owner": offer.buy[key].Owner, 
                                "Destination": offer.buy[key].Destination, 
                                "Expiration": offer.buy[key].Expiration
                            }
                        }
                    })
                })

                if (!currentOffers.length) {
                    noBuyOffers(i);
                } else {

                    currentOffers2 = currentOffers.map(v => ({...v, "index": null}))

                    const iterator = currentOffers2.keys();

                    for (const key2 of iterator) {
                        //console.log(key2);
                        currentOffers2[key2].index = key2
                    }

                    //console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

                    //console.log(currentOffers2.length);
                    lastIndexObj = (currentOffers2.length - 1);
                    //console.log(lastIndexObj);

                    currentIndex = 0;

                    getBuyPrice();
                    getNextIndexState();
                    getPrevIndexState();

                    //console.log(indexNextState);
                    //console.log(indexPrevState);
                    //console.log(typeof(indexNextState));
                    //console.log(typeof(indexPrevState));

                    const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prevBuy')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            //.setDisabled(Boolean(indexPrevState)),
                            .setDisabled(indexPrevState),
                        new ButtonBuilder()
                            .setLabel('More Info')
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
                        new ButtonBuilder()
                            .setCustomId('nextBuy')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(indexNextState),
                    );                

                    const editBuyEmbed = new EmbedBuilder()
                        .setColor('DarkRed')
                        .setTitle(`Welcome to The Terminal`)
                        //.setAuthor({ name: client.user.username })
                        .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
                        .setThumbnail(client.user.avatarURL())
                        .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
                        .setImage(`https://nftoken.id/images/?id=${currentOffers2[currentIndex].NFTokenID}`)
                        .setTimestamp()
                        //.setFooter({ text: `${address}` });
        
                    i.update({ embeds: [editBuyEmbed], components: [row], ephemeral: true });
                    //collector.stop('Collector stopped manually');
                }
            }
         })
    };

    async function getBuyPrice() {
        rawAmount = currentOffers2.at(currentIndex).Amount;
        //console.log(rawAmount);
        amount = (Number(rawAmount))/1000000;
        //console.log(amount);
    }

    async function getNextIndexState() {
        if (lastIndexObj === currentIndex) {
            //console.log(true)
            indexNextState = true; //disables Next button          
        } else {
            //console.log(false)
            indexNextState = false; //enables Next button
        }
    }

    async function getPrevIndexState() {
        if (currentIndex === 0) {
            //console.log(true)
            indexPrevState = true; //disables Previous button          
        } else {
            //console.log(false)
            indexPrevState = false; //enables Previous button
        }
    }

    async function nextBuyOffer(i) {
        //console.log(currentIndex);
        //console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

        getBuyPrice();
        getNextIndexState();
        getPrevIndexState();

        //console.log(lastIndexObj)
        //console.log(typeof(lastIndexObj))
        //console.log(currentIndex)
        //console.log(typeof(currentIndex))

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevBuy')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(indexPrevState),
            new ButtonBuilder()
                .setLabel('More Info')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
            new ButtonBuilder()
                .setCustomId('nextBuy')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(indexNextState),
        );                

        const editBuyEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
            .setThumbnail(client.user.avatarURL())
            .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            .setImage(`https://nftoken.id/images/?id=${currentOffers2[currentIndex].NFTokenID}`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });

        i.update({ embeds: [editBuyEmbed], components: [row], ephemeral: true });
    }

    async function prevBuyOffer(i) {
        //console.log(currentIndex);
        //console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

        getBuyPrice();
        getIndexState();

        //console.log(lastIndexObj)
        //console.log(typeof(lastIndexObj))
        //console.log(currentIndex)
        //console.log(typeof(currentIndex))

        //console.log(disable);    

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevBuy')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(indexPrevState),
            new ButtonBuilder()
                .setLabel('More Info')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
            new ButtonBuilder()
                .setCustomId('nextBuy')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(indexNextState),
        );                

        const editBuyEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
            .setThumbnail(client.user.avatarURL())
            .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            .setImage(`https://nftoken.id/images/?id=${currentOffers2[currentIndex].NFTokenID}`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });

        i.update({ embeds: [editBuyEmbed], components: [row], ephemeral: true });
    }

    async function noBuyOffers(i) {

        const editNoBuyOffersEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address currently has ZERO BUY offers.  Shutting down in 10 seconds...`)
            .setThumbnail(client.user.avatarURL())
            //.addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            //.setImage(`https://nftoken.id/images/?id=${currentOffers2[currentIndex].NFTokenID}`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });

        i.update({ embeds: [editNoBuyOffersEmbed], ephemeral: true });
        await sleep(10000); // wait 5 seconds
        collector.stop('Collector stopped due to no BUY orders.');
    }  
    
    }
}
};