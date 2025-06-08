export async function load({ locals }) {
    
    const { data, error } = await locals.supabase.rpc('get_dashboard_stats');
    const session = await locals.getUser();

    const loggedIn = session ? true : false;

    return {
        beneficiaryCount: data.beneficiaryCount,
        nInNeed: data.wipCount,
        balanceN: data.balanceData - data.operatingIncoming - data.ringfenceN,
        ringfenceN: data.ringfenceN,
        nWip: data.inNeedCount - data.wipCount,
        loggedIn
    };
}
