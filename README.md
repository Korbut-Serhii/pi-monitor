# Pi-Node Monitoring Dashboard

Lightweight real-time monitoring dashboard for Raspberry Pi and Linux devices.
Built with **Node.js**, **Socket.io**, and **Chart.js** with focus on low resource usage and SD card protection.

---

## Overview

Pi-Node Monitoring Dashboard is a minimal and efficient system monitoring tool designed for Raspberry Pi and other Linux-based devices.

It provides real-time hardware and network metrics through a web-based interface while keeping CPU, RAM, and disk usage as low as possible.

---

## Key Features

### System Monitoring

* Real-time CPU usage (per core)
* RAM and Swap usage
* CPU temperature
* Disk usage
* Disk I/O activity (SD card stress tracking)

### Network Monitoring

* Active incoming/outgoing connections
* Live network throughput (upload/download)

### Process Monitoring

* Top 3 processes by CPU consumption

### Performance Visualization

* Historical line charts for:

  * CPU load
  * Temperature trends

### Optimization & Efficiency

* Data collection automatically pauses when no client is connected
* Uses `Promise.all()` for parallel system calls
* No database required
* Charts rendered on client side (reduces Pi load)

---

## Why This Project?

Many monitoring tools (like full-scale stacks with databases) are too heavy for low-power SBCs.

This project focuses on:

* Minimal overhead
* SD card lifespan preservation
* Clean and simple UI
* Easy deployment

Perfect for:

* Home servers
* Self-hosted projects
* Raspberry Pi clusters
* Learning system monitoring concepts

---

## Tech Stack

* **Backend:** Node.js
* **Realtime Communication:** Socket.io
* **System Data:** systeminformation
* **Frontend Charts:** Chart.js
* **Styling:** Custom CSS (dark theme)

---

## Requirements

* Raspberry Pi (any model with Node.js support)
  - Also works on any Linux device
* Node.js v14+
* npm

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Korbut-Serhii/pi-monitor.git
cd pi-monitor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

The dashboard will be available at:

```
http://<your-device-ip>:3000
```

---

## Project Structure

```
pi-monitor/
│
├── server.js              # Backend logic & system data collection
├── public/
│   ├── index.html         # Dashboard layout
│   ├── script.js          # WebSocket & Chart rendering logic
│   └── style.css          # Dark theme styling
└── package.json
```

---

## Resource Optimization Strategy

This project is designed specifically for low-power hardware.

* No database writes (avoids SD wear)
* No background polling when no clients connected
* Frontend handles rendering and graph calculations
* Lightweight dependency stack

---

## Future Improvements (Ideas)

* Authentication layer
* Docker support
* Export metrics as JSON
* Alert system (email / webhook)
* Multi-device monitoring
