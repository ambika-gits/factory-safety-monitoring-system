/* ==========================================================
   SafeVision AI
   index.js
   Landing Page Dynamic Telemetry Inserter
========================================================== */

const LANDING_API_URL = "http://127.0.0.1:8000/api/violations/";

document.addEventListener("DOMContentLoaded", () => {
    fetchSystemStatusCounters();
    // Keep landing status active with a 10-second refresh loop
    setInterval(fetchSystemStatusCounters, 10000);
});

async function fetchSystemStatusCounters() {
    try {
        const response = await fetch(LANDING_API_URL);
        if (!response.ok) throw new Error("API un-reachable.");
        
        const violationsList = await response.json();
        
        // Target elements on the index landing page layout
        const totalBreachesCount = violationsList.length;
        const liveCounterBadge = document.getElementById("homeViolationBadge");
        const systemStatusText = document.getElementById("homeStatusText");

        // 1. Update active breach tracking counters dynamically
        if (liveCounterBadge) {
            liveCounterBadge.innerText = `${totalBreachesCount} Flagged Events`;
            if (totalBreachesCount > 0) {
                liveCounterBadge.className = "badge bg-danger animate__animated animate__pulse animate__infinite";
            }
        }

        // 2. Flip system status diagnostics flag
        if (systemStatusText) {
            systemStatusText.innerHTML = `<span class="spinner-grow spinner-grow-sm text-success me-2" role="status"></span> Edge Engine Active`;
        }

    } catch (error) {
        console.warn("[INDEX MODULE] Could not update landing stats. Server might be initializing:", error);
        const systemStatusText = document.getElementById("homeStatusText");
        if (systemStatusText) {
            systemStatusText.innerHTML = `<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle-fill me-1"></i> Standby mode</span>`;
        }
    }
}