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
            // Send information on all connected clients to the front-end
            Client.find({}, (err, docs) => {
                docs.forEach((client) => {
                    // On load, assume that machines are offline
                    client.isActive = false;
                    io.to('ui').emit('data', client);
                })
            })
        } else {
            // Not an authorized client, disconnect.
            socket.disconnect(true);
        }
    });

    // If client disconnects, make isActive = false and emit it
    socket.on('disconnect', () => {
        // Find the client with this mac-address
        Client.find({macAddress: macAddress}, (err, docs) => {
            if(docs.length > 0) {
                docs[0].isActive = false;
                io.to('ui').emit('data', docs[0]);
            }
        })
    })

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
