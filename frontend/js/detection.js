/* ==========================================================
   SafeVision AI
   detection.js
   Live Video Feed Viewport & Warning Engine
========================================================== */

const API_BASE_URL = "http://127.0.0.1:8000/api";
const STREAM_CHECK_INTERVAL = 3000; // Check data updates every 3 seconds

document.addEventListener("DOMContentLoaded", () => {
    initWebcamPlaceholder();
    startLiveSync();
});

/* ==========================================================
   WEBCAM VIEWPORT INITIALIZATION
========================================================== */
function initWebcamPlaceholder() {
    console.log("[INFO] SafeVision Detection UI Initialized.");
    
    // Attempt to inject an overlay alert banner area inside your video wrapper if it exists
    const videoWrapper = document.querySelector(".glass img#latestImage")?.parentNode;
    if (videoWrapper) {
        const banner = document.createElement("div");
        banner.id = "safetyAlertBanner";
        banner.className = "alert alert-success mt-2 text-center text-uppercase fw-bold d-none";
        banner.innerHTML = '<i class="bi bi-shield-check"></i> System Nominal - PPE Compliant';
        videoWrapper.appendChild(banner);
    }
}

/* ==========================================================
   LIVE STATE POLLING
========================================================== */
function startLiveSync() {
    // Poll the backend endpoint to update warning UI elements instantly if a violation is present
    setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/latest/`);
            if (!response.ok) return;

            const data = await response.json();
            updateWarningBanner(data);
        } catch (error) {
            console.error("[UI ERROR] Failed to synchronize live stream elements:", error);
        }
    }, STREAM_CHECK_INTERVAL);
}

/* ==========================================================
   DYNAMIC WARNING BANNER LOGIC
========================================================== */
function updateWarningBanner(latestRecord) {
    const banner = document.getElementById("safetyAlertBanner");
    if (!banner) return;

    const status = (latestRecord.helmet_status || "").toLowerCase();
    const timestamp = new Date(latestRecord.timestamp);
    const rightNow = new Date();

    // Check if a critical infraction occurred within the last 8 seconds
    if (status.includes("no") && (rightNow - timestamp < 8000)) {
        banner.className = "alert alert-danger mt-2 text-center text-uppercase fw-bold animate__animated animate__flash";
        banner.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill"></i> 
            CRITICAL VIOLATION: ${latestRecord.worker_name} DETECTED WITHOUT HELMET AT ${latestRecord.location}!
        `;
        banner.classList.remove("d-none");
    } else {
        // Clear warning states back to safe monitoring defaults
        banner.className = "alert alert-success mt-2 text-center text-uppercase fw-bold";
        banner.innerHTML = '<i class="bi bi-shield-check"></i> Monitoring Active - All Secure';
        banner.classList.remove("d-none");
    }
}