
// src/lib/dashboardCache.js
let cachedData = null;
let cacheTimestamp = null;

export function getCachedDashboardData() {
    return cachedData;
}

export function setCachedDashboardData(data) {
    cachedData = data;
    cacheTimestamp = Date.now();
}

export function clearDashboardCache() {
    cachedData = null;
    cacheTimestamp = null;
}

export function isCacheValid(maxAge = 5 * 60 * 1000) { // 5 minutes
    return cachedData && 
           cacheTimestamp && 
           (Date.now() - cacheTimestamp) < maxAge;
}