const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Database = require('better-sqlite3');
const client = require('../index');

const db = new Database('./data/data.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto-price')
        .setDescription('Coin Gecko reported price in USD')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker symbol of cryptocurrency to lookup i.e. XRP.")
                .setRequired(true)
        ),
        async execute(interaction) {
            await interaction.deferReply();
    
            const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
            const stmt5 = db.prepare('SELECT id, symbol FROM crypto WHERE symbol = ? COLLATE NOCASE');
            var results5 = stmt5.all(ticker);
    
            console.log("Number in array for " + ticker + " is " + results5.length);
    
            var num = 0;
            var embedFields = [];
            if (results5.length >= 1) {
                try { 
                while (num < results5.length) {
                    var id = results5[num].id;
                    console.log(id)                    
                    await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`).then(res => {
                        if(res.data) {
                            var name = res.data.name;
                            if (res.data.market_data.current_price.usd !== undefined) {
                                var price = (res.data.market_data.current_price.usd).toString();
                                embedFields.push({ name: name, value: price });
                                } 
                            }
                        }).catch(err => {
                            interaction.editReply({ content: `Some error with api call, please try again or ping my overseer.`});
                        });
                        num++;
                    }
    
                    const embedToken = new EmbedBuilder()
                        .setColor('DarkGreen')
                        .setTitle(`Welcome to The Terminal`)
                        //.setAuthor({ name: client.user.username })
                        .setDescription(`The query results for ${ticker}:`)
                        .setThumbnail(client.user.avatarURL())
                        .addFields(embedFields)
                        //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                        .setTimestamp()
                        .setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });
    
                        interaction.editReply({ embeds: [embedToken]});
                } catch(err) {
                    console.error(err);
                    interaction.editReply({ content: `Some error building embed, please try again or ping my overseer.`});
                    }
            } else {
                interaction.editReply({ content: `Sorry, ${ticker} is unknown to me, please ask my overseer to update the database.` });
            }
        }
    };