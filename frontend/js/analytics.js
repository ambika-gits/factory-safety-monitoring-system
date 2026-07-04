/* ==========================================================
   SafeVision AI
   analytics.js
   Live Analytics Dashboard
========================================================== */

/* ===============================
   API ENDPOINT
=============================== */

const API_BASE = "http://127.0.0.1:8000/api";

const VIOLATIONS_API =
    API_BASE + "/violations/";

/* ===============================
   DOM ELEMENTS
=============================== */

const totalWorkers =
    document.getElementById("totalWorkers");

const safeWorkers =
    document.getElementById("safeWorkers");

const totalViolations =
    document.getElementById("totalViolations");

const complianceRate =
    document.getElementById("complianceRate");

const averageConfidence =
    document.getElementById("averageConfidence");

const todayViolations =
    document.getElementById("todayViolations");

let pieChart = null;
let barChart = null;
let lineChart = null;

/* ===============================
   FETCH ANALYTICS DATA
=============================== */

async function fetchAnalytics() {

    try {

        const response =
            await fetch(VIOLATIONS_API);

        if (!response.ok)
            throw new Error("API Error");

        const data =
            await response.json();

        updateCards(data);

        updatePieChart(data);

        updateBarChart(data);

        updateLineChart(data);

    }

    catch (error) {

        console.error(

            "Analytics Error:",

            error

        );

    }

}

/* ===============================
   UPDATE ANALYTICS CARDS
=============================== */

function updateCards(data) {

    if (!Array.isArray(data))
        return;

    const workers =
        new Set();

    let safe = 0;

    let violations = 0;

    let confidenceSum = 0;

    let today = 0;

    const todayDate =
        new Date().toDateString();

    data.forEach(item => {

        workers.add(

            item.worker_name ||

            "Unknown Worker"

        );

        const helmet =

            (item.helmet_status || "")

            .toLowerCase();

        if (helmet.includes("no")) {

            violations++;

        }

        else {

            safe++;

        }

        confidenceSum +=

            Number(item.confidence || 0);

        if (

            new Date(item.timestamp)

            .toDateString()

            === todayDate

        ) {

            today++;

        }

    });

    const compliance =

        data.length === 0

        ? 100

        : (

            safe /

            data.length

        ) * 100;

    const average =

        data.length === 0

        ? 0

        : (

            confidenceSum /

            data.length

        );

    if (totalWorkers)

        totalWorkers.innerHTML =

            workers.size;

    if (safeWorkers)

        safeWorkers.innerHTML =

            safe;

    if (totalViolations)

        totalViolations.innerHTML =

            violations;

    if (complianceRate)

        complianceRate.innerHTML =

            compliance.toFixed(1) + "%";

    if (averageConfidence)

        averageConfidence.innerHTML =

            average.toFixed(1) + "%";

    if (todayViolations)

        todayViolations.innerHTML =

            today;

}
/* ==========================================================
   PIE CHART
========================================================== */

function updatePieChart(data) {

    const canvas = document.getElementById("pieChart");

    if (!canvas) return;

    let safe = 0;
    let violations = 0;

    data.forEach(item => {

        const status = (item.helmet_status || "").toLowerCase();

        if (status.includes("no")) {

            violations++;

        } else {

            safe++;

        }

    });

    if (pieChart)
        pieChart.destroy();

    pieChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [

                "Safe Workers",

                "Violations"

            ],

            datasets: [

                {

                    data: [

                        safe,

                        violations

                    ],

                    backgroundColor: [

                        "#00d084",

                        "#ff4d4d"

                    ],

                    borderWidth: 0

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    labels: {

                        color: "#ffffff"

                    }

                }

            }

        }

    });

}

/* ==========================================================
   BAR CHART
========================================================== */

function updateBarChart(data) {

    const canvas = document.getElementById("barChart");

    if (!canvas) return;

    const cameraStats = {};

    data.forEach(item => {

        const cam = item.camera || "Unknown";

        if (!cameraStats[cam]) {

            cameraStats[cam] = 0;

        }

        cameraStats[cam]++;

    });

    const labels = Object.keys(cameraStats);

    const values = Object.values(cameraStats);

    if (barChart)
        barChart.destroy();

    barChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Violations",

                    data: values,

                    backgroundColor: "#0dcaf0"

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    labels: {

                        color: "#ffffff"

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,0.1)"

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,0.1)"

                    }

                }

            }

        }

    });

}
/* ==========================================================
   LINE CHART
========================================================== */

function updateLineChart(data) {

    const canvas = document.getElementById("lineChart");

    if (!canvas) return;

    const dailyData = {};

    data.forEach(item => {

        const date = new Date(item.timestamp).toLocaleDateString();

        if (!dailyData[date]) {

            dailyData[date] = 0;

        }

        if ((item.helmet_status || "").toLowerCase().includes("no")) {

            dailyData[date]++;

        }

    });

    const labels = Object.keys(dailyData);

    const values = Object.values(dailyData);

    if (lineChart)
        lineChart.destroy();

    lineChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Daily Violations",

                    data: values,

                    borderColor: "#ff4d4d",

                    backgroundColor: "rgba(255,77,77,0.2)",

                    fill: true,

                    tension: 0.4,

                    pointRadius: 5,

                    pointHoverRadius: 7

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    labels: {

                        color: "#ffffff"

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,0.1)"

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,0.1)"

                    }

                }

            }

        }

    });

}

/* ==========================================================
   REFRESH ANALYTICS
========================================================== */

function refreshAnalytics() {

    fetchAnalytics();

}

/* ==========================================================
   AUTO REFRESH
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("SafeVision Analytics Loaded");

    refreshAnalytics();

    setInterval(refreshAnalytics, 5000);

});