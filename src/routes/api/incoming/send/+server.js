import { json } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { getSgTime } from '$lib/sgtime'

export async function POST(event) {
    const { request } = event;

    try {

        const { itemDescription, amount, approverEmail } = await request.json();

        if (!itemDescription || !amount || !approverEmail)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        // create entry in expenses
        const { data: expense } = await supabase
            .from('incoming')
            .insert([
                {
                    source: itemDescription,
                    amount,
                    approveremail: approverEmail,
                    timestamp: getSgTime()
                }
            ]);

        // update amounts
        const { data: balance, error: balanceError } = await supabase
            .from('balance')
            .select('amount')
            .single();

        let balanceN = balance.amount;
        let newBalance = balanceN + amount;

        const { data: balanceUpdate, balanceUpdateError } = await supabase
            .from('balance')
            .update({
                amount: newBalance
            })
            .eq('amount', balanceN); // use the current value as a filter

        return json({ message: 'Expense Submitted' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}