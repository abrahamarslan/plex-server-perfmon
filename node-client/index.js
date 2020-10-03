const os = require ('os');
const io = require('socket.io-client');

let socket = io('http://127.0.0.1:8181');
// Listen for connection
socket.on('connect', () => {
    console.log('Node Client: Connected to socket');
    // Get all the network interfaces
    const networkInterfaces = os.networkInterfaces();
    let macAddress;
    // Loop through all the network interfaces for this machine and find the non-internal one - the one which is connected to the internet
    // The one connected with the internet will have internal === false
    for(let key in networkInterfaces) {
        if(!networkInterfaces[key][0].internal) {
            macAddress = networkInterfaces[key][0].mac;
            break;
        }
    }

    // Init perf data the first time
    perf().then((data) => {
        // Add mac address to the performance data
        data.macAddress = macAddress;
        socket.emit('init-perf', data);
    });

    // An auth token for node-client
    socket.emit('client-auth', 'node-client');
    // Send the perf-data every second
    let perfData = setInterval(() => {
        perf().then((data) => {
            data.macAddress = macAddress;
            socket.emit('perf', data);
        });
    }, 1000);

    // When the client disconnects, clear the interval
    socket.on('disconnect', () => {
        clearInterval(perfData);
    });
});

function perf() {
    return new Promise(async (resolve, reject) => {

        // Assume this client is active
        const isActive = true;
        // Get OS type
        const osType = os.type();
        // Get the up-time
        const osUptime = os.uptime();
        // Get Memory
            // Free Memory
        const freeMemory = os.freemem();
            // Total Memory
        const totalMemory = os.totalmem();
            // Used memory = total memory - free memory
        const usedMemory = totalMemory - freeMemory;
            // Memory usage in percentage
        const memoryUsage = Math.floor(usedMemory / totalMemory * 100) / 100;
        // Get CPUs
        const cpus = os.cpus();
            // Get number of cores
        const cpuCores = cpus.length;
            // Get the CPU Model
        const cpuModel = cpus[0].model;
        // Get the CPU clock speed
        const cpuClockSpeed = cpus[0].speed;
        // Get CPU load
        const cpuLoad = await getCPULoad();

        resolve({
           osType,
           freeMemory,
           totalMemory,
           usedMemory,
           memoryUsage,
           cpus,
           cpuCores,
           cpuModel,
           cpuClockSpeed,
           cpuLoad,
           osUptime,
           isActive
        });
    });
}

function getCPULoadAverage() {
    // Get current data
    const cpus = os.cpus();
    // To get the CPU load average, get average of all cores.
    let idleTime = 0;
    let totalTime = 0;
    cpus.forEach((core) => {
       for(let type in core.times) {
           totalTime += core.times[type];
       }
       idleTime += core.times.idle;
    });
    return {
        idle: idleTime / cpus.length,
        total: totalTime / cpus.length
    };
}

function getCPULoad() {
    return new Promise((resolve, reject) => {
        const start = getCPULoadAverage();
        setTimeout(() => {
            const end = getCPULoadAverage();
            const idleTimeDifference = end.idle - start.idle;
            const totalTimeDifference = end.total - start.total;
            const percentageCPULoad = 100 - Math.floor(100 * idleTimeDifference / totalTimeDifference);
            resolve(percentageCPULoad);
        }, 100); // Every 100 ms
    });
}

// perf().then((data) => {
//     console.log(data);
// })


