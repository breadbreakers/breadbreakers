export async function load({ locals }) {
    
    const { data, error } = await locals.supabase.rpc('get_dashboard_stats');
    const session = await locals.getUser();

    return {
        balanceN: (data.balanceData.amount/100).toFixed(2),
        ringfenceN: (data.balanceData.ringfence/100).toFixed(2)
    };
}
