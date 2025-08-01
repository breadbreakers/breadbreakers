import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/supabase';
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

        const { data: households } = await supabase
            .from('households')
            .select('*')
            .eq('id', itemId)
            .single();

        if (households.status !== "submitted") {
            return json({ message: 'No recurring request submitted for item.' }, { status: 200 });
        }        

        // send email to SW
        const swSubject = `🔴 Recurring Request Rejected (${households.id})`;

        const swBody = `
            Dear ${households.swname}<br>
            Your request has been rejected:<br>
            <strong class="is-underlined">Reason</strong> ${message}<br>
        `;

        await sendEmail({
            to: households.swemail,
            subject: swSubject,
            body: swBody,
            bcc: BREADBREAKERS_EMAIL
        });

        // delete from households table
        await supabase
            .from('households')
            .delete()
            .eq('id', itemId);

        return json({ message: 'Recurring Reqeust Rejected' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
