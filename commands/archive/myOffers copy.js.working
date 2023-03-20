const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ComponentType } = require('discord.js');
const axios = require('axios');
const client = require('../index');
const xrpl = require("xrpl");
//const { hexToString } = require('../utils/hexToString');

var offers;
var currentOffers2;
var currentIndex;
var lastIndexObj;
var rawAmount;
var amount;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myoffers')
        .setDescription('Current BUY or SELL offers for an address')
        .addStringOption((option) =>
        option
            .setName("address")
            .setDescription("The address you want to check.")
            .setRequired(true)
    ),
    async execute(interaction) {
        const address = interaction.options.getString("address", true);

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('buy')
                .setLabel('BUY')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('sell')
                .setLabel('SELL')
                .setStyle(ButtonStyle.Danger),
        );

        const initialEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`Would you like to view BUY or SELL offers?`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            .setFooter({ text: `${address}` });

    await interaction.reply({ embeds: [initialEmbed], components: [row] });
    console.log(interaction.user.id);
    
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000 });

    collector.on('collect', async i => {
        if (i.user.id === interaction.user.id && i.customId === 'buy') {
            
            console.log('Address to check: ' + address);
            //const IPFS = getIPFS();
            //console.log(IPFS) <-- Promise Pending
            buyOffers(i);

        } else if (i.user.id === interaction.user.id && i.customId === 'sell') {
          
                const editSellEmbed = new EmbedBuilder()
    
                    .setColor('DarkRed')
                    .setTitle(`Welcome to The Terminal`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`${i.user.username} clicked on ${i.customId} button`)
                    .setThumbnail(client.user.avatarURL())
                    //.addFields(embedFields)
                    //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                    .setTimestamp()
                    .setFooter({ text: `${address}` });
                
                //await i.update({ content: 'A button was clicked!', components: [] });
                i.update({ embeds: [editSellEmbed], components: [] });
                collector.stop('Collector stopped manually');    
        } else if (i.user.id === interaction.user.id && i.customId === 'nextBuy') {
            
                console.log('User hit next');
                //const IPFS = getIPFS();
                //console.log(IPFS) <-- Promise Pending
                currentIndex++
                nextBuyOffer(i);

        } else {
            i.reply({ content: `These buttons are not for you!`, ephemeral: true });
        }
    }) 

    collector.on('end', async (collected, reason) => {
        //console.log(`Collected ${collected.size} items`)
        //if (collected.size == 0) {
            //console.log(`It was zero`);
            await interaction.editReply({ components: [] });
            const shutdownEmbed = new EmbedBuilder()

            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`Time is up, systems shutting down`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(embedFields)
            //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
            .setTimestamp()
            //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
        
            await interaction.editReply({ embeds: [shutdownEmbed], components: [] });
        //} else {
        //    console.log((`Collected ${collected.size} items`));
        //}
    });

    async function getIPFS() {
        const client = new xrpl.Client('wss://xrplcluster.com');
        await client.connect();
    }

    /*
    async function getIPFS() {
        let URI;
        const convert = (from, to) => str => Buffer.from(str, from).toString(to)
        const hexToUtf8 = convert('hex', 'utf8')

        //await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
        //await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/nft/00081388C182B4F213B82CCFA4C6F59AD76F0AFCFBDF04D59E152903000004A8`).then(res => { // xShroom
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/nft/000819648C08F42352F2CDD48D66CB6639E56C79CE0A4D619E6EED4D0000004A`).then(res => { // XLION
        //await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/nft/000817024EC543906E622D5E959A014444D88DCB64EEDC4395965FA600000214`).then(res => { // Bearable Bull
        //await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/nft/000A1388DBB936CAD420E20BBA95A46AB6EC7921C3F162CA5C4185C400000329`).then(res => { // Combat Kanga
            if(res.data) {
                 URI = res.data.data.nft.URI;
                console.log(URI);
            }
        })

        const getString = hexToUtf8(URI)
        console.log(getString);

        

        //const getString = hexToUtf8()
    }
    */

    async function nextBuyOffer(i) {
        console.log(currentIndex);
        console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

        getPrice();

        console.log(lastIndexObj)
        console.log(typeof(lastIndexObj))
        console.log(currentIndex)
        console.log(typeof(currentIndex))

        if (lastIndexObj === currentIndex) {
            console.log(true)
        } else {
            console.log(false)
        }

        //console.log(disable);    

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prevBuy')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
            new ButtonBuilder()
                .setLabel('More Info')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
            new ButtonBuilder()
                .setCustomId('nextBuy')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
        );                

        const editBuyEmbed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(`Welcome to The Terminal`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
            .setThumbnail(client.user.avatarURL())
            /*
            .addFields(
                { name: `Showing offer ${currentOffers[1].NFTokenID}`, value: amount.toString(), inline: true },
                { name: '1', value: '1', inline: true },
                { name: '2', value: '2', inline: true },
            )
            */
            .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
            //.addFields({ name: `1`, value: '1', inline: false })
            //.addFields({ name: `2`, value: '2', inline: false })
            .setImage(`https://marketplace-api.onxrp.com/api/image/${currentOffers2[currentIndex].NFTokenID}?thumbnail=true`)
            .setTimestamp()
            //.setFooter({ text: `${address}` });
            //.setFooter({ text: "\u3000".repeat(100) });

        //await i.update({ content: 'A button was clicked!', components: [] });
        i.update({ embeds: [editBuyEmbed], components: [row] });
    }

    async function getPrice() {
        rawAmount = currentOffers2.at(currentIndex).Amount;
        console.log(rawAmount);
        amount = (Number(rawAmount))/1000000;
        console.log(amount);
    }

    async function buyOffers(i) {
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
            if(res.data) {
                //console.log(res.data.data.offers)
                console.log(res.data.data.offers.length)

                offers = res.data.data.offers;
                let currentOffers = [];
                //let count = 0;

                /*
                offers.forEach(offer => {
                    if (Object.keys(offer.buy).length !== 0) {
                        console.log(offer.buy[1])
                    }
                })
                */

                offers.forEach(offer => {
                    //console.log(offer.buy[0])

                    Object.entries(offer.buy).forEach(([key, val]) => {
                        //console.log(`${key} ${val}`)
                        //console.log(val)
                        //console.log(key)
                        //console.log(offer.buy[key])
                        //console.log(offer.buy[key].NFTokenID)
                        //console.log(key)
                        //console.log(offer.buy[key].Amount)
                        
                        const findNFTIndex = currentOffers.findIndex(
                            (nftid) => nftid.NFTokenID === offer.buy[key].NFTokenID
                        )


                        //console.log(offer.buy[key].NFTokenID)
                        //console.log(findNFTIndex)

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
                        //currentOffers.push({ "id": offer.buy[key].NFTokenID, "offerNo": key, "amount": offer.buy[key].Amount })
                        //currentOffers.push({ "id": offer.buy[key].NFTokenID, "amount": offer.buy[key].Amount })
                        //console.log(currentOffers.length)
                        //console.log(currentOffers)
                    })
                })

                currentOffers2 = currentOffers.map(v => ({...v, "index": null}))

                //console.log(currentOffers2);

                const iterator = currentOffers2.keys();

                for (const key2 of iterator) {
                    console.log(key2);
                    currentOffers2[key2].index = key2
                }

                //console.log(currentOffers2);

                /*
                const iterator = currentOffers2.keys();

                for (const key2 of iterator) {
                    console.log(key2);
                }
                */

                console.log(`There are ${currentOffers.length} BUY offers when including only the highest offer on an NFT`);
                console.log(`There are ${currentOffers2.length} BUY offers when including only the highest offer on an NFT`);

                //const currentOffers2 = currentOffers;

                //currentOffers.forEach(function (value, i) {
                    //console.log(i);
                    
                //});

                //console.log(currentOffers.slice(0,5))

                //let embedFields = [];

                /*
                currentOffers.slice(0,3).forEach(offer => {
                    let rawAmount = (offer.Amount);
                    let amount = (Number(rawAmount))/1000000;

                    embedFields.push({ name: offer.NFTokenID, value: amount.toString(), inline: true })
                })
                */

                /*
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('one')
                        .setLabel('One')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('two')
                        .setLabel('Two')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('three')
                        .setLabel('Three')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Secondary)
                );
                */

                console.log(currentOffers2.length);
                lastIndexObj = (currentOffers2.length - 1);
                console.log(lastIndexObj);

                currentIndex = 0;

                getPrice();

                /*
                while (indexArray < currentOffers.length) {
                    let rawAmount = currentOffers.at(indexArray);
                    let amount = (Number(rawAmount))/1000000;

                    embedFields.push({ name: `Showing offer ${indexArray}` , value: amount.toString(), inline: true })
                    indexArray++
                }
                */

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prevBuy')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setLabel('More Info')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://nftoken.id/?${currentOffers2[currentIndex].NFTokenID}`),
                    new ButtonBuilder()
                        .setCustomId('nextBuy')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(false),
                );                

                const editBuyEmbed = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle(`Welcome to The Terminal`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`This address has ${currentOffers2.length} BUY offers, counting ONLY the highest bids.`)
                    .setThumbnail(client.user.avatarURL())
                    /*
                    .addFields(
                        { name: `Showing offer ${currentOffers[1].NFTokenID}`, value: amount.toString(), inline: true },
                        { name: '1', value: '1', inline: true },
                        { name: '2', value: '2', inline: true },
                    )
                    */
                    .addFields({ name: `The highest offer for this NFT:`, value: `${amount.toString()} XRP`, inline: false })
                    //.addFields({ name: `1`, value: '1', inline: false })
                    //.addFields({ name: `2`, value: '2', inline: false })
                    .setImage(`https://marketplace-api.onxrp.com/api/image/${currentOffers2[currentIndex].NFTokenID}?thumbnail=true`)
                    .setTimestamp()
                    //.setFooter({ text: `${address}` });
                    //.setFooter({ text: "\u3000".repeat(100) });
        
                //await i.update({ content: 'A button was clicked!', components: [] });
                i.update({ embeds: [editBuyEmbed], components: [row] });
                //collector.stop('Collector stopped manually');

                /*
                let offers = res.data.data.offers;
                let embedFields = [];
    
                offers.forEach(offer => {
                 if (Object.keys(offer.buy).length !== 0) {
                     let rawAmount = (offer.buy[0].Amount)
                     let amount = (Number(rawAmount))/1000000;
    
                     embedFields.push({ name: offer.buy[0].NFTokenID, value: amount.toString()})
                    }
                })
    
            const editBuyEmbed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle(`Welcome to The Terminal`)
                //.setAuthor({ name: client.user.username })
                .setDescription(`Current BUY offers for ${address}`)
                .setThumbnail(client.user.avatarURL())
                .addFields(embedFields)
                //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                .setTimestamp()
                //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });
        
            //await i.update({ content: 'A button was clicked!', components: [] });
            i.update({ embeds: [editBuyEmbed], components: [] });
            collector.stop('Collector stopped manually');
            */
            }
        })
    };

    }
};