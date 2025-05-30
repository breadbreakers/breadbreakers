import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { encrypt } from '$lib/crypto';

export async function POST(event) {
    const { request } = event;

    try {
        const { itemId, email, subject, body } = await request.json();

        const supabase = createServerSupabaseClient(event);

        const { data: { user }, error } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: existing } = await supabase
            .from('wip')
            .select('id')
            .eq('id', itemId)
            .single();

        if (existing) {
            return json({ error: 'Item already WIP' }, { status: 409 });
        }

        // create unique link for SW to submit personal data
        const uniqueString = `${itemId}_${partnerEmail}_${email}`
        const uniqueLink = await encrypt(uniqueString);
  
        //send email to social worker
        await sendEmail({
            to: email, // to the social worker
            subject: `${subject} (${itemId})`,
            body: body,
            replyto: partnerEmail, // to let social worker reply directly to partner
            bcc: 'hello@breadbreakers.sg', // for audit trail 
            cc: partnerEmail // keep partner in the loop
        });

        // send email to partner to tell them to use the link
        let partnerBody = `<p>Dear Partner,</p><p>Your Offer Request has been sent to ${email}.</p><p>Once the social worker approves your assistance, share <a href"https://breadbreakers.sg/share?d=${uniqueLink}">this link with the social worker</a> to securely collect personal data. Then, <a href="https://breadbreakers.sg/ringfence?id=${itemId}">use this form to ringfence funds</a>.</p><p>Thank you for your support!</p>`;
        let partnerSubject = `[Offer Request Sent] ${subject} (${itemId})`;
        await sendEmail({
            to: partnerEmail,
            subject: partnerSubject,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg'
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}