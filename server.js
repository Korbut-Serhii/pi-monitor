const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const si = require('systeminformation');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Track active clients to optimize data fetching
let activeClients = 0;

io.on('connection', (socket) => {
    activeClients++;
    socket.on('disconnect', () => { activeClients--; });
});

async function getStats() {
    // Collect all stats in parallel for better performance
    const [cpu, cpuFlags, mem, temp, time, net, os, fs, fsStats, netConns] = await Promise.all([
        si.currentLoad(),
        si.cpu(),
        si.mem(),
        si.cpuTemperature(),
        si.time(),
        si.networkStats(),
        si.osInfo(),
        si.fsSize(),
        si.fsStats(), // Stats for disk read/write speeds
        si.networkConnections()
    ]);

    const processes = await si.processes();
    const topProcs = processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 3)
        .map(p => ({ name: p.name, cpu: p.cpu.toFixed(1) }));

    // Filter for established connections and limit to top 5 for display
    const establishedConns = netConns
        .filter(c => c.state === 'ESTABLISHED')
        .slice(0, 5)
        .map(c => ({ peer: c.peerAddress, port: c.peerPort }));

    return {
        cpuLoad: cpu.currentLoad.toFixed(1),
        cpuCores: cpu.cpus.map(c => c.load.toFixed(1)),
        cpuSpeed: cpuFlags.speed,
        temp: temp.main,
        ramPct: ((mem.active / mem.total) * 100).toFixed(1),
        swapPct: ((mem.swapused / mem.swaptotal) * 100 || 0).toFixed(1),
        uptime: Math.floor(time.uptime / 3600) + "h " + Math.floor((time.uptime % 3600) / 60) + "m",
        os: os.distro + " (" + os.release + ")",
        disk: fs[0].use.toFixed(1),
        
        // Disk read/write speeds in KB/s
        diskRead: (fsStats.rx_sec / 1024).toFixed(2),
        diskWrite: (fsStats.wx_sec / 1024).toFixed(2),

        netDown: (net[0].rx_sec / 1024).toFixed(2),
        netUp: (net[0].tx_sec / 1024).toFixed(2),
        
        topProcs,
        activeConns: establishedConns,
        totalConns: netConns.filter(c => c.state === 'ESTABLISHED').length
    };
}

// Ask for stats every 2 seconds, but only if there are active clients
setInterval(async () => {
    if (activeClients > 0) {
        const stats = await getStats();
        io.emit('stats', stats);
    }
}, 2000);

server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});