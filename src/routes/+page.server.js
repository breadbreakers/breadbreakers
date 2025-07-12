// +page.server.js - Fast initial render approach
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
    
    // Check cache first - if cached, return immediately
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (now - cached.timestamp < CACHE_TTL) {
            setHeaders({
                'cache-control': 'public, max-age=30'
            });
            return {
                ...cached.data,
                isLoading: false
            };
        }
    }

    // Return loading state immediately - don't wait for database
    setHeaders({
        'cache-control': 'public, max-age=5' // Shorter cache for loading state
    });

    // Return minimal data to render UI immediately
    return {
        beneficiaryCount: null,
        nInNeed: null,
        balanceN: null,
        ringfenceN: null,
        nWip: null,
        loggedIn,
        isPartner: false,
        catData: [],
        userName,
        householdsWaiting: null,
        householdsPaired: null,
        isLoading: true // Flag to indicate data is loading
    };
}