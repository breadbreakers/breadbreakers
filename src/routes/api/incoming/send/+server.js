import { json } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { getSgTime } from '$lib/sgtime'

export async function POST(event) {
    const { request } = event;

    try {

        const { itemDescription, amount, approverEmail, fundType } = await request.json();

        if (!itemDescription || !amount || !approverEmail || !fundType)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        // create entry in incoming table
        if (fundType == 'interest') {
            const { data: expense } = await supabase
            .from('incoming')
            .insert([
                {
                    id: itemDescription,
                    source: 'Interest (Beneficiary Fund)',
                    amount: Math.round(amount * 100),
                    approveremail: approverEmail,
                    timestamp: getSgTime()
                }
            ]);
        } else {        

            const { data: expense } = await supabase
                .from('incoming')
                .insert([
                    {
                        id: itemDescription,
                        source: (fundType == 'mission' ? 'Donation (Beneficiary Fund)' : 'Donation (Operating Fund)'),
                        amount: Math.round(amount * 100),
                        approveremail: approverEmail,
                        timestamp: getSgTime()
                    }
                ]);

        }

        return json({ message: 'Expense Submitted' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}