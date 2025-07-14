import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { google } from 'googleapis';
import { env } from '$env/dynamic/private';

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

        // === GOOGLE DRIVE AUTH WITH OAUTH ===
        const oauth2Client = new google.auth.OAuth2(
            env.GOOGLE_CLIENT_ID,
            env.GOOGLE_CLIENT_SECRET,
            env.GOOGLE_REDIRECT
        );

        // Set the refresh token
        oauth2Client.setCredentials({
            refresh_token: env.GOOGLE_REFRESH_TOKEN,
        });

        const drive = google.drive({ version: 'v3', auth: oauth2Client });

        let urlObj;
        let fileId;

        const swconfirm_url = wip.delivery;
        urlObj = new URL(swconfirm_url);
        fileId = urlObj.searchParams.get('id');
        await drive.files.delete({ fileId });

        const itemSupport_url = wip.receipt;
        urlObj = new URL(itemSupport_url);
        fileId = urlObj.searchParams.get('id');
        await drive.files.delete({ fileId });

        // update entry in wip table back to ringfence_approved
        // rls only allows approvers to delete
        const { data, error } = await supabase
            .from('wip')
            .update({
                status: 'ringfence_approved',
                receipt: '',
                delivery: ''
            })
            .eq('id', itemId);

        // send email to partner that claim is rejected
        const partnerBody = `<p>Your Claim Request has been rejected for ${wip.title}.</p><p>Remarks: ${rejectMessage}.</p><p>Please provide the necessary details or clarifications and resubmit at <a href="https://breadbreakers.sg/claim?id=${itemId}">https://breadbreakers.sg/claim?id=${itemId}</a></p>`

        await sendEmail({
            to: partnerEmail,
            subject: `Claim Rejected for ${wip.title} (${itemId})`,
            body: partnerBody,
            bcc: BREADBREAKERS_EMAIL // for audit trail 
        });

        return json({ message: 'Claim Rejected' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
