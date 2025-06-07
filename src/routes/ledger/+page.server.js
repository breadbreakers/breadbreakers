export async function load({ locals }) {
    
    const { data, error } = await locals.supabase.rpc('get_dashboard_stats');
    const session = await locals.getUser();

    return {
        balanceN: (data.balanceData/100).toFixed(2),
        ringfenceN: (data.ringfenceN/100).toFixed(2)
    };
}
