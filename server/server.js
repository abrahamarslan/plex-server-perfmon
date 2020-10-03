const express = require('express');
const cluster = require('cluster'); // https://nodejs.org/api/cluster.html
const net = require('net');
const socketIO = require('socket.io');
const helmet = require('helmet');
const socketMain = require('./socket-main');
const port = 8181;
const numProcesses = require('os').cpus().length; // Get the number of processes
const redisIO = require('socket.io-redis');
const farmHash = require('farmhash');

// Run a main worker which will control all the worker threads
// All worker threads will be stored on the basis of their connected IPs (for the purpose of re-connection)

if(cluster.isMaster) {
    let workers = [];
    // Spawn workers at index of i
    let spawn = function (i) {
        workers[i] = cluster.fork();
        // Restart worker on exit
        workers[i].on('exit', function (code, signal) {
            spawn([i]);
        });
    };
    // Spawn worker threads
    for (let i=0; i < numProcesses; i++) {
        spawn(i);
    }

    // Get the worker based on IP address of the connected client.
    // Using Farmhash - to convert and IP address to numeric compressed format
    const workerIndex = function (ip, length) {
        return farmHash.fingerprint32(ip) % length; // % len to compress IP to the number of slots we have of workers works with IPV6 too
    }

    // For workers, we need an independent open TCP port, so we'll use NET module, instead of HTTP (which uses default port)
    const server = net.createServer({pauseOnConnect: true}, (connection) => {
       // A connection is received.
       // Pass it to the appropriate worker thread
       // Get the worker based on the source IP address
       let worker = workers[workerIndex(connection.remoteAddress, numProcesses)];
       if (worker) {
           worker.send('sticky-session:connection', connection);
       }
    });
    // Start listening on the port (All child threads can share the same port with Cluster module)
    server.listen(port);
    console.log(`Master listening on port ${port}`);
} else {
    let app = express();
    app.use(helmet());

    // Workers only communicate with the master, not directly to the client, so we do not use port on for them
    const server = app.listen(0, 'localhost');
    const io = socketIO(server);

    // Use the Redis adapter. Default (localhost: 6379).
    io.adapter(redisIO({host: 'localhost', port: 6379}));

    // Todo: Use auth middleware here

    io.on('connection', (socket) => {
        socketMain(io, socket);
        console.log(`Connected to worker: ${cluster.worker.id}`);
    });



    // Listen to all the messages sent from the master. Ignore all others.
    process.on('message', function (message, connection) {
        if(message !== 'sticky-session:connection') {
            return; // If it is not from the master, then do nothing
        }
        // Else emulate a connection event on the server by emitting an event with the connection that the master sent us.
        server.emit('connection', connection);
        connection.resume();
    })
}
