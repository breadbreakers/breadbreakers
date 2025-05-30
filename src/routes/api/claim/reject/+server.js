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

        // no need to check if it's approver, because rls only allows approvers to update from wip

        // check if item is in ringfence_requested state
        // rls only allows logged in user to view their own rows
        const { data: wipStatus } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        if (wipStatus.status !== "claim_requested") {
            return new Response('<p>Partner has not requested for claim.</p>', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }

        const partnerEmail = wipStatus.partner;

        // get the items based on itemId
        let itemData = null;

        const { data: item, error: itemError } = await supabase
            .from('requests')
            .select('*')
            .eq('id', itemId)
            .single();

        itemData = item;

        // update entry in wip table back to ringfence_approved
        // rls only allows approvers to delete
        const { data, error } = await supabase
            .from('wip')
            .update({ status: 'ringfence_approved' })
            .eq('id', itemId);
           
        // send email to partner that claim is rejected
        const partnerBody = `<p>Your Claim Request has been rejected for ${itemData.title}.</p><p>Remarks: ${rejectMessage}.</p><p>Please provide the necessary details or clarifications and resubmit at <a href="https://breadbreakers.sg/claim?id=${itemId}">https://breadbreakers.sg/claim?id=${itemId}</a></p>`

        await sendEmail({
            to: partnerEmail,
            subject: `[Claim Rejected] ${itemData.title} (${itemId})`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        return json({ message: 'Claim Rejected' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
