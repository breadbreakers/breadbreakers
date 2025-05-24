import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { env } from '$env/dynamic/private';
import { createServerClient } from '@supabase/ssr';

export async function POST(event) {  
    const { request } = event;

    try {
        const { itemId, linkUrl, cost } = await request.json();

        if (!itemId || !linkUrl || !cost) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const supabase = createServerClient(
            env.SUPABASE_URL,
            env.SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll: () => event.cookies.getAll(),
                    setAll: (cookiesToSet) => {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            event.cookies.set(name, value, options);
                        });
                    }
                }
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: ringfenceStatus } = await supabase
            .from('wip')
            .select('status')
            .eq('id', itemId)
            .single();
console.log(ringfenceStatus)
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
                    link: linkUrl
                }
            ]);

        // send email to partner that ringfence is submitted
        const partnerBody = `Your Ringfence Request has been sent for approval.`

        await sendEmail({
            to: partnerEmail, // to the partner
            subject: `[Ringfence Submitted] ${itemData.title}`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        // send email to approver
        const approverBody = `
            <h2>To Approve: ${itemData.title}</h2>
            <p><strong>Description:</strong> ${itemData.description}</p>
            <p><strong>Contact:</strong> ${itemData.contact_clean}</p>
            <p><strong>Link:</strong> <a href="${linkUrl}">${linkUrl}</a></p>
            <p><strong>Amount:</strong> ${cost}</p>
            <p>
                <a href="http://localhost:5173/api/ringfence/approve?id=${itemData.id}" style="color: white; background: green; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Approve</a>
            </p>
            <p>Reply to this email if clarification with the partner if required.</p>
            `;
        await sendEmail({
            to: 'hello@breadbreakers.sg',
            subject: `[For Approval] Ringfence for ${itemData.title} (${itemData.id})`,
            body: approverBody,
            replyTo: partnerEmail
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
