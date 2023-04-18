const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const client = require('../index');

const db = new Database('./data/flaremingos.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('og-rarity')
        .setDescription('Flaremingos rarity checker')
        .addStringOption((option) =>
            option
                .setName("nft-number")
                .setDescription("What NFT number do you want to check?")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply()

        const nftNumber = (interaction.options.getString("nft-number", true));
        if (nftNumber > 0 && nftNumber < 889) {

            const stmt7 = db.prepare('SELECT edition, rank, image FROM og WHERE edition = ?')
            var results7 = stmt7.all(nftNumber)
            
            //console.log(results7)

            var rank = results7[0].rank

            if (nftNumber == 141) {
                const embedFlavio = new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(`Flavio here, need anything else?`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`Hot damn, that's a good looking mingo.  Officially Flaremingo #${nftNumber} is rank ${rank} of 888 but some people just can't appreciate quality.`)
                    .setThumbnail(client.user.avatarURL())
                    //.addFields(
                    //    { name: 'Your share (wFLR):', value: `${myFlrShare}`},
                    //    { name: 'Your share (USD):', value: `${myUsdShare}`},
                    //)
                    .setImage(`https://ipfs.io/ipfs/QmTaY5MS9trVXjFywtxW4D927KDY5r2GWthvdnwE2u1TQ8/${nftNumber}.png`)
                    .setTimestamp()
                    //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

                interaction.editReply({ embeds: [embedFlavio] });
            } else {
                const embedRarity = new EmbedBuilder()
                    .setColor('LuminousVividPink')
                    .setTitle(`Flavio here, need anything else?`)
                    //.setAuthor({ name: client.user.username })
                    .setDescription(`Flaremingo #${nftNumber} is rank ${rank} of 888!`)
                    .setThumbnail(client.user.avatarURL())
                    //.addFields(
                    //    { name: 'Your share (wFLR):', value: `${myFlrShare}`},
                    //    { name: 'Your share (USD):', value: `${myUsdShare}`},
                    //)
                    .setImage(`https://ipfs.io/ipfs/QmTaY5MS9trVXjFywtxW4D927KDY5r2GWthvdnwE2u1TQ8/${nftNumber}.png`)
                    .setTimestamp()
                    //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

                interaction.editReply({ embeds: [embedRarity] });
            }
        } else {
            const embedSport = new EmbedBuilder()
            .setColor('LuminousVividPink')
            .setTitle(`Flavio here, need anything else?`)
            //.setAuthor({ name: client.user.username })
            .setDescription(`There are only 888 Flaremingo, Sport... try a number between 1 and 888.`)
            .setThumbnail(client.user.avatarURL())
            //.addFields(
            //    { name: 'Your share (wFLR):', value: `${myFlrShare}`},
            //    { name: 'Your share (USD):', value: `${myUsdShare}`},
            //)
            //.setImage(`https://ipfs.io/ipfs/QmTaY5MS9trVXjFywtxW4D927KDY5r2GWthvdnwE2u1TQ8/${nftNumber}.png`)
            .setTimestamp()
            //.setFooter({ text: 'Powered by CoinGecko', iconURL: 'https://images2.imgbox.com/5f/85/MaZQ6yi0_o.png' });

        interaction.editReply({ embeds: [embedSport] });
        }
    }
};