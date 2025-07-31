import { json } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/supabase';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { sendEmail } from '$lib/email.js';
import { env } from '$env/dynamic/private';

export async function POST(event) {
    const { request } = event;
    try {

        const { qty, swname, swemail, type, region, frequency, period, link, remarks } = await request.json();

        if (!qty || !swname || !swemail || !type || !region || !frequency || !period || !remarks)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        // create entry in expenses
        const { data: householdInsert } = await supabase
            .from('households')
            .insert([
                {
                    type,
                    qty,
                    frequency,
                    period,
                    region,
                    swemail,
                    swname,
                    link,
                    remarks,
                    status: "submitted"
                }
            ])
            .select('id')
            .single();

        // send email to sw
        const swSubject = `Recurring Request Submitted (${householdInsert.id})`

        const swBody = `We've received your Recurring Request and will let you know as soon as we find a volunteer who is able to fulfill the request.<br>
<br>
<strong class="is-underlined">Request Type</strong> ${type}<br>
<strong class="is-underlined">Quantity</strong> ${qty}<br>
<strong class="is-underlined">Frequency</strong> ${frequency}<br>
<strong class="is-underlined">Over a period of</strong> ${period}<br>
<strong class="is-underlined">Link to purchase</strong> ${link}<br>
<strong class="is-underlined">Remarks</strong> ${remarks}<br>
Thank you!
`;
        await sendEmail({
            to: swemail,
            subject: swSubject,
            body: swBody,
            bcc: BREADBREAKERS_EMAIL,
        });

        // send email to approver (president)

        const { data: getApprover } = await supabase
            .from('approvers')
            .select('*')
            .eq('role', 'president')
            .single();

        let approverEmail = getApprover.email;

        const approverSubject = `Recurring Request Submitted (${householdInsert.id})`;

        const approverBody = `
            <strong class="is-underlined">Social Worker Name:</strong> ${swname}<br>
            <strong class="is-underlined">Social Worker Email:</strong> ${swemail}<br>
            <strong class="is-underlined">Request Type</strong> ${type}<br>
            <strong class="is-underlined">Quantity</strong> ${qty}<br>
            <strong class="is-underlined">Frequency</strong> ${frequency}<br>
            <strong class="is-underlined">Over a period of</strong> ${period}<br>
            <strong class="is-underlined">Link to purchase</strong> ${link}<br>
            <strong class="is-underlined">Remarks</strong> ${remarks}<br>
            <p><a href="${env.SITE_URL}/adopt/approve?id=${householdInsert.id}" style="color: white; background: green; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-right: 10px; display: inline-block;">Approve Recurring Request</a></p>
            <p><a href="${env.SITE_URL}/adopt/reject?id=${householdInsert.id}" style="color: white; background: red; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reject Recurring Request</a></p>
        `;

        await sendEmail({
            to: approverEmail,
            subject: approverSubject,
            body: approverBody,
        });

        await supabase.rpc('generate_hbx_id');

        return json({ message: 'Recurring Request Submitted' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}