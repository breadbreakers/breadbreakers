import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/supabase';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { env } from '$env/dynamic/private';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
    region: env.R2_REGION,
    endpoint: env.R2_ENDPOINT,
    credentials: {
        accessKeyId: env.R2_ACCESS_ID,
        secretAccessKey: env.R2_SECRET,
    },
});

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

        // === DELETE FILES FROM S3 ===
        const deleteS3File = async (fileUrl) => {
            if (!fileUrl) return;
            try {
                const url = new URL(fileUrl);
                const key = decodeURIComponent(url.pathname.substring(1)); // remove leading slash
                await r2.send(new DeleteObjectCommand({
                    Bucket: env.R2_BUCKET,
                    Key: key,
                }));
            } catch (err) {
                console.error('Failed to delete from S3:', fileUrl, err);
            }
        };

        await deleteS3File(wip.receipt);
        await deleteS3File(wip.delivery);
        await deleteS3File(wip.paynow);

        // update entry in wip table back to ringfence_approved
        // rls only allows approvers to delete
        await supabase
            .from('wip')
            .update({
                status: 'ringfence_approved',
                receipt: '',
                delivery: '',
                paynow: ''
            })
            .eq('id', itemId);

        // send email to partner that claim is rejected
        const partnerBody = `<p>Your Claim Request has been rejected for ${wip.title}.</p><p>Remarks: ${rejectMessage}.</p><p>Please provide the necessary details or clarifications and resubmit at <a href="https://breadbreakers.sg/claim?id=${itemId}">https://breadbreakers.sg/claim?id=${itemId}</a></p>`

        await sendEmail({
            to: partnerEmail,
            subject: `🔴 Claim Rejected for ${wip.title} (${itemId})`,
            body: partnerBody,
            bcc: BREADBREAKERS_EMAIL // for audit trail 
        });

        return json({ message: 'Claim Rejected' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
