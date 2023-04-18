const Web3 = require('web3');
const url = 'wss://rpc.viri.uk/ws';
const web3 = new Web3(url);

/*
var options = {
    fromBlock: 0,
    address: '0xE2432F1e376482Ec914ebBb910D3BfD8E3F3F29e',
    topics: []
};
*/

let options = {
    //filter: {
    //    value: ['1000', '1337']    //Only get events where transfer value was 1000 or 1337
    //},
    //address: '0xE2432F1e376482Ec914ebBb910D3BfD8E3F3F29e',
    //fromBlock: 5904126,                  //Number || "earliest" || "pending" || "latest"
    fromBlock: 'earliest',                  //Number || "earliest" || "pending" || "latest"
    toBlock: 'latest'
};

/*
web3.getPastEvents('Transfer', options, function(error, events) { console.log(events); })
    .then(function(events) {
        console.log(events)
    });
    //.catch(err => throw err);
*/

var subscription = web3.eth.subscribe('logs', options, function(error, result){
    if (!error) console.log('got result');
    else console.log(error);
}).on("data", function(log){
    console.log('got data', log);
}).on("changed", function(log){
    console.log('changed');
});
