const socket = io();

socket.on('stats', (data) => {
    document.getElementById('cpu').innerText = data.cpu;
    document.getElementById('ram').innerText = data.ram;
    document.getElementById('temp').innerText = data.temp;
    document.getElementById('uptime').innerText = data.uptime;
    document.getElementById('down').innerText = data.netDown;
    document.getElementById('up').innerText = data.netUp;
});