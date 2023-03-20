const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const XRP = require('../events/onReady');
const axios = require('axios');
const Database = require('better-sqlite3');
const client = require('../index');

const db = new Database('./data/data.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xrpl-token')
        .setDescription('Last trade in USD')
        .addStringOption((option) =>
            option
                .setName("ticker")
                .setDescription("Common ticker (currency) of XRPL Token to lookup i.e. CLUB.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const ticker = (interaction.options.getString("ticker", true)).toUpperCase();
        const stmt5 = db.prepare('SELECT currency, issuer, name, logo_file FROM xrplTokens WHERE currency = ? COLLATE NOCASE');
        const stmt6 = db.prepare('SELECT COUNT(*) id FROM xrplTokens');
        var results5 = stmt5.all(ticker);
        var results6 = stmt6.get();

        console.log("Current XRP price is $" + XRP.currentXRP);
        console.log("Number in array for " + ticker + " is " + results5.length);
        console.log("Count is: " + results6.id);

        let num = 0;
        let embedFields = [];
        if (results5.length >= 1) {
            try {
            while (num < results5.length) {
                var currency = results5[num].currency;
                var issuer = results5[num].issuer;
                var name = results5[num].name;
                if (name == null) {
                    name = currency;
                }
                await axios.get(`https://api.onthedex.live/public/v1/ticker/${currency}.${issuer}:XRP`).then(res => {
                    if(res.data && res.data.pairs[0].last) {
                        let inXRP = res.data.pairs[0].last;
                        let inUSD = (inXRP * XRP.currentXRP).toFixed(6);
                        embedFields.push({ name: name, value: inUSD });
                        }
                    }).catch(err => {
                        interaction.editReply({ content: `Some error with api call, please try again or ping my overseer.`});
                    });
                    num++;
                }

                const embedToken = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle(`Welcome to The Terminal`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`The query results for ${currency}:`)
                    .setThumbnail(client.user.avatarURL())
                    .addFields(embedFields)
                    //.setImage('https://onxrp-marketplace.s3.us-east-2.amazonaws.com/nft-images/00081AF4B6C6354AE81B765895498071D5E681DB44D3DE8F1589271700000598-32c83d6e902f8.png')
                    .setTimestamp()
                    .setFooter({ text: 'Powered by OnTheDex.Live', iconURL: 'https://images2.imgbox.com/bb/cc/OJPcux6J_o.jpg' });

                    interaction.editReply({ embeds: [embedToken]});
            } catch(err) {
                console.error(err);
                interaction.editReply({ content: `Some error building embed, please try again or ping my overseer.`});
                }                    
            } else {
            interaction.editReply({ content: `I currently know of ${results6.id} tokens, but ${ticker} is unknown to me.  Please ask my overseer to update the database.` });
        }
    }
};