/* ==========================================================
   SafeVision AI
   api.js
   Centralized Edge Network API Wrapper
========================================================== */

const SafeVisionAPI = (() => {
    const BASE_URL = "http://127.0.0.1:8000/api";

    /**
     * Fetch all logged safety violations from SQLite
     */
    const getAllViolations = async () => {
        try {
            const response = await fetch(`${BASE_URL}/violations/`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("[API ENGINE] Failed fetching entire violation history:", error);
            return [];
        }
    };

    /**
     * Fetch the single newest critical infraction record
     */
    const getLatestViolation = async () => {
        try {
            const response = await fetch(`${BASE_URL}/latest/`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("[API ENGINE] Failed fetching latest hotspot metrics:", error);
            return null;
        }
    };

    /**
     * Helper to format raw timestamps consistently across sub-pages
     */
    const formatTimestamp = (isoString) => {
        if (!isoString) return "--:--";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return {
        getAllViolations,
        getLatestViolation,
        formatTimestamp
    };
})();