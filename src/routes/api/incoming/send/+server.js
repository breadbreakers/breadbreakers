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

        // create entry in incoming table
        const { data: expense } = await supabase
            .from('incoming')
            .insert([
                {
                    source: itemDescription,
                    amount: Math.round(amount * 100),
                    approveremail: approverEmail,
                    timestamp: getSgTime()
                }
            ]);

        return json({ message: 'Expense Submitted' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}