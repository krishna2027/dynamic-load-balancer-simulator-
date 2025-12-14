/* ===============================
   DAY 3 – CORE JAVASCRIPT LOGIC
   =============================== */

// ===== GLOBAL DATA =====
let processors = [];
let taskQueue = [];
let taskCounter = 0;
let balancedCounter = 0;

// ===== INITIALIZE SYSTEM =====
function initSystem() {
    processors = [
        { id: 1, name: "CPU-1", load: 0, tasks: [] },
        { id: 2, name: "CPU-2", load: 0, tasks: [] },
        { id: 3, name: "CPU-3", load: 0, tasks: [] },
        { id: 4, name: "CPU-4", load: 0, tasks: [] }
    ];

    renderProcessors();
    renderTaskQueue();
    updateStats();
    addLog("System initialized");
}

// ===== RENDER PROCESSORS =====
function renderProcessors() {
    const container = document.getElementById("processors");
    if (!container) return;

    container.innerHTML = "";

    processors.forEach(cpu => {
        const div = document.createElement("div");
        div.className = "processor";
        div.innerHTML = `
            <h3>${cpu.name}</h3>
            <p>Load: ${cpu.load}%</p>
            <p>Tasks: ${cpu.tasks.length}</p>
        `;
        container.appendChild(div);
    });
}

// ===== RENDER TASK QUEUE =====
function renderTaskQueue() {
    const queue = document.getElementById("taskQueue");
    if (!queue) return;

    if (taskQueue.length === 0) {
        queue.innerHTML = "No tasks in queue.";
        return;
    }

    queue.innerHTML = "";
    taskQueue.forEach(task => {
        const span = document.createElement("span");
        span.className = "task";
        span.textContent = `${task.name} (${task.load}%)`;
        queue.appendChild(span);
    });
}

// ===== ADD TASK =====
function addTask() {
    taskCounter++;

    const task = {
        id: taskCounter,
        name: `Task-${taskCounter}`,
        load: Math.floor(Math.random() * 20) + 10,
        arrivalTime: Date.now()
    };

    taskQueue.push(task);
    renderTaskQueue();
    updateStats();
    addLog(`${task.name} added to queue`);
}

// ===== ADD MULTIPLE TASKS =====
function addMultipleTasks(count = 5) {
    for (let i = 0; i < count; i++) {
        addTask();
    }
}

// ===== UPDATE STATS =====
function updateStats() {
    const totalTasksEl = document.getElementById("totalTasks");
    const balancedTasksEl = document.getElementById("balancedTasks");
    const avgLoadEl = document.getElementById("avgLoad");
    const varianceEl = document.getElementById("variance");

    if (!totalTasksEl) return;

    totalTasksEl.textContent = taskCounter;
    balancedTasksEl.textContent = balancedCounter;

    const avgLoad =
        processors.reduce((sum, p) => sum + p.load, 0) / processors.length;

    avgLoadEl.textContent = avgLoad.toFixed(1) + "%";
    varianceEl.textContent = calculateVariance().toFixed(1);
}

// ===== LOAD VARIANCE =====
function calculateVariance() {
    const loads = processors.map(p => p.load);
    const avg = loads.reduce((a, b) => a + b, 0) / loads.length;

    const variance =
        loads.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / loads.length;

    return Math.sqrt(variance);
}

// ===== LOG SYSTEM =====
function addLog(message) {
    const log = document.getElementById("logContainer");
    if (!log) return;

    const time = new Date().toLocaleTimeString();
    const div = document.createElement("div");
    div.className = "log-entry";
    div.textContent = `[${time}] ${message}`;

    log.prepend(div);
}

// ===== BUTTON EVENTS =====
document.addEventListener("DOMContentLoaded", () => {
    initSystem();

    document.getElementById("addTask")?.addEventListener("click", addTask);
    document.getElementById("addMultiple")?.addEventListener("click", () => addMultipleTasks(5));
});
