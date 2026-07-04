/* ==========================================================
   SafeVision AI
   history.js
   Dynamic Archive Log Renderer
========================================================== */

const ARCHIVE_API_URL = "http://127.0.0.1:8000/api/violations/";

document.addEventListener("DOMContentLoaded", () => {
    loadHistoricalLogs();
});

async function loadHistoricalLogs() {
    const tableBody = document.getElementById("historyTableBody") || document.getElementById("logsTable");
    if (!tableBody) return;

    try {
        const response = await fetch(ARCHIVE_API_URL);
        if (!response.ok) throw new Error("Could not fetch historical logs.");
        
        const data = await response.json();
        let htmlRows = "";

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No historical data logs recorded yet.</td></tr>';
            return;
        }

        data.forEach(item => {
            // Clean formatting for the dates
            const dateObj = new Date(item.timestamp);
            const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Ensure the image points to the absolute Django local server path
            const imagePath = item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`;

            htmlRows += `
                <tr>
                    <td><strong>#${item.id}</strong></td>
                    <td><i class="bi bi-clock me-2 text-secondary"></i>${formattedDate} at ${formattedTime}</td>
                    <td><span class="badge bg-danger text-uppercase">${item.helmet_status}</span></td>
                    <td><b class="text-warning">${item.confidence}%</b></td>
                    <td><i class="bi bi-camera-video me-1 text-info"></i> ${item.camera} <small class="text-muted">(${item.location})</small></td>
                    <td>
                        <a href="${imagePath}" target="_blank" class="btn btn-sm btn-outline-primary py-0 px-2">
                            <i class="bi bi-image me-1"></i> View Snapshot
                        </a>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = htmlRows;

    } catch (error) {
        console.error("[HISTORY CORES] Failed loading archival rows:", error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">Error connecting to Django database cluster.</td></tr>';
    }
}