import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';

export async function POST(event) {
    const { request } = event;
    let message = "Nil";
    
    try {
        const { itemId, approveMessage } = await request.json();

        if (!approveMessage) {
            message = "Nil";
        } else {
            message = approveMessage;
        }

        if (!itemId)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        // no need to check if it's approver, because rls only allows approvers to delete from wip

        // check if item is in ringfence_requested state
        // rls only allows logged in user to view their own rows
        const { data: households } = await supabase
            .from('households')
            .select('*')
            .eq('id', itemId)
            .single();

        if (households.status !== "submitted") {
            return json({ message: 'No recurring request submitted for item.' }, { status: 200 });
        }

        // update households table that is approved
        const { data, error } = await supabase
            .from('households')
            .update({ status: 'open' })
            .eq('id', itemId);

        return json({ message: 'Recurring Reqeust Approved' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
