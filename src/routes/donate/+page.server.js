export async function load({ locals }) {
    const { data, error } = await locals.supabase.rpc('get_dashboard_stats', {
        email: null
    });

    const targetDonation = (data.inNeedCount + data.householdsWaiting) * 100;
    const operatingFund =(data.operatingIncoming / 100).toFixed(2);
    const beneFund = ((data.balanceData - data.ringfenceN - data.operatingIncoming) / 100).toFixed(2);

    return { targetDonation, operatingFund, beneFund };
}

    