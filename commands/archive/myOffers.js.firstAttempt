const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonStyle } = require('discord.js');
const XRP = require('../events/onReady');
const axios = require('axios');
const Database = require('better-sqlite3');
const client = require('../index');

//const db = new Database('./data/data.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('offers')
        .setDescription('Current offers for NFT owned by a particular address')
        .addStringOption((option) =>
            option
                .setName("address")
                .setDescription("The address you want to check.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const address = interaction.options.getString("address", true);
        console.log('Address to check: ' + address);
        try {
        await axios.get(`https://api.xrpldata.com/api/v1/xls20-nfts/offers/nftowner/${address}`).then(res => {
            if(res.data) {
                //console.log(res.data.data.offers);
                /*
                let offers = res.data.data.offers;
                offers.forEach(function(offer) {
                    console.log(offer.buy);
                })
                
               let offers = res.data.data.offers;
               let results = [];
               offers.forEach(offer => {
                if (Object.keys(offer.buy).length !== 0) {
                    results.push(offer.buy);
                }
               });
               console.log(results);
               */
               
               let offers = res.data.data.offers;
               let embedFields = [];

               offers.forEach(offer => {
                if (Object.keys(offer.buy).length !== 0) {
                    //console.log(offer.buy.NFTokenID)
                    //console.log(offer.buy.Amount)
                    console.log(offer.buy[0].Amount);
                    let rawAmount = (offer.buy[0].Amount)
                    let amount = (Number(rawAmount))/1000000;
                    console.log(typeof amount);
                    console.log(amount);
                    //console.log(typeof Number(amount));
                    //console.log(rawAmount / 1000000);
                    //let amount = (Number(rawAmount) / 1000000)


                    
                    //console.log(offer);
                    embedFields.push({ name: offer.buy[0].NFTokenID, value: amount.toString()})
                }
               })

               const embedOffers = new EmbedBuilder()
               .setColor('DarkRed')
               .setTitle(`Welcome to The Terminal`)
               //.setAuthor({ name: client.user.username })
               .setDescription(`The current BUY offers for ${address}:`)
               .setThumbnail(client.user.avatarURL())
               .addFields(embedFields)
               //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
               .setTimestamp()
               //.setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });

               interaction.editReply({ embeds: [embedOffers]});
            } 
         })
    } catch(err) {
        console.error(err);
        interaction.editReply({ content: `Some error building embed, please try again or ping my overseer.`});
        }
    }
};