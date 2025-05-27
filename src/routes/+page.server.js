
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
);

export async function load({ locals }) {
    const { count: beneficiaryCount, error: countError } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        throw new Error(countError.message);
    }

    const { count: inNeedCount, error: inNeedError } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true });

    if (inNeedError) {
        throw new Error(inNeedError.message);
    }

    const { data: balanceData, error: balanceError } = await supabase
        .from('balance')
        .select('amount')
        .single();

    if (balanceError) {
        throw new Error(balanceError.message);
    }

    return {
        beneficiaryCount: beneficiaryCount,
        nInNeed: inNeedCount,
        balanceN: balanceData.amount
    };
}
