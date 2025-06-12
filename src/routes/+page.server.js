export async function load({ locals }) {

    const { data, error } = await locals.supabase.rpc('get_dashboard_stats');
    const session = await locals.getUser();

    const loggedIn = session ? true : false;

    let isPartner = false;

    // check if is partner
    if (loggedIn) {
        const { data: { user }, error: userError } = await locals.supabase.auth.getUser();

        const { data: partner, error: partnerError } = await locals.supabase
            .from('partners')
            .select('email')
            .eq('email', user.email)
            .single();

        if (partner) {
            isPartner = true
        }        
    }
console.log(data)
    return {
        beneficiaryCount: data.beneficiaryCount,
        nInNeed: data.inNeedCount - data.wipCount,
        balanceN: data.balanceData - data.operatingIncoming - data.ringfenceN,
        ringfenceN: data.ringfenceN,
        nWip: data.wipCount,
        loggedIn,
        isPartner
    };
}
