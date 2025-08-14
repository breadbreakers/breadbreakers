import { json } from "@sveltejs/kit";
import { sendEmail } from "$lib/email.js";
import { createServerSupabaseClient } from "$lib/supabase";
import { BREADBREAKERS_EMAIL } from "$lib/strings.js";
import { SITE_URL, R2_ENDPOINT, R2_REGION, R2_ACCESS_ID, R2_SECRET, R2_BUCKET, R2_TEMP_BUCKET } from '$env/static/private';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// === INIT AWS S3 CLIENT ===
const s3 = new S3Client({
  endpoint: R2_ENDPOINT,
  region: R2_REGION,
  credentials: {
    accessKeyId: R2_ACCESS_ID,
    secretAccessKey: R2_SECRET,
  },
});

const BUCKET_NAME = R2_BUCKET;
const TEMP_BUCKET_NAME = R2_TEMP_BUCKET;
const PUBLIC_URL_BASE = 'https://cloud.breadbreakers.sg';

export async function POST(event) {
	const { request } = event;

	let approverEmail;

	try {
		const { itemId, linkUrl, cost, swTempPath, itemCostTempPath, remarks, privacyAnalysis } =
			await request.json();

		if (!itemId || !linkUrl || !cost || !swTempPath || !itemCostTempPath) {
			return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
		}

		if (cost < 0) {
			return json({ error: "Cost cannot be less than 0." }, { status: 409 });
		}

        // === Move files from temp to permanent bucket ===
        const moveFile = async (tempPath) => {
            if (!tempPath) return null;

            const copyParams = {
                Bucket: BUCKET_NAME,
                CopySource: `${TEMP_BUCKET_NAME}/${tempPath}`,
                Key: tempPath,
            };
            await s3.send(new CopyObjectCommand(copyParams));

            return `${PUBLIC_URL_BASE}/${tempPath}`;
        };

        let swConfirmUrl, itemCostUrl;
        try {
            [swConfirmUrl, itemCostUrl] = await Promise.all([
                moveFile(swTempPath),
                moveFile(itemCostTempPath)
            ]);
        } catch (s3Error) {
            console.error("S3 file move failed:", s3Error);
            return json({ error: "Failed to process uploaded files." }, { status: 500 });
        }

		const supabase = createServerSupabaseClient(event);

		const { data: db } = await supabase.rpc("get_dashboard_stats", {
			email: null
		});

		let balanceN = db.balanceData - db.ringfenceN - db.operatingIncoming;

		if (balanceN - cost * 100 < 0) {
			return json({ error: "Insufficient funds!" }, { status: 409 });
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		const partnerEmail = user.email;

		const { data: getApprover } = await supabase
			.from("approvers")
			.select("*")
			.eq("role", "president")
			.single();

		approverEmail = getApprover.email;

		// get approver list and check if partner is inside
		const { data: approverCheck } = await supabase
			.from("approvers")
			.select("*")
			.eq("email", partnerEmail)
			.single();

		// if the partner is the approver, route it to the checker
		if (approverCheck) {
			approverEmail = approverCheck.checker;
		}

		const { data: ringfenceStatus } = await supabase
			.from("wip")
			.select("status")
			.eq("id", itemId)
			.single();

		if (ringfenceStatus !== null) {
			if (ringfenceStatus.status === "ringfence_requested") {
				return json({ error: "Item already ringfenced" }, { status: 409 });
			}

			if (ringfenceStatus.status === "ringfence_approved") {
				return json({ error: "Item is already approved." }, { status: 409 });
			}

			if (ringfenceStatus.status === "claim_requested") {
				return json({ error: "Item is in processing for claims." }, { status: 409 });
			}
		}

		// === Generate privacy warnings HTML ===
		const privacyWarningsHtml = generatePrivacyWarningsHtml(privacyAnalysis);

		// don't need to check if it's a partner, because RLS already checks if logged in user is in the partners table before allowing  insert.

		// get the items based on itemId
		let itemData = null;

		const { data: item } = await supabase.from("requests").select("*").eq("id", itemId).single();

		itemData = item;

		// insert into wip table
		await supabase.from("wip").insert([
			{
				id: itemId,
				status: "ringfence_requested",
				partner: partnerEmail,
				amount: Math.round(cost * 100),
				link: linkUrl,
				swconfirm: swConfirmUrl,
				itemSupport: itemCostUrl,
				title: itemData.title,
				description: itemData.description,
				contact: itemData.contact_clean
			}
		]);

		// send email to partner that ringfence is submitted
		const partnerBody = `
			Dear Partner</p><p>Your Ringfence Request has been sent to ${approverEmail} for approval.<br>
			<strong class="is-underlined">Description:</strong> ${itemData.description}<br>
            <strong class="is-underlined">Contact:</strong> ${itemData.contact_full}<br>
            <strong class="is-underlined">Amount to ringfence inclusive of cost delivery:</strong> $${cost}<br>
            <strong class="is-underlined">To purchase from:</strong> <a href="${linkUrl}">${linkUrl}</a><br>
            <a href="${itemCostUrl}"><strong class="is-underlined">Screenshot of cost with delivery fee</strong></a><br>Is the cost in the screenshot the same as the requested amount?<br>Is the cost reasonable?<br>Is the delivery fee reasonable?<br>
            <a href="${swConfirmUrl}"><strong class="is-underlined">Social worker confirmation</strong></a><br>Did the screenshot specify the item?<br>
            <strong class="is-underlined">Remarks:</strong> ${remarks}<br>
			Please <u>do not</u> proceed with the purchase until the request is approved.<br>
			`;

		await sendEmail({
			to: partnerEmail, // to the partner
			subject: `🟠 Ringfence Request for ${itemData.title} (${itemId})`,
			body: partnerBody,
			bcc: BREADBREAKERS_EMAIL // for audit trail
		});

		// send email to approver
		const approverBody = `
            <strong class="is-underlined">Description:</strong> ${itemData.description}<br>
            <strong class="is-underlined">Contact:</strong> ${itemData.contact_full}<br>
            <strong class="is-underlined">Amount to ringfence inclusive of cost delivery:</strong> $${cost}<br>
            <strong class="is-underlined">To purchase from:</strong> <a href="${linkUrl}">${linkUrl}</a><br>
            <a href="${itemCostUrl}"><strong class="is-underlined">Screenshot of cost with delivery fee</strong></a><br>Is the cost in the screenshot the same as the requested amount?<br>Is the cost reasonable?<br>Is the delivery fee reasonable?<br>
            <a href="${swConfirmUrl}"><strong class="is-underlined">Social worker confirmation</strong></a><br>Did the screenshot specify the item?<br>
            <strong class="is-underlined">Remarks:</strong> ${remarks}<br>
            ${privacyWarningsHtml}
            <p>
                <a href="${SITE_URL}/ringfence/approve?id=${itemData.id}" style="color: white; background: green; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Approve Ringfence</a>
            </p>
            <p>
                <a href="${SITE_URL}/ringfence/reject?id=${itemData.id}" style="color: white; background: red; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Reject Ringfence</a>
            </p>
            `;

		await sendEmail({
			to: approverEmail,
			subject: `🟠 Ringfence Request for ${itemData.title} (${itemId})`,
			body: approverBody,
			replyTo: partnerEmail
		});

		return json({ success: true });
	} catch (error) {
		console.error("Error sending email:", error);
		return json({ error: error.message }, { status: 500 });
	}
}

// Helper to generate privacy warnings HTML for email
function generatePrivacyWarningsHtml(privacyAnalysis) {
	let warningsHtml = "";

	if (privacyAnalysis) {
		privacyAnalysis.forEach((analysis) => {
			if(analysis) {
				const fileType =
				analysis.type === "ringfence_sw" ? "Social Worker Confirmation" : "Cost and Delivery";
			const fileName = analysis.file;
			const result = analysis.result;

			warningsHtml += `
				<strong class="is-underlined">✨ ${fileType} (${fileName}):</strong><br>                
				${result.warnings}
			`;
			}
		});
	}


	return warningsHtml;
}