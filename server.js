const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const si = require('systeminformation');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Funtion to collect system stats
async function getStats() {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const temp = await si.cpuTemperature();
    const time = si.time();
    const network = await si.networkStats();

    return {
        cpu: cpu.currentLoad.toFixed(1),
        ram: ((mem.active / mem.total) * 100).toFixed(1),
        temp: temp.main,
        uptime: Math.floor(time.uptime / 3600) + "h " + Math.floor((time.uptime % 3600) / 60) + "m",
        netDown: (network[0].rx_sec / 1024).toFixed(2), // KB/s
        netUp: (network[0].tx_sec / 1024).toFixed(2)    // KB/s
    };
}

// Sending every 2 seconds
setInterval(async () => {
    if (io.engine.clientsCount > 0) { // Check if there are connected clients 
        const stats = await getStats();
        io.emit('stats', stats);
    }
}, 2000);

server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});