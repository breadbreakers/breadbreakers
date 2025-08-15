import { json } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/supabase';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { sendEmail } from '$lib/email.js';
import { SITE_URL } from '$env/static/private';
import { encrypt } from '$lib/crypto.js'

export async function POST(event) {
	const { request } = event;
	try {
		const { swname, swemail, type, region, frequency, period, remarks } = await request.json();

		if (!swname || !swemail || !type || !region || !frequency || !period || !remarks)
			return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

		const supabase = createServerSupabaseClient(event);

		// create entry in expenses
		const { data: householdInsert } = await supabase
			.from('households')
			.insert([
				{
					type,
					frequency,
					period,
					region,
					swemail,
					swname,
					remarks,
					status: 'submitted'
				}
			])
			.select('id')
			.single();

		// send email to sw
        const encryptedID = await encrypt(householdInsert.id);
		const swSubject = `🟠 Recurring Request Submitted (${householdInsert.id})`;

		const swBody = `We've received your Recurring Request and will let you know as soon as we find a volunteer who is able to fulfill the request.<br>
<br>
<strong>Household ID</strong> ${householdInsert.id}<br>
<br>
<strong>Request Type</strong> ${type}<br>
<strong>Frequency</strong> ${frequency}<br>
<strong>Over a period of</strong> ${period}<br>
<strong>Remarks</strong> ${remarks}<br>
<p><a href="${SITE_URL}/adopt/cancel?id=${encodeURIComponent(encryptedID)}" style="color: white; background: red; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-right: 10px; display: inline-block;">Remove Recurring Request</a></p>

Thank you!
`;
		await sendEmail({
			to: swemail,
			subject: swSubject,
			body: swBody,
			bcc: BREADBREAKERS_EMAIL
		});

		// send email to approver (president)
		const { data: getApprover } = await supabase
			.from('approvers')
			.select('*')
			.eq('role', 'president')
			.single();

		let approverEmail = getApprover.email;

		const approverSubject = `🟠 Recurring Request Submitted (${householdInsert.id})`;

		const approverBody = `
<strong>Household ID</strong> ${householdInsert.id}<br>
<br>
<strong>Social Worker Name:</strong> ${swname}<br>
<strong>Social Worker Email:</strong> ${swemail}<br>
<strong>Request Type</strong> ${type}<br>
<strong>Frequency</strong> ${frequency}<br>
<strong>Over a period of</strong> ${period}<br>
<strong>Remarks</strong> ${remarks}<br>
<strong>Verify the social worker’s email domain to ensure it belongs to a recognized organization, and is not a personal email.</strong>
<p><a href="${SITE_URL}/adopt/approve?id=${householdInsert.id}" style="color: white; background: green; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-right: 10px; display: inline-block;">Approve Recurring Request</a></p>
<p><a href="${SITE_URL}/adopt/reject?id=${householdInsert.id}" style="color: white; background: red; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reject Recurring Request</a></p>
        `;

		await sendEmail({
			to: approverEmail,
			subject: approverSubject,
			body: approverBody
		});

		await supabase.rpc('generate_hbx_id');

		return json({ message: 'Recurring Request Submitted' }, { status: 200 });
	} catch (error) {
		console.error('Error sending email:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
