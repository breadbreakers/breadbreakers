import { redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';

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
  const { data: wip, error: wipError } = await locals.supabase
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
    subject: `Ringfence Request Removed for ${wip.title} (${itemId})`,
    body: partnerBody,
    bcc: BREADBREAKERS_EMAIL // for audit trail 
  });

  const approverBody = `
    <p>Parter ${partnerEmail} has removed the Ringfence Request.</p>
    <p><strong>Item:</strong> ${wip.title}</p>
    <p><strong>Description:</strong> ${wip.description}</p>
  `;

  await sendEmail({
    to: approverEmail,
    subject: `Ringfence Request Removed for ${wip.title} (${itemId})`,
    body: approverBody,
    replyTo: partnerEmail
  });

  const { data: deleteResult, error: deleteError } = await locals.supabase
    .from('wip')
    .delete()
    .eq('id', itemId);

  // Return only validated data
  throw redirect(303, "/profile");
}
