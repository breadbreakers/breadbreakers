import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';

export async function POST(event) {
    const { request } = event;

    let approverEmail;

    try {
        const { itemId, linkUrl, cost, swConfirmUrl } = await request.json();

        if (!itemId || !linkUrl || !cost || !swConfirmUrl) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const supabase = createServerSupabaseClient(event);

        const { data: balance, error: balanceError } = await supabase.rpc('get_dashboard_stats');

        let balanceN = balance.balanceData - balance.ringfenceN - balance.operatingIncoming;

        if (balanceN - (cost * 100) < 0) {
            return json({ error: 'Insufficient funds!' }, { status: 409 });
        }

        const { data: { user } } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: getApprover } = await supabase
            .from('approvers')
            .select('*')
            .eq('role', 'president')
            .single();

        approverEmail = getApprover.email;

        // get approver list and check if partner is inside
        const { data: approverCheck } = await supabase
            .from('approvers')
            .select('*')
            .eq('email', partnerEmail)
            .single();

        if (approverCheck) {
            approverEmail = approverCheck.checker;
        }

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
                    amount: cost * 100,
                    link: linkUrl,
                    swconfirm: swConfirmUrl
                }
            ]);

        // send email to partner that ringfence is submitted
        const partnerBody = `<p>Dear Partner</p><p>Your Ringfence Request has been sent to ${approverEmail} for approval.</p><p>Please <u>do not</u> proceed with the purchase until the request is approved.</p>`

        await sendEmail({
            to: partnerEmail, // to the partner
            subject: `Ringfence Request for ${itemData.title} (${itemId})`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        // send email to approver
        const approverBody = `
            <p><strong>Description:</strong> ${itemData.description}</p>
            <p><strong>Contact:</strong> ${itemData.contact_clean}</p>
            <p><strong>To purchase from:</strong> <a href="${linkUrl}">${linkUrl}</a></p>
            <p><a href="${swConfirmUrl}"><strong>Social worker confirmation</strong></a></p>
            <p><strong>Amount to ringfence (cost + delivery):</strong> $${cost}</p>
            <p>
                <a href="https://breadbreakers.sg/ringfence/approve?id=${itemData.id}" style="color: white; background: green; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Approve</a>
            </p>
            <p>
                <a href="https://breadbreakers.sg/ringfence/reject?id=${itemData.id}" style="color: white; background: red; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Reject</a>
            </p>
            <p><em>This is a system generated message. Do not reply.</em></p>
            `;
        
        await sendEmail({
            to: approverEmail,
            subject: `Ringfence Request for ${itemData.title} (${itemId})`,
            body: approverBody,
            replyTo: partnerEmail
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
