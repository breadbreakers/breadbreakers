import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';

export async function POST(event) {
    const { request } = event;
    let message;

    try {
        const { itemId, rejectMessage } = await request.json();

        if (!rejectMessage) {
            message = "Nil";
        } else {
            message = rejectMessage;
        }

        if (!itemId || !rejectMessage)
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

        // send email to SW
        const swSubject = `Recurring Request Rejected (${households.id})`;

        const swBody = `
            Dear ${households.swname}<br>
            Your request has been rejected:<br>
            <strong>Reason</strong> ${rejectMessage}<br>
        `;

        await sendEmail({
            to: households.swemail,
            subject: swSubject,
            body: swBody,
            bcc: BREADBREAKERS_EMAIL
        });

        // delete from households table
        const { data: householdDelete, error: errHouseholdDelete } = await supabase
            .from('households')
            .delete()
            .eq('id', itemId);

        return json({ message: 'Recurring Reqeust Rejected' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
