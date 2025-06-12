import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { encrypt } from '$lib/crypto';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';

export async function POST(event) {
    const { request } = event;

    try {
        const { itemId, partnerEmail, swEmail, name, address, mobile, code, lift, consent } = await request.json();

        const encryptedName = await encrypt(name);
        const encryptedAddress = await encrypt(address);
        const encryptedMobile = await encrypt(mobile);

        const supabase = createServerSupabaseClient(event);

        const { data: existing } = await supabase
            .from('pd')
            .select('id')
            .eq('id', itemId)
            .single();

        if (existing) {
            return json({ error: 'Item already in PD table.' }, { status: 409 });
        }

        // insert into the pd table, encrypted values of PD
        const { data } = await supabase
            .from('pd')
            .insert([
                {
                    id: itemId,
                    name: encryptedName,
                    address: encryptedAddress,
                    mobile: encryptedMobile,
                    partneremail: partnerEmail,
                    swemail: swEmail,
                    lift: lift,
                    consent: consent    
                }
            ]);
  
        // send email to partner to tell them how to access the PD
        let partnerBody = `<p>Dear Partner,</p><p>Please go to <a href="https://breadbreakers.sg/view?source=${code}">this link</a> to view the beneficary data shared with you. Do not share this link. Then use <a href="https://breadbreakers.sg/ringfence?id=${itemId}">use this form to ringfence funds</a>.</p><p>Thank you for your support!</p>`;
        let partnerSubject = `[Beneficiary Data] (${itemId})`;
        await sendEmail({
            to: partnerEmail,
            subject: partnerSubject,
            body: partnerBody,
            bcc: BREADBREAKERS_EMAIL
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}