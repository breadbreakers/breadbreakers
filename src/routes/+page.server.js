// +page.server.js with basic caching
let cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

export async function load({ locals, setHeaders }) {
    const session = await locals.getUser();
    const loggedIn = !!session;
    
    let userName = "";
    let userEmail = null;

    if (loggedIn) {
        const { data: { user }, error } = await locals.supabase.auth.getUser();
        userEmail = user.email;
    }

    // Create cache key
    const cacheKey = `dashboard_${userEmail || 'anonymous'}`;
    const now = Date.now();
    
    // Check cache first
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (now - cached.timestamp < CACHE_TTL) {
            // Set cache headers
            setHeaders({
                'cache-control': 'public, max-age=30'
            });
            return cached.data;
        }
    }

    // Fetch fresh data
    const { data, error } = await locals.supabase.rpc('get_dashboard_stats', {
        email: userEmail
    });

    if (error) {
        console.error('Dashboard stats error:', error);
        // Return default values if there's an error
        return {
            beneficiaryCount: 0,
            nInNeed: 0,
            balanceN: 0,
            ringfenceN: 0,
            nWip: 0,
            loggedIn,
            isPartner: false,
            catData: [],
            userName,
            householdsWaiting: 0,
            householdsPaired: 0
        };
    }

    const result = {
        beneficiaryCount: data.beneficiaryCount,
        nInNeed: data.inNeedCount,
        balanceN: data.balanceData - data.operatingIncoming - data.ringfenceN,
        ringfenceN: data.ringfenceN,
        nWip: data.wipCount,
        loggedIn,
        isPartner: data.isPartner,
        catData: data.categorySummary,
        userName,
        householdsWaiting: data.householdsWaiting,
        householdsPaired: data.householdsPaired
    };

    // Cache the result
    cache.set(cacheKey, {
        data: result,
        timestamp: now
    });

    // Clean up old cache entries
    if (cache.size > 100) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
    }

    // Set cache headers
    setHeaders({
        'cache-control': 'public, max-age=30'
    });

    return result;
}