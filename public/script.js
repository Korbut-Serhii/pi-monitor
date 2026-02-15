const socket = io();

// Parameters for auto-refresh
const ctx = document.getElementById('historyChart').getContext('2d');
const historyChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Temporal labels will be added dynamically
        datasets: [
            {
                label: 'Температура (°C)',
                borderColor: '#f78166',
                backgroundColor: 'rgba(247, 129, 102, 0.1)',
                data: [],
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Загрузка CPU (%)',
                borderColor: '#58a6ff',
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                data: [],
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
            x: { display: false }, // Hide X-axis labels for a cleaner look
            y: { type: 'linear', display: true, position: 'left', min: 20, max: 90 },
            y1: { type: 'linear', display: true, position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false } }
        },
        plugins: { legend: { labels: { color: '#c9d1d9' } } }
    }
});

socket.on('stats', (data) => {
    // Update system info
    document.getElementById('os-title').innerText = data.os + " | Uptime: " + data.uptime;
    document.getElementById('cpu-total').innerText = data.cpuLoad;
    document.getElementById('cpu-speed').innerText = data.cpuSpeed;
    document.getElementById('ram-val').innerText = data.ramPct;
    document.getElementById('ram-bar').style.width = data.ramPct + '%';
    document.getElementById('swap-val').innerText = data.swapPct;
    document.getElementById('swap-bar').style.width = data.swapPct + '%';
    document.getElementById('disk').innerText = data.disk;
    document.getElementById('disk-bar').style.width = data.disk + '%';
    
    // New fields for disk and network speeds
    document.getElementById('disk-read').innerText = data.diskRead;
    document.getElementById('disk-write').innerText = data.diskWrite;
    document.getElementById('net-down').innerText = data.netDown;
    document.getElementById('net-up').innerText = data.netUp;
    document.getElementById('conn-total').innerText = data.totalConns;

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

    // Network Connections
    const connDiv = document.getElementById('conn-list');
    if (data.activeConns.length > 0) {
        connDiv.innerHTML = data.activeConns.map(c => 
            `<div class="conn-item"><span>${c.peer}</span><span>Port: ${c.port}</span></div>`
        ).join('');
    } else {
        connDiv.innerHTML = '<div class="conn-item">Нет активных соединений</div>';
    }

    // --- Update Chart ---
    const now = new Date();
    const timeLabel = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    
    // Add new data points to the chart
    historyChart.data.labels.push(timeLabel);
    historyChart.data.datasets[0].data.push(data.temp);
    historyChart.data.datasets[1].data.push(data.cpuLoad);

    // Delete old data points to keep the chart clean (max 30 points)
    if (historyChart.data.labels.length > 30) {
        historyChart.data.labels.shift();
        historyChart.data.datasets[0].data.shift();
        historyChart.data.datasets[1].data.shift();
    }
    
    historyChart.update();
});