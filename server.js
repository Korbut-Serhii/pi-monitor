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
    const [cpu, cpuFlags, mem, temp, time, net, os, fs] = await Promise.all([
        si.currentLoad(),
        si.cpu(),
        si.mem(),
        si.cpuTemperature(),
        si.time(),
        si.networkStats(),
        si.osInfo(),
        si.fsSize()
    ]);

    // Get top 3 processes by CPU usage
    const processes = await si.processes();
    const topProcs = processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 3)
        .map(p => ({ name: p.name, cpu: p.cpu.toFixed(1) }));

    return {
        // CPU
        cpuLoad: cpu.currentLoad.toFixed(1),
        cpuCores: cpu.cpus.map(c => c.load.toFixed(1)), // Load per core
        cpuSpeed: cpuFlags.speed, // Frequency in GHz
        temp: temp.main,
        
        // RAM
        ramPct: ((mem.active / mem.total) * 100).toFixed(1),
        swapPct: ((mem.swapused / mem.swaptotal) * 100 || 0).toFixed(1),
        
        // Uptime
        uptime: Math.floor(time.uptime / 3600) + "h " + Math.floor((time.uptime % 3600) / 60) + "m",
        os: os.distro + " (" + os.release + ")",
        disk: fs[0].use.toFixed(1),
        
        // Network (convert from B/s to KB/s)
        netDown: (net[0].rx_sec / 1024).toFixed(2),
        netUp: (net[0].tx_sec / 1024).toFixed(2),
        
        // Processes
        topProcs
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