const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/perf', {useNewUrlParser: true});
const Client = require('./Models/Client');

function socketMain(io, socket) {
    let macAddress;
    console.log('Socket connected: ' + socket.id);
    // Check auth - who is connected - React UI or Node Client Machine
    socket.on('client-auth', (token) => {
        if(token === 'node-client') {
            // A node client is connected
            socket.join('clients');
        } else if(token === 'ui-client') {
            console.log('ui-client');
            // A react client is connected
            socket.join('ui');
        } else {
            // Not an authorized client, disconnect.
            socket.disconnect(true);
        }
    });

    // A new machine has connected, check if the machine exists in the Mongo DB
    socket.on('init-perf', async (data) => {
        macAddress = data.macAddress;
        // Check Mongo DB
        const hasRecord = await firstOrAdd(data);
        console.log(hasRecord);
    })

    socket.on('perf', (data) => {
        console.log('Tick');
        io.to('ui').emit('data', data);
    });
}

// Check if the record exists, else add a record
function firstOrAdd(data) {
    // Promise based
    return new Promise((resolve, reject) => {
        Client.findOne(
            {macAddress: data.macAddress},
            (err, doc) => {
                if(err) {
                    console.log(err);
                    reject(err);
                    throw err;
                } else if(doc === null) {
                    // Add a new record
                    let nClient = new Client(data);
                    nClient.save();
                    resolve('Added');
                } else {
                    // Record found
                    console.log('Found.');
                    resolve('Found');
                }
            }
        )
    })
}

module.exports = socketMain;
