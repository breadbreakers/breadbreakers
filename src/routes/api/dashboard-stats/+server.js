// src/routes/api/dashboard-stats/+server.js
import { json } from '@sveltejs/kit';

let cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

export async function GET({ locals, setHeaders }) {
    const session = await locals.getUser();
    const loggedIn = !!session;
    
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
            setHeaders({
                'cache-control': 'public, max-age=30'
            });
            return json(cached.data);
        }
    }

    // Fetch fresh data
    const { data, error } = await locals.supabase.rpc('get_dashboard_stats', {
        email: userEmail
    });

    if (error) {
        console.error('Dashboard stats error:', error);
        return json({
            beneficiaryCount: 0,
            nInNeed: 0,
            balanceN: 0,
            ringfenceN: 0,
            nWip: 0,
            isPartner: false,
            catData: [],
            householdsWaiting: 0,
            householdsPaired: 0,
            error: 'Failed to load dashboard data'
        }, { status: 500 });
    }

    const result = {
        beneficiaryCount: data.beneficiaryCount,
        nInNeed: data.inNeedCount,
        balanceN: data.balanceData - data.operatingIncoming - data.ringfenceN,
        ringfenceN: data.ringfenceN,
        nWip: data.wipCount,
        isPartner: data.isPartner,
        catData: data.categorySummary,
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

    setHeaders({
        'cache-control': 'public, max-age=30'
    });

    return json(result);
}