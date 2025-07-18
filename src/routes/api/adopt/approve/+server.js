import { json } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/supabase';

export async function POST(event) {
    const { request } = event;
    
    try {
        const { itemId } = await request.json();

        if (!itemId)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        const { data: households } = await supabase
            .from('households')
            .select('*')
            .eq('id', itemId)
            .single();

        if (households.status !== "submitted") {
            return json({ message: 'No recurring request submitted for item.' }, { status: 200 });
        }

        // update households table that is approved
        await supabase
            .from('households')
            .update({ status: 'open' })
            .eq('id', itemId);

        return json({ message: 'Recurring Reqeust Approved' }, { status: 200 });

        // no need to send any email at this point. email only sent if recurring request is paired or rejected.

    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
