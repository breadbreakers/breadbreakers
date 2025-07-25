import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
    const session = await locals.getUser();
    const loggedIn = !!session;
    
    let userEmail = null;

    if (loggedIn) {
        const { data: { user } } = await locals.supabase.auth.getUser();
        userEmail = user.email;
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

    return json(result);
}