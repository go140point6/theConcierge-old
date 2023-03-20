// Stand-alone script to update the existing DB of tokens
// node updateDB.js
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('../data/data.db', {verbose: console.log });

/*
const stmt = db.prepare(`
    INSERT INTO xrplTokens (${id}, @currency, @issuer, @name, @logo_file)
    WHERE NOT EXISTS (SELECT 1 FROM xrplTokens WHERE currency = @currency AND issuer = @issuer)
    `);
//const stmt = db.prepare(`SELECT * FROM xrplTokens`);
//const info = stmt.get('508');
const info = stmt.all();

console.log(info);
*/

/*
let id = null;

const stmt = db.prepare(`
    SELECT 1 FROM xrplTokens WHERE currency = @currency AND issuer = @issuer
`)

const info = stmt.get({
    currency: 'JOJO4',
    issuer: 'ryanTAPPFAKA1234cW12Vx97riBu91MDPi'
})

console.log(info);

/*
const stmt2 = db.prepare(`
    INSERT INTO xrplTokens (id, currency, issuer, name, logo_file)
    VALUES (${id}, @currency, @issuer, @name, @logo_file)
    `);

const stmt2 = db.prepare(`
    INSERT INTO xrplTokens(${id}, @currency, @issuer, @name, @logo_file)
    SELECT 508, 'JOJO3', 'ryanTAPPWAKA1234cW12Vx97riBu91MDPi',  
    
    `)

const info2 = stmt2.run({
    currency: 'JOJO4',
    issuer: 'ryanTAPPFAKA1234cW12Vx97riBu91MDPi',
    name: null,
    logo_file: null
});

console.log(info2.changes);
console.log(info2.lastInsertRowid);
*/

async function updateTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {

        let id = null

        const sqlCheck = db.prepare(`
            SELECT 1 FROM xrplTokens WHERE currency = @currency AND issuer = @issuer
        `)

        const sqlUpdate = db.prepare(`
            INSERT INTO xrplTokens (id, currency, issuer, name, logo_file)
            VALUES (${id}, @currency, @issuer, @name, @logo_file)
        `)

        //console.log(res.data.tokens)

        for (const token of res.data.tokens) {
            const info = sqlCheck.get({
                currency: token.currency,
                issuer: token.issuer
            })

            if (info == null) {
                console.log('Adding this pair...')
                if (token.name == null) {
                    token.name = null;
                }
                if (token.logo_file == null) {
                    token.logo_file = null;
                }
                const info2 = sqlUpdate.run(token)
                console.log(info2.lastInsertRowid)
            } else {
                console.log('This pair exists')
            }
            //console.log(info)
        }
        
    })
}

async function grabTokens() {
    await updateTokens();
    console.log('done');
}

grabTokens();

/*
async function updateTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data.tokens);
        let id = null;

        const insertXrpl = db.prepare(`
            INSERT INTO xrplTokens (id, currency, issuer, name, logo_file)
            VALUES (${id}, @currency, @issuer, @name, @logo_file)
            `);

        const insertManyXrpl = db.transaction((tokens) => {
            for (const token of tokens) {
                // undefined == null is true (equality operator) so both are true
                // undefined === null is false (strict equality operator)
                if (token.name == null) {
                    token.name = null;
                }
                if (token.logo_file == null) {
                    token.logo_file = null;
                }
            insertXrpl.run(token)
            //console.log(token.name);
            //console.log(token.logo_file);
            }
            
        });

        insertManyXrpl(res.data.tokens);
    });
};
*/

/*
async function getCrypto() {
    await axios.get(`https://api.coingecko.com/api/v3/coins/list?include_platform=false`).then(res => {
        //console.log(res.data);
        const insertCrypto = db.prepare(`INSERT INTO crypto (id, symbol, name) VALUES (@id, @symbol, @name)`);

        const insertManyCrypto = db.transaction((cryptos) => {
            for (const crypto of cryptos) {
                insertCrypto.run(crypto)
            }
            
        });

        insertManyCrypto(res.data);
    });
};
*/

/*
async function grabTokens() {
    await updateTokens();
    //const stmt = db.prepare("SELECT * FROM xrplTokens");
    var results = stmt.all();
    console.log(results);
    //await getCrypto();
    //const stmt2 = db.prepare("SELECT * FROM crypto");
    //var results2 = stmt2.all();
    //console.log(results2);
}

grabTokens();
*/