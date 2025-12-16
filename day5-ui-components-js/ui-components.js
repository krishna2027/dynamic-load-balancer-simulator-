/* =========================================
   DAY 5 – UI COMPONENTS & TASK HANDLING
   ========================================= */

let isBalancing = false;
let balanceInterval = null;
let currentAlgorithm = "roundRobin";

// ===== START BALANCING =====
function startBalancing() {
    if (taskQueue.length === 0) {
        addLog("No tasks in queue to balance");
        return;
    }

    if (isBalancing) return;

    isBalancing = true;
    addLog("Load balancing started");

    balanceInterval = setInterval(() => {
        if (taskQueue.length === 0) {
            stopBalancing();
            return;
        }
        balanceTask();
    }, 1500);
}

// ===== STOP BALANCING =====
function stopBalancing() {
    isBalancing = false;
    clearInterval(balanceInterval);
    addLog("Load balancing stopped");
}

// ===== BALANCE SINGLE TASK =====
function balanceTask() {
    if (taskQueue.length === 0) return;

    // Select task & CPU from Day-4 algorithms
    const { task, cpu } = selectAlgorithm(currentAlgorithm);

    if (!task || !cpu) return;

    // Assign task
    cpu.tasks.push(task);
    cpu.load = Math.min(100, cpu.load + task.load);
    balancedCounter++;

    addLog(`${task.name} assigned to ${cpu.name}`);

    renderProcessors();
    renderTaskQueue();
    updateStats();

    // Simulate execution
    setTimeout(() => {
        cpu.load = Math.max(0, cpu.load - task.load);
        cpu.tasks = cpu.tasks.filter(t => t.id !== task.id);

        addLog(`${task.name} completed on ${cpu.name}`);
        renderProcessors();
        updateStats();
    }, 3000 + Math.random() * 2000);
}

// ===== RESET SYSTEM =====
function resetSystem() {
    stopBalancing();
    taskQueue = [];
    taskCounter = 0;
    balancedCounter = 0;

    processors.forEach(cpu => {
        cpu.load = 0;
        cpu.tasks = [];
    });

    renderProcessors();
    renderTaskQueue();
    updateStats();

    document.getElementById("logContainer").innerHTML = "";
    addLog("System reset");
}

// ===== ALGORITHM CHANGE =====
function updateAlgorithm() {
    const select = document.getElementById("algorithm");
    currentAlgorithm = select.value;
    addLog(`Algorithm changed to ${currentAlgorithm}`);
}

// ===== BUTTON EVENTS =====
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("startBtn")
        ?.addEventListener("click", startBalancing);

    document.getElementById("stopBtn")
        ?.addEventListener("click", stopBalancing);

    document.getElementById("resetBtn")
        ?.addEventListener("click", resetSystem);

    document.getElementById("algorithm")
        ?.addEventListener("change", updateAlgorithm);
});
