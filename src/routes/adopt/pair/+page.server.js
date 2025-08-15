import { redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';

export async function load({ locals, url }) {

  const itemId = url.searchParams.get('id');

  // check if logged in
  const session = await locals.getUser?.();
  if (!session) {
    const redirectTo = url.pathname + url.search;
    const encodedRedirectTo = encodeURIComponent(redirectTo);
    throw redirect(303, `/profile?redirectTo=${encodedRedirectTo}`);
  }

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

  let partnerEmail = user.email;

  // check if item is in households and open
  const { data: households, error: householdsError } = await locals.supabase
    .from('households')
    .select('*')
    .eq('id', itemId)
    .single();

  if (householdsError || !households) throw redirect(303, '/error/not-recurring');

  if (households.status !== "open") {
    throw redirect(303, '/error/not-recurring');
  }

  // set to 'paired'
  await locals.supabase
    .from('households')
    .update({ status: 'paired' })
    .eq('id', itemId);

  // send email to partner and sw
  const emailBody = `Dear ${households.swname},<br>
A volunteer (cc-ed in this email) is able fulfill the following the request.<br>
Could you kindly provide the relevant delivery contact details to help with coordination?<br>
<strong>Request Type</strong> ${households.type}<br>
<strong>Quantity</strong> ${households.qty}<br>
<strong>Frequency</strong> ${households.frequency}<br>
<strong>Over a period of</strong> ${households.period}<br>
<strong>Link to purchase</strong> ${households.link}<br>
<strong>Remarks</strong> ${households.remarks}<br>
<br>
We’re happy this match could be made. Thank you for your continued support!<br>
<br>
Best regards,<br>
Bread Breakers (SG)`

  await sendEmail({
    to: households.swemail, 
    subject: `🤚🏻 Volunteer Available to Fulfill Request (${households.id})`,
    body: emailBody,
    cc: partnerEmail,
    bcc: BREADBREAKERS_EMAIL
  });

  return { session, user };
}
