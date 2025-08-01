import { redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
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

export async function load({ locals, url }) {
  // check if logged in
  const session = await locals.getUser?.();
  if (!session) throw redirect(303, '/profile');

  // get user details
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  if (userError || !user) throw redirect(303, '/profile');

  // check if is partner
  const { data: partner, error: partnerError } = await locals.supabase
    .from('partners')
    .select('email')
    .eq('email', user.email)
    .single();

  if (partnerError || !partner) throw redirect(303, '/error/not-partner');

  const partnerEmail = user.email;

  // get the item details based on the get param
  const itemId = url.searchParams.get('id');

  // check if item is in wip not ringfence_requested, ringfence_approved, or claim_requested
  const { data: wip } = await locals.supabase
    .from('wip')
    .select('*')
    .eq('id', itemId)
    .single();

  if (wip === null) {
    throw redirect(303, '/error/not-wip'); // no such wip
  }

  let approverEmail;

  const { data: getApprover } = await locals.supabase
    .from('approvers')
    .select('*')
    .eq('role', 'president')
    .single();

  approverEmail = getApprover.email;

  // get approver list and check if partner is inside
  const { data: approverCheck } = await locals.supabase
    .from('approvers')
    .select('*')
    .eq('email', partnerEmail)
    .single();

  // if the partner is the approver, route it to the checker
  if (approverCheck) {
    approverEmail = approverCheck.checker;
  }

  // send email to partner that ringfence is deleted
  const partnerBody = `<p>Dear Partner</p><p>Your Ringfence Request has been removed.</p>`

  await sendEmail({
    to: partnerEmail, // to the partner
    subject: `🗑️ Ringfence Request Removed for ${wip.title} (${itemId})`,
    body: partnerBody,
    bcc: BREADBREAKERS_EMAIL // for audit trail 
  });

  const approverBody = `
    <p>Parter ${partnerEmail} has removed the Ringfence Request.</p>
    <p><strong class="is-underlined">Item:</strong> ${wip.title}</p>
    <p><strong class="is-underlined">Description:</strong> ${wip.description}</p>
  `;

  await sendEmail({
    to: approverEmail,
    subject: `🗑️ Ringfence Request Removed for ${wip.title} (${itemId})`,
    body: approverBody,
    replyTo: partnerEmail
  });

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


  await locals.supabase
    .from('wip')
    .delete()
    .eq('id', itemId);

  // Return only validated data
  throw redirect(303, "/profile");
}
