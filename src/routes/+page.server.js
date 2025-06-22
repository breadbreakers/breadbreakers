export async function load({ locals }) {
    const session = await locals.getUser();
    const loggedIn = !!session;
    
    let userName = "";
    let userEmail = null;

    if (loggedIn) {
        const { data: { user }, error } = await locals.supabase.auth.getUser();
        userEmail = user.email;
    }

    const { data, error } = await locals.supabase.rpc('get_dashboard_stats', {
        email: userEmail
    });

    return {
        beneficiaryCount: data.beneficiaryCount,
        nInNeed: data.inNeedCount,
        balanceN: data.balanceData - data.operatingIncoming - data.ringfenceN,
        ringfenceN: data.ringfenceN,
        nWip: data.wipCount,
        loggedIn,
        isPartner: data.isPartner,
        catData: data.categorySummary,
        userName
    };
}
