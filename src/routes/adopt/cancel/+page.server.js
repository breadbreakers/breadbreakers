import { redirect } from '@sveltejs/kit';
import { decrypt } from '$lib/crypto.js';
import { sendEmail } from '$lib/email.js';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { json } from '@sveltejs/kit';

let itemId;

export async function load({ locals, url }) {
	const encryptedId = url.searchParams.get('id');

  if (!encryptedId) {
    throw redirect(303, '/');
  }

  try {
	  itemId = await decrypt(encryptedId);
  } catch (e) {
    throw redirect(303, '/');
  }

	// check if item is in households table
	const { data: wip, error: wipError } = await locals.supabase
		.from('households')
		.select('*')
		.eq('id', itemId)
		.single();

	if (wipError || !wip) throw redirect(303, '/error/not-recurring');

	// send email to SW
	const swSubject = `🔴 Recurring Request Removed (${wip.id})`;

	const swBody = `
      Dear ${wip.swname},<br>
      Your recurring request has been removed.<br>
  `;

	await sendEmail({
		to: wip.swemail,
		subject: swSubject,
		body: swBody,
		bcc: BREADBREAKERS_EMAIL
	});

	// delete from households table
	await locals.supabase.from('households').delete().eq('id', itemId);

	return;
}
