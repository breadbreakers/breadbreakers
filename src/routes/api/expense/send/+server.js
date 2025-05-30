import { json } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { getSgTime } from '$lib/sgtime'

export async function POST(event) {
    const { request } = event;

    try {

        const { itemDescription, amount, receiptUrl, approverEmail } = await request.json();

        if (!itemDescription || !amount || !receiptUrl || !approverEmail)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        // create entry in expenses
        const { data: expense } = await supabase
            .from('expenses')
            .insert([
                {
                    description: itemDescription,
                    amount,
                    approveremail: approverEmail,
                    link: receiptUrl,
                    timestamp: getSgTime()
                }
            ]);

        // update amounts
        const { data: balance, error: balanceError } = await supabase
            .from('balance')
            .select('amount')
            .single();

        let balanceN = balance.amount;
        let newBalance = balanceN - amount;

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