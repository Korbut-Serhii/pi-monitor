const socket = io();

socket.on('stats', (data) => {
    document.getElementById('os-title').innerText = data.os + " | Uptime: " + data.uptime;
    document.getElementById('cpu-total').innerText = data.cpuLoad;
    document.getElementById('cpu-speed').innerText = data.cpuSpeed;
    document.getElementById('ram-val').innerText = data.ramPct;
    document.getElementById('ram-bar').style.width = data.ramPct + '%';
    document.getElementById('swap-val').innerText = data.swapPct;
    document.getElementById('swap-bar').style.width = data.swapPct + '%';
    document.getElementById('temp').innerText = data.temp;
    document.getElementById('disk').innerText = data.disk;
    document.getElementById('disk-bar').style.width = data.disk + '%';

    // CPU Cores
    const coresDiv = document.getElementById('cpu-cores-container');
    coresDiv.innerHTML = data.cpuCores.map((load, i) => 
        `<div style="font-size: 0.7em">Core ${i}: ${load}%</div>
        <div class="bar-container" style="height:4px"><div class="bar" style="width:${load}%"></div></div>`
    ).join('');

    // Processes
    const procDiv = document.getElementById('proc-list');
    procDiv.innerHTML = data.topProcs.map(p => 
        `<div class="proc-item"><span>${p.name}</span><span>${p.cpu}%</span></div>`
    ).join('');
});