// Stand-alone script to create the rarity DB and tables for Flaremingos
// node createDB.js
const fs = require('fs');
const Database = require('better-sqlite3');
const { parse } = require('csv-parse');

const db = new Database('../data/flaremingos.db', {verbose: console.log });

var tableOG = "og"
var tableFrens = "frens"
var fields = "(edition INTEGER PRIMARY KEY, rank INTEGER, image TEXT)"
var sqlOG = `CREATE TABLE IF NOT EXISTS ${tableOG} ${fields}`
var sqlFrens = `CREATE TABLE IF NOT EXISTS ${tableFrens} ${fields}`

const createTableOG = db.prepare(sqlOG);
const createTableFrens = db.prepare(sqlFrens);

createTableOG.run();
createTableFrens.run();

async function insertOGs() {
    const insertOG = db.prepare(`INSERT INTO og (edition, rank, image) VALUES (?, ?, ?)`);
    fs.createReadStream("../data/mingos-og.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        insertOG.run([row[1]], [row[2]], [row[0]])
        //console.log(row)
        //console.log([row[0]])
        //console.log([row[1]])
        //console.log([row[2]])
    })
}

async function insertFrens() {
    const insertFren = db.prepare(`INSERT INTO frens (edition, rank, image) VALUES (?, ?, ?)`);
    fs.createReadStream("../data/mingos-frens.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        insertFren.run([row[1]], [row[2]], [row[0]])
        //console.log(row)
        //console.log([row[0]])
        //console.log([row[1]])
        //console.log([row[2]])
    })
}

async function initialDB() {
    await insertOGs();
    await insertFrens();
    await checkWork();
}

async function checkWork() {
    const stmt = db.prepare("SELECT * FROM og");
    var results = stmt.all();
    console.log(results);
    const stmt2 = db.prepare("SELECT * FROM frens");
    var results2 = stmt2.all();
    console.log(results2);
}

initialDB();