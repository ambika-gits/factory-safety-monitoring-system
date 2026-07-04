/* ==========================================================
   SafeVision AI
   dashboard.js
   Real-Time Data Injection Engine
========================================================== */

const API_BASE_URL = "http://127.0.0.1:8000/api";
const REFRESH_INTERVAL_MS = 2500; // Auto-update dashboard metrics every 2.5s

document.addEventListener("DOMContentLoaded", () => {
    // Initial fetch cycle on document load
    fetchDashboardMetrics();
    
    // Establish persistent live polling loop
    setInterval(fetchDashboardMetrics, REFRESH_INTERVAL_MS);
});

/* ==========================================================
   PRIMARY DATA FETCH & ARCHITECTURE PIPELINE
========================================================== */
async function fetchDashboardMetrics() {
    try {
        // Parallelized resource fetching for UI performance stability
        const [allResponse, latestResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/violations/`),
            fetch(`${API_BASE_URL}/latest/`)
        ]);

        if (!allResponse.ok || !latestResponse.ok) {
            throw new Error("Django network endpoint returned a bad status code.");
        }

        const violationsList = await allResponse.json();
        const latestIncident = await latestResponse.json();

        // Pass parsed server payloads into DOM rendering sub-systems
        updateTopStatCards(violationsList);
        updateLatestViolationCard(latestIncident);
        updateRecentViolationsTable(violationsList);
        updateWorkerOverviewTable(violationsList);

    } catch (error) {
        console.error("[DASHBOARD SYNC ERROR] System metrics update cycle failed:", error);
    }
}

/* ==========================================================
   DOM MANIPULATION & INTERFACE RENDER CORES
========================================================== */

// 1. Updates Top Dashboard Highlight Counter Statistics
function updateTopStatCards(violations) {
    const violationCounter = document.getElementById("violations");
    const safeCounter = document.getElementById("safe");
    
    if (violationCounter) {
        violationCounter.innerText = violations.length;
    }
    
    // Dynamic mock tracking offsets matching baseline objectives
    if (safeCounter) {
        const totalBaseWorkers = 24; 
        const currentSafeCount = Math.max(0, totalBaseWorkers - violations.length);
        safeCounter.innerText = currentSafeCount;
    }
}

// 2. Injects Newest Snapshot and Information into the Highlight Card
function updateLatestViolationCard(incident) {
    const imgElement = document.getElementById("latestImage");
    const workerElement = document.getElementById("latestWorker");
    const cameraElement = document.getElementById("latestCamera");
    const locationElement = document.getElementById("latestLocation");
    const confElement = document.getElementById("latestConfidence");
    const timeElement = document.getElementById("latestTime");

    if (imgElement && incident.image) {
        // Prepend local address if Django provides absolute sub-paths
        imgElement.src = incident.image.startsWith('http') ? incident.image : `http://127.0.0.1:8000${incident.image}`;
    }
    if (workerElement) workerElement.innerText = incident.worker_name || "N/A";
    if (cameraElement) cameraElement.innerText = incident.camera || "-";
    if (locationElement) locationElement.innerText = incident.location || "-";
    if (confElement) confElement.innerText = `${incident.confidence}%`;
    
    if (timeElement && incident.timestamp) {
        const dateObj = new Date(incident.timestamp);
        timeElement.innerText = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}

// 3. Spawns Row Elements for the Primary History Streams
function updateRecentViolationsTable(violations) {
    const tableBody = document.getElementById("recentTable") || document.getElementById("violationTable");
    if (!tableBody) return;

    // Grab only the top 5 most recent records to prevent long scroll pages
    const sliceData = violations.slice(0, 5);
    let htmlContent = "";

    sliceData.forEach(item => {
        const eventTime = item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--";
        
        htmlContent += `
            <tr>
                <td><i class="bi bi-person-badge text-secondary me-2"></i>${item.worker_name}</td>
                <td><span class="badge bg-danger">No Helmet</span></td>
                <td><b class="text-warning">${item.confidence}%</b></td>
                <td>${eventTime}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = htmlContent || '<tr><td colspan="4" class="text-center text-muted">No safety records logged.</td></tr>';
}

// 4. Feeds Data Records into the Cross-referenced Factory Log Grid
function updateWorkerOverviewTable(violations) {
    const workerTable = document.getElementById("workerTable");
    if (!workerTable) return;

    // Keep base static demo worker layout, prepend or replace dynamically if needed
    // For visual optimization, we update status elements cleanly
    if (violations.length > 0) {
        const totalViolationsCount = violations.length;
        const subHeader = document.querySelector("#workerTable").parentNode.parentNode.querySelector("h3");
        if (subHeader && !subHeader.innerHTML.includes("Active Tracker")) {
            subHeader.innerHTML += ` <span class="badge bg-danger ms-2" style="font-size: 12px;">${totalViolationsCount} Shifts Flagged</span>`;
        }
    }
}