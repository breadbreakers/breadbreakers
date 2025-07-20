import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/supabase';
import { getSgTime } from '$lib/sgtime'
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';

export async function POST(event) {
    const { request } = event;
    const message = approveMessage || "Nil";
    try {

        const { itemId, approveMessage } = await request.json();

        if (!approveMessage) {
            message = "Nil"
        } else {
            message = approveMessage
        }

        if (!itemId)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        const { data: wip } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        if (wip.status !== "claim_requested") {
            return new Response('<p>Partner has not requested for claim.</p>', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }

        const partnerEmail = wip.partner;

        // create entry in items
        await supabase
            .from('items')
            .insert([
                {
                    id: itemId,
                    item: wip.title,
                    fulfiled: getSgTime(),
                    delivery: wip.delivery,
                    contact: wip.contact,
                    cost: wip.amount,
                    receipt: wip.receipt
                }
            ]);


        // send email to partner that claim is approved
        const partnerBody = `<p>Your Claim Request has been approved for ${wip.title}.</p><p>Remarks: ${message}.</p><p>Please contact us if you did not receive your reimbursement.</p><p>Please remove personal details of beneficaries stored on your device.</p><p>Thank you for your support!</p>`

        await sendEmail({
            to: partnerEmail,
            subject: `Claim Approved for ${wip.title} (${itemId})`,
            body: partnerBody,
            bcc: BREADBREAKERS_EMAIL // for audit trail 
        });

        // delete entry in wip table
        // rls only allows approvers to delete
        await supabase
            .from('wip')
            .delete()
            .eq('id', itemId);

        await supabase
            .from('requests_manual')
            .delete()
            .eq('id', itemId);

        return json({ message: 'Claim Approved' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}