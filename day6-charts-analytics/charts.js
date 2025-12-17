/* =========================================
   DAY 6 – CHARTS & PERFORMANCE ANALYTICS
   ========================================= */

// ===== DATA STORAGE =====
let completedTasks = [];
let algorithmMetrics = {};
let metricsChart = null;
let activeChartType = "turnaround";

// ===== INITIALIZE CHART =====
function initChart() {
    const ctx = document.getElementById("metricsChart");
    if (!ctx) return;

    metricsChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Turnaround Time (ms)",
                data: [],
                backgroundColor: "rgba(102,126,234,0.7)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Task Performance Metrics"
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ===== RECORD METRICS =====
function recordMetrics(task, algorithm) {
    completedTasks.push(task);

    if (!algorithmMetrics[algorithm]) {
        algorithmMetrics[algorithm] = {
            turnaround: 0,
            waiting: 0,
            completion: 0,
            count: 0
        };
    }

    algorithmMetrics[algorithm].turnaround += task.turnaroundTime;
    algorithmMetrics[algorithm].waiting += task.waitingTime;
    algorithmMetrics[algorithm].completion += task.executionTime;
    algorithmMetrics[algorithm].count++;
}

// ===== UPDATE CHART =====
function updateChart() {
    if (!metricsChart) return;

    const recent = completedTasks.slice(-10);

    if (activeChartType === "turnaround") {
        metricsChart.data.labels = recent.map(t => t.name);
        metricsChart.data.datasets = [{
            label: "Turnaround Time (ms)",
            data: recent.map(t => t.turnaroundTime),
            backgroundColor: "rgba(102,126,234,0.7)"
        }];
    }

    if (activeChartType === "waiting") {
        metricsChart.data.labels = recent.map(t => t.name);
        metricsChart.data.datasets = [{
            label: "Waiting Time (ms)",
            data: recent.map(t => t.waitingTime),
            backgroundColor: "rgba(251,191,36,0.7)"
        }];
    }

    if (activeChartType === "completion") {
        metricsChart.data.labels = recent.map(t => t.name);
        metricsChart.data.datasets = [{
            label: "Completion Time (ms)",
            data: recent.map(t => t.executionTime),
            backgroundColor: "rgba(16,185,129,0.7)"
        }];
    }

    if (activeChartType === "comparison") {
        const algos = Object.keys(algorithmMetrics);
        metricsChart.data.labels = algos;

        metricsChart.data.datasets = [
            {
                label: "Avg Turnaround",
                data: algos.map(a =>
                    algorithmMetrics[a].turnaround / algorithmMetrics[a].count
                ),
                backgroundColor: "rgba(102,126,234,0.7)"
            },
            {
                label: "Avg Waiting",
                data: algos.map(a =>
                    algorithmMetrics[a].waiting / algorithmMetrics[a].count
                ),
                backgroundColor: "rgba(251,191,36,0.7)"
            },
            {
                label: "Avg Completion",
                data: algos.map(a =>
                    algorithmMetrics[a].completion / algorithmMetrics[a].count
                ),
                backgroundColor: "rgba(16,185,129,0.7)"
            }
        ];
    }

    metricsChart.update();
}

// ===== SWITCH CHART TYPE =====
function switchChart(type) {
    activeChartType = type;
    updateChart();
}

// ===== METRICS SUMMARY =====
function updateMetricsSummary() {
    const summary = document.getElementById("metricsSummary");
    if (!summary || completedTasks.length === 0) return;

    const recent = completedTasks.slice(-10);

    const avgTAT = recent.reduce((s, t) => s + t.turnaroundTime, 0) / recent.length;
    const avgWT = recent.reduce((s, t) => s + t.waitingTime, 0) / recent.length;
    const avgCT = recent.reduce((s, t) => s + t.executionTime, 0) / recent.length;

    summary.innerHTML = `
        <div><strong>Avg Turnaround:</strong> ${(avgTAT / 1000).toFixed(2)} s</div>
        <div><strong>Avg Waiting:</strong> ${(avgWT / 1000).toFixed(2)} s</div>
        <div><strong>Avg Completion:</strong> ${(avgCT / 1000).toFixed(2)} s</div>
        <div><strong>Total Completed:</strong> ${completedTasks.length}</div>
    `;
}

// ===== INIT AFTER LOAD =====
document.addEventListener("DOMContentLoaded", initChart);
