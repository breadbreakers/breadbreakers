import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { env } from '$env/dynamic/private';
import { createServerClient } from '@supabase/ssr';

export async function GET(event) {

    try {
        const itemId = event.url.searchParams.get('id');

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

        // check if logged in user is approver
        const { data: { user } } = await supabase.auth.getUser();
        const loggedInEmail = user.email;

        const { data: isApprover } = await supabase
            .from('approvers')
            .select('email')
            .eq('email', loggedInEmail)
            .single();

        if (!isApprover) {
            return new Response(null, {
                status: 303,
                headers: {
                    'Location': '/'
                }
            });
        }

        // check if item is already approved
        const { data: wipStatus } = await supabase
            .from('wip')
            .select('status')
            .eq('id', itemId)
            .single();

        if (wipStatus.status === "ringfence_approved") {
            return new Response('<p>Item already approved.</p>', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }

        // get the items based on itemId
        let itemData = null;

        const { data: item, error: itemError } = await supabase
            .from('requests')
            .select('*')
            .eq('id', itemId)
            .single();

        if (itemError) {
            return new Response('<p>Item does not have Ringfence Request</p>', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }

        itemData = item;

        // update wip table that is approved
        const { data, error } = await supabase
            .from('wip')
            .update({ status: 'ringfence_approved' })
            .eq('id', itemId);

        // get partner email
        const { data: wip } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        const partnerEmail = wip.partner;

        // send email to partner that ringfence is approved
        const partnerBody = `Your Ringfence Request has been approved for ${itemData.title}. Use <a href="http://localhost:5173/claim?id=${itemData.id}">this form to submit a claims request</a>.`

        await sendEmail({
            to: partnerEmail, 
            subject: `[Ringfence Approved] ${itemData.title}`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        return new Response('<p>Ringfence Approved</p>', {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
