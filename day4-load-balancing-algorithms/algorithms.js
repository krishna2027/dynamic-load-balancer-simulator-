/* =========================================
   DAY 4 – LOAD BALANCING ALGORITHMS
   ========================================= */

/*
 NOTE:
 - processors[] and taskQueue[] are assumed
   to be available globally (from Day 3)
 - This file only decides:
   -> which task
   -> which processor
*/

// ===== ROUND ROBIN =====
let rrIndex = 0;
function roundRobin() {
    const task = taskQueue.shift();
    const cpu = processors[rrIndex];
    rrIndex = (rrIndex + 1) % processors.length;
    return { task, cpu };
}

// ===== LEAST LOADED =====
function leastLoaded() {
    const task = taskQueue.shift();
    const cpu = processors.reduce((min, p) =>
        p.load < min.load ? p : min
    );
    return { task, cpu };
}

// ===== FIRST COME FIRST SERVE =====
function fcfs() {
    const task = taskQueue.shift();
    const cpu = leastLoaded().cpu;
    return { task, cpu };
}

// ===== SHORTEST JOB FIRST =====
function sjf() {
    const index = taskQueue.reduce(
        (minIdx, t, i, arr) => t.load < arr[minIdx].load ? i : minIdx,
        0
    );
    const task = taskQueue.splice(index, 1)[0];
    const cpu = leastLoaded().cpu;
    return { task, cpu };
}

// ===== LONGEST JOB FIRST =====
function ljf() {
    const index = taskQueue.reduce(
        (maxIdx, t, i, arr) => t.load > arr[maxIdx].load ? i : maxIdx,
        0
    );
    const task = taskQueue.splice(index, 1)[0];
    const cpu = leastLoaded().cpu;
    return { task, cpu };
}

// ===== PRIORITY SCHEDULING =====
function priorityBased() {
    const index = taskQueue.reduce(
        (minIdx, t, i, arr) => t.priority < arr[minIdx].priority ? i : minIdx,
        0
    );
    const task = taskQueue.splice(index, 1)[0];
    const cpu = leastLoaded().cpu;
    return { task, cpu };
}

// ===== WEIGHTED ROUND ROBIN =====
let wrrIndex = 0;
let wrrCounter = 0;
const cpuWeights = [1, 2, 3, 2];

function weightedRoundRobin() {
    const task = taskQueue.shift();
    const cpu = processors[wrrIndex];

    wrrCounter++;
    if (wrrCounter >= cpuWeights[wrrIndex]) {
        wrrCounter = 0;
        wrrIndex = (wrrIndex + 1) % processors.length;
    }
    return { task, cpu };
}

// ===== LEAST CONNECTIONS =====
function leastConnections() {
    const task = taskQueue.shift();
    const cpu = processors.reduce((min, p) =>
        p.tasks.length < min.tasks.length ? p : min
    );
    return { task, cpu };
}

// ===== FASTEST RESPONSE TIME =====
function fastestResponse() {
    const task = taskQueue.shift();
    const cpu = leastLoaded().cpu;
    return { task, cpu };
}

// ===== THRESHOLD BASED =====
function thresholdBased(threshold = 70) {
    const task = taskQueue.shift();
    const available = processors.filter(p => p.load < threshold);

    const cpu = available.length
        ? available[Math.floor(Math.random() * available.length)]
        : leastLoaded().cpu;

    return { task, cpu };
}

// ===== RANDOM =====
function randomAssignment() {
    const task = taskQueue.shift();
    const cpu = processors[Math.floor(Math.random() * processors.length)];
    return { task, cpu };
}

// ===== ALGORITHM DISPATCHER =====
function selectAlgorithm(type) {
    switch (type) {
        case "roundRobin": return roundRobin();
        case "leastLoaded": return leastLoaded();
        case "fcfs": return fcfs();
        case "sjf": return sjf();
        case "ljf": return ljf();
        case "priority": return priorityBased();
        case "weighted": return weightedRoundRobin();
        case "leastConnections": return leastConnections();
        case "responseTime": return fastestResponse();
        case "threshold": return thresholdBased();
        case "random": return randomAssignment();
        default: return roundRobin();
    }
}
