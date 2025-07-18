export async function load({ locals }) {
    
    const { data } = await locals.supabase.rpc('get_dashboard_stats', {
        email: null
    });

    return {
        balanceN: (data.balanceData/100).toFixed(2),
        ringfenceN: (data.ringfenceN/100).toFixed(2),
        operatingN: (data.operatingIncoming/100).toFixed(2)
    };
}
