import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createServerClient } from '@supabase/ssr';
import { sendEmail } from '$lib/email.js';

export async function POST(event) {
    const { request } = event;

    try {
        const { itemId, email, subject, body } = await request.json();

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

        const { data: { user }, error } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: existing, error: wipError } = await supabase
            .from('wip')
            .select('id')
            .eq('id', itemId)
            .single();


        if (wipError && wipError.code !== 'PGRST116') {
            console.error('Supabase error:', wipError.message);
            return json({ error: 'Failed to query database' }, { status: 500 });
        }

        if (existing) {
            return json({ error: 'Item already in progress' }, { status: 409 });
        }

        //send email to social worker
        await sendEmail({
            to: email, // to the social worker
            subject: subject,
            body: body,
            replyTo: partnerEmail, // to let social worker reply directly to partner
            bcc: 'hello@breadbreakers.sg', // for audit trail 
            cc: partnerEmail // keep partner in the loop
        });

        // send email to partner optional since partner already in cc
        /*let partnerBody = `<p>Dear Partner,</p><p>Your Offer Request has been sent to ${email}.</p><p>Once the social worker approves your assistance, <a href="http://localhost:5173/ringfence?id=${itemId}">use this form to ringfence funds</a>.</p><p>Thank you for your support!</p>`;
        let partnerSubject = `[Offer Request Sent] ${subject}`;
        await sendEmail({
            to: partnerEmail,
            subject: partnerSubject,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg'
        });*/

        return json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}