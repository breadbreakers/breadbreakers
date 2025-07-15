import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

const s3 = new S3Client({
    endpoint: env.R2_ENDPOINT,
    region: env.R2_REGION,
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

        const { data: wip } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        if (wip.status !== 'ringfence_requested') {
            return new Response('<p>Item has not requested for ringfence.</p>', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
        }

        const partnerEmail = wip.partner;
        const partnerBody = `<p>Your Ringfence Request has been rejected for ${wip.title}.</p><p>Remarks: ${rejectMessage}</p><p>Please submit your Ringfence Request again.</p>`;

        // === DELETE FILES FROM S3 ===
        const deleteS3File = async (fileUrl) => {
            if (!fileUrl) return;
            try {
                const url = new URL(fileUrl);
                const key = decodeURIComponent(url.pathname.substring(1)); // remove leading slash
                await s3.send(new DeleteObjectCommand({
                    Bucket: env.R2_BUCKET,
                    Key: key,
                }));
            } catch (err) {
                console.error('Failed to delete from S3:', fileUrl, err);
            }
        };

        await deleteS3File(wip.swconfirm);
        await deleteS3File(wip.itemSupport);

        // === SEND EMAIL ===
        await sendEmail({
            to: partnerEmail,
            subject: `Ringfence Rejected for ${wip.title} (${itemId})`,
            body: partnerBody,
            bcc: BREADBREAKERS_EMAIL,
        });

        // === DELETE ENTRY FROM SUPABASE ===
        const { data, error } = await supabase
            .from('wip')
            .delete()
            .eq('id', itemId);

        return json({ message: 'Ringfence Rejected' }, { status: 200 });

    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
