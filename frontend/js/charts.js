/* ==========================================================
   SafeVision AI
   charts.js
   Dynamic Chart.js Live Aggregation Engine
========================================================== */

const CHARTS_API_URL = "http://127.0.0.1:8000/api/violations/";
const CHART_POLL_INTERVAL_MS = 5000; // Re-calculate trends every 5 seconds

let safetyLineChart = null;
let safetyPieChart = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeAndFetchCharts();
    
    // Periodically update the visual telemetry analytics
    setInterval(initializeAndFetchCharts, CHART_POLL_INTERVAL_MS);
});

/* ==========================================================
   PRIMARY DATA ENGINE & AGGREGATION PIPELINE
========================================================== */
async function initializeAndFetchCharts() {
    try {
        const response = await fetch(CHARTS_API_URL);
        if (!response.ok) throw new Error("Could not fetch analytics payload data.");
        
        const violations = await response.json();
        
        // Calculate structural data patterns
        const processedData = aggregateAnalyticsData(violations);
        
        // Render or update chart canvas elements cleanly
        renderLineChart(processedData.daysLabel, processedData.violationTrends);
        renderPieChart(processedData.safeCount, processedData.violationCount);
        
    } catch (error) {
        console.error("[CHARTS ENGINE ERROR] Failed to build analytical charts:", error);
    }
}

/* ==========================================================
   DATA AGGREGATION UTILITIES
========================================================== */
function aggregateAnalyticsData(violations) {
    // Standard template for the past 7 days tracking matrix
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayIndex = new Date().getDay();
    
    // Reorder labels array so the current day is at the far right
    let daysLabel = [];
    let dailyViolationMap = {};
    
    for (let i = 6; i >= 0; i--) {
        let targetsIndex = (todayIndex - i + 7) % 7;
        let dayName = dayNames[targetsIndex];
        daysLabel.push(dayName);
        dailyViolationMap[dayName] = 0; // Initialize database counters
    }

    // Allocate database entries to their corresponding days based on timestamp strings
    violations.forEach(item => {
        if (!item.timestamp) return;
        const eventDayName = dayNames[new Date(item.timestamp).getDay()];
        if (dailyViolationMap[eventDayName] !== undefined) {
            dailyViolationMap[eventDayName]++;
        }
    });

    // Extract ordered values for mapping layout arrays
    const violationTrends = daysLabel.map(day => dailyViolationMap[day]);
    
    // Core summary counting distribution settings
    const totalBaseWorkersCount = 24;
    const violationCount = violations.length;
    const safeCount = Math.max(0, totalBaseWorkersCount - violationCount);

    return {
        daysLabel,
        violationTrends,
        safeCount,
        violationCount
    };
}

/* ==========================================================
   CHART.JS INJECTION FUNCTIONS
========================================================== */

// 1. Line Chart - Daily Safety Monitoring Trends
function renderLineChart(labels, violationData) {
    const ctx = document.getElementById("lineChart");
    if (!ctx) return;

    // Simulate safe base benchmarks calculation matching compliance targets
    const safeBenchmarkData = labels.map((_, index) => 20 + (index % 3));

    if (safetyLineChart) {
        // Update live dataset array references cleanly to avoid flickering re-renders
        safetyLineChart.data.labels = labels;
        safetyLineChart.data.datasets[0].data = safeBenchmarkData;
        safetyLineChart.data.datasets[1].data = violationData;
        safetyLineChart.update("none"); // Update smoothly without flashing animations
        return;
    }

    safetyLineChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Safe Baseline (Target)",
                    data: safeBenchmarkData,
                    borderColor: "#00d4ff",
                    backgroundColor: "rgba(0, 212, 255, 0.1)",
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "Logged Violations",
                    data: violationData,
                    borderColor: "#ff4d4d",
                    backgroundColor: "rgba(255, 77, 77, 0.1)",
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: "#fff", font: { family: "Inter" } } }
            },
            scales: {
                x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#aaa" } },
                y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#aaa", stepSize: 1 } }
            }
        }
    });
}

// 2. Pie Chart - Today Summary Allocation
function renderPieChart(safeCount, violationCount) {
    const ctx = document.getElementById("pieChart");
    if (!ctx) return;

    // Direct data injection configuration mapping object formats
    const chartDataValues = [safeCount, violationCount];

    if (safetyPieChart) {
        safetyPieChart.data.datasets[0].data = chartDataValues;
        safetyPieChart.update();
        return;
    }

    safetyPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Safe Allocations", "Active Breaches"],
            datasets: [{
                data: chartDataValues,
                backgroundColor: ["#00d4ff", "#ff4d4d"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom", labels: { color: "#fff", font: { family: "Inter" } } }
            },
            cutout: "70%"
        }
    });
}