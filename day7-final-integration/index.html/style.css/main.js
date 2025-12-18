<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dynamic Load Balancing System</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS -->
    <link rel="stylesheet" href="style.css">

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<header>
    <h1>Dynamic Load Balancing System</h1>
    <p>OS Scheduling & Load Distribution Simulator</p>
</header>

<main>

<section id="control-panel">
    <h2>Control Panel</h2>

    <button id="addTask">Add Task</button>
    <button id="addMultiple">Add 5 Tasks</button>
    <button id="startBtn">Start Simulation</button>
    <button id="stopBtn">Stop</button>
    <button id="resetBtn">Reset</button>

    <br><br>

    <label>Select Algorithm:</label>
    <select id="algorithm">
        <option value="roundRobin">Round Robin</option>
        <option value="leastLoaded">Least Loaded</option>
        <option value="fcfs">FCFS</option>
        <option value="sjf">SJF</option>
        <option value="priority">Priority</option>
        <option value="random">Random</option>
    </select>

    <div id="stats">
        <p>Total Tasks: <span id="totalTasks">0</span></p>
        <p>Balanced Tasks: <span id="balancedTasks">0</span></p>
        <p>Average Load: <span id="avgLoad">0%</span></p>
    </div>
</section>

<section>
    <h2>Processor Pool</h2>
    <div id="processors"></div>
</section>

<section>
    <h2>Task Queue</h2>
    <div id="taskQueue"></div>

    <h2>Activity Log</h2>
    <div id="logContainer"></div>
</section>

<section>
    <h2>Performance Chart</h2>
    <canvas id="metricsChart"></canvas>
</section>

</main>

<script src="main.js"></script>
</body>
</html>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

section {
    background: rgba(255,255,255,0.15);
    padding: 15px;
    border-radius: 12px;
}

button, select {
    padding: 8px 14px;
    margin: 5px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
}

button {
    background: #22c55e;
    font-weight: bold;
}

#processors {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px,1fr));
    gap: 10px;
}

.processor {
    background: rgba(255,255,255,0.25);
    padding: 10px;
    border-radius: 10px;
    text-align: center;
}

.task {
    display: inline-block;
    background: #10b981;
    padding: 5px 10px;
    margin: 4px;
    border-radius: 20px;
}

#logContainer {
    background: rgba(0,0,0,0.3);
    max-height: 160px;
    overflow-y: auto;
    padding: 10px;
}

/* ========= DATA ========= */
let processors = [
    { id: 1, name: "CPU-1", load: 0, tasks: [] },
    { id: 2, name: "CPU-2", load: 0, tasks: [] },
    { id: 3, name: "CPU-3", load: 0, tasks: [] },
    { id: 4, name: "CPU-4", load: 0, tasks: [] }
];

let taskQueue = [];
let taskCounter = 0;
let balancedCounter = 0;
let rrIndex = 0;
let isRunning = false;
let interval;

/* ========= UI RENDER ========= */
function renderProcessors() {
    const box = document.getElementById("processors");
    box.innerHTML = "";

    processors.forEach(cpu => {
        const div = document.createElement("div");
        div.className = "processor";
        div.innerHTML = `
            <h4>${cpu.name}</h4>
            <p>Load: ${cpu.load}%</p>
            <p>Tasks: ${cpu.tasks.length}</p>
        `;
        box.appendChild(div);
    });
}

function renderQueue() {
    const q = document.getElementById("taskQueue");
    q.innerHTML = "";
    taskQueue.forEach(t => {
        const span = document.createElement("span");
        span.className = "task";
        span.textContent = t.name;
        q.appendChild(span);
    });
}

function log(msg) {
    const logBox = document.getElementById("logContainer");
    logBox.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}<br>` + logBox.innerHTML;
}

/* ========= TASK ========= */
function addTask() {
    taskCounter++;
    taskQueue.push({
        id: taskCounter,
        name: `Task-${taskCounter}`,
        load: Math.floor(Math.random()*20)+10
    });
    renderQueue();
}

function addMultiple() {
    for(let i=0;i<5;i++) addTask();
}

/* ========= ALGORITHMS ========= */
function roundRobin() {
    const task = taskQueue.shift();
    const cpu = processors[rrIndex];
    rrIndex = (rrIndex+1)%processors.length;
    return {task, cpu};
}

function leastLoaded() {
    const task = taskQueue.shift();
    const cpu = processors.reduce((a,b)=>a.load<b.load?a:b);
    return {task, cpu};
}

/* ========= SIMULATION ========= */
function runSimulation() {
    if(taskQueue.length===0){
        stopSimulation();
        return;
    }

    const algo = document.getElementById("algorithm").value;
    let result;

    if(algo==="leastLoaded") result = leastLoaded();
    else result = roundRobin();

    const {task, cpu} = result;

    cpu.tasks.push(task);
    cpu.load += task.load;
    balancedCounter++;

    log(`${task.name} assigned to ${cpu.name}`);
    renderProcessors();
    renderQueue();

    setTimeout(()=>{
        cpu.load -= task.load;
        cpu.tasks.pop();
        renderProcessors();
    },3000);
}

function startSimulation() {
    if(isRunning) return;
    isRunning = true;
    interval = setInterval(runSimulation,1500);
}

function stopSimulation() {
    isRunning = false;
    clearInterval(interval);
}

/* ========= RESET ========= */
function resetSystem() {
    stopSimulation();
    taskQueue=[];
    taskCounter=0;
    balancedCounter=0;
    processors.forEach(p=>{p.load=0;p.tasks=[]});
    renderQueue();
    renderProcessors();
    log("System reset");
}

/* ========= EVENTS ========= */
document.getElementById("addTask").onclick = addTask;
document.getElementById("addMultiple").onclick = addMultiple;
document.getElementById("startBtn").onclick = startSimulation;
document.getElementById("stopBtn").onclick = stopSimulation;
document.getElementById("resetBtn").onclick = resetSystem;

renderProcessors();

