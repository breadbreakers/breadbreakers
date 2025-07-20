import { json } from "@sveltejs/kit";
import { sendEmail } from "$lib/email.js";
import { createServerSupabaseClient } from "$lib/supabase";
import { BREADBREAKERS_EMAIL } from "$lib/strings.js";

export async function POST(event) {
	const { request } = event;

	try {
		const { itemId, approveMessage } = await request.json();

		const message = approveMessage || "Nil";

		if (!itemId)
			return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });

		const supabase = createServerSupabaseClient(event);

		// no need to check if it's approver, because rls only allows approvers to delete from wip

		// check if item is in ringfence_requested state
		// rls only allows logged in user to view their own rows
		const { data: wip } = await supabase.from("wip").select("*").eq("id", itemId).single();

		if (wip.status !== "ringfence_requested") {
			return json({ message: "Item has not requested for ringfence." }, { status: 200 });
		}

		const partnerEmail = wip.partner;

		// update wip table that is approved
		await supabase.from("wip").update({ status: "ringfence_approved" }).eq("id", itemId);

		// send email to partner that ringfence is approved
		const partnerBody = `<p>Your Ringfence Request has been approved for ${wip.title}.</p><p>Remarks: ${message}</p><p>Next steps:<br>- Purchase and arrange for delivery of the requested item <strong>using PayNow</strong>. Non-PayNow purchases cannot be re-imbursed.</a>.<br>- Retain the receipt/invoice and ensure the beneficiaries delivery address is stated.<br>- Once the item is delievered, obtain proof of delivery from the social worker through email or WhatsApp.<br>- Request for reimbursement using the receipt and proof of delivery <a href="https://breadbreakers.sg/claim?id=${wip.id}">using this link</a>.`;

		await sendEmail({
			to: partnerEmail,
			subject: `Ringfence Approved for ${wip.title} (${itemId})`,
			body: partnerBody,
			bcc: BREADBREAKERS_EMAIL // for audit trail
		});

		return json({ message: "Ringfence Approved" }, { status: 200 });
	} catch (error) {
		console.error("Error sending email:", error);
		return json({ error: error.message }, { status: 500 });
	}
}
