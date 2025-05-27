import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';

export async function POST(event) {
    const { request } = event;

    try {
        const { itemId, linkUrl, cost, swConfirmUrl } = await request.json();

        if (!itemId || !linkUrl || !cost || !swConfirmUrl) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const supabase = createServerSupabaseClient(event);

        const { data: { user } } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: ringfenceStatus } = await supabase
            .from('wip')
            .select('status')
            .eq('id', itemId)
            .single();

        if (ringfenceStatus !== null) {

            if (ringfenceStatus.status === "ringfence_requested") {
                return json({ error: 'Item already ringfenced' }, { status: 409 });
            }

            if (ringfenceStatus.status === "ringfence_approved") {
                return json({ error: 'Item is already approved.' }, { status: 409 });
            }

            if (ringfenceStatus.status === "claim_requested") {
                return json({ error: 'Item is in processing for claims.' }, { status: 409 });
            }
        }

        // don't need to check if it's a partner, because RLS already checks if logged in user is in the partners table before allowing  insert.

        // get the items based on itemId
        let itemData = null;

        const { data: item, error: itemError } = await supabase
            .from('requests')
            .select('*')
            .eq('id', itemId)
            .single();

        itemData = item;

        // insert into wip table
        const { data } = await supabase
            .from('wip')
            .insert([
                {
                    id: itemId,
                    status: "ringfence_requested",
                    partner: partnerEmail,
                    amount: cost,
                    link: linkUrl,
                    swconfirm: swConfirmUrl
                }
            ]);

        // send email to partner that ringfence is submitted
        const partnerBody = `Your Ringfence Request has been sent for approval.`

        await sendEmail({
            to: partnerEmail, // to the partner
            subject: `[Ringfence Submitted] ${itemData.title} (${itemId})`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        // send email to approver
        const approverBody = `
            <p><strong>Description:</strong> ${itemData.description}</p>
            <p><strong>Contact:</strong> ${itemData.contact_clean}</p>
            <p><strong>To purchase from:</strong> <a href="${linkUrl}">${linkUrl}</a></p>
            <p><a href="${swConfirmUrl}"><strong>Social worker confirmation</strong></a></p>
            <p><strong>Amount to ringfence:</strong> $${cost}</p>
            <p>
                <a href="https://breadbreakers.sg/ringfence/approve?id=${itemData.id}" style="color: white; background: green; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Approve</a>
            </p>
            <p>
                <a href="https://breadbreakers.sg/ringfence/reject?id=${itemData.id}" style="color: white; background: red; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Reject</a>
            </p>
            <p>Reply to this email if clarification with the partner if required.</p>
            `;
        await sendEmail({
            to: 'hello@breadbreakers.sg',
            subject: `[For Approval] Ringfence for ${itemData.title} (${itemId})`,
            body: approverBody,
            replyTo: partnerEmail
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
