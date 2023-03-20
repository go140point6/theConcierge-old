// Stand-alone script to create the initial DB of tokens
// node createDB.js
const axios = require('axios');
const Database = require('better-sqlite3');

const db = new Database('../data/data.db', {verbose: console.log });

var tableXrpl = "xrplTokens";
var tableCrypto = "crypto"
var fieldsXrpl = "(id INTEGER PRIMARY KEY AUTOINCREMENT, currency TEXT, issuer TEXT, name TEXT, logo_file TEXT)";
var fieldsCrypto = "(id TEXT PRIMARY KEY, symbol TEXT, name TEXT)";
var sqlXrpl = `CREATE TABLE IF NOT EXISTS ${tableXrpl} ${fieldsXrpl}`;
var sqlCrypto = `CREATE TABLE IF NOT EXISTS ${tableCrypto} ${fieldsCrypto}`;
const createTableXrpl = db.prepare(sqlXrpl);
const createTableCrypto = db.prepare(sqlCrypto);
createTableXrpl.run();
createTableCrypto.run();

async function getTokens() {
    await axios.get(`https://api.onthedex.live/public/v1/aggregator`).then(res => {
        //console.log(res.data.tokens);
        let id = null;
        const insertXrpl = db.prepare(`INSERT INTO xrplTokens (id, currency, issuer, name, logo_file) VALUES (${id}, @currency, @issuer, @name, @logo_file)`);

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

async function initialDB() {
    await getTokens();
    const stmt = db.prepare("SELECT * FROM xrplTokens");
    var results = stmt.all();
    console.log(results);
    await getCrypto();
    const stmt2 = db.prepare("SELECT * FROM crypto");
    var results2 = stmt2.all();
    console.log(results2);
}

initialDB();
