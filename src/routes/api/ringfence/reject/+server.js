import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';

export async function POST(event) {
    const { request } = event;

    try {

        const { itemId, rejectMessage } = await request.json();

        if (!itemId || !rejectMessage)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        // no need to check if it's approver, because rls only allows approvers to delete from wip

        // check if item is in ringfence_requested state
        // rls only allows logged in user to view their own rows
        const { data: wipStatus } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        if (wipStatus.status !== "ringfence_requested") {
            return new Response('<p>Item has not requested for ringfence.</p>', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }

        const partnerEmail = wipStatus.partner;

        // send email to partner that ringfence is rejected
        const partnerBody = `<p>Your Ringfence Request has been rejected for ${wip.title}.</p><p>Remarks: ${rejectMessage}</p><p>Please submit your Ringfence Request again.</p>`

        await sendEmail({
            to: partnerEmail,
            subject: `Ringfence Rejected for ${wip.title} (${itemId})`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        // delete entry in wip table
        // rls only allows approvers to delete
        const { data, error } = await supabase
            .from('wip')
            .delete()
            .eq('id', itemId);    

        return json({ message: 'Ringfence Rejected' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
