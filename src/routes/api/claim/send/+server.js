import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/supabase';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { SITE_URL, R2_ENDPOINT, R2_REGION, R2_ACCESS_ID, R2_SECRET, R2_BUCKET, R2_TEMP_BUCKET, KEY } from '$env/static/private';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// S3 Client
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

// Helper to generate privacy warnings HTML for email
function generatePrivacyWarningsHtml(privacyAnalysis) {
	let warningsHtml = '';

	if (privacyAnalysis) {
		privacyAnalysis.forEach((analysis) => {
			if (analysis) {
				const fileType = analysis.type === 'claim_receipt' ? 'Receipt' : 'Proof of Delivery';
				const fileName = analysis.file;
				const result = analysis.result;

				warningsHtml += `
					<strong>✨ ${fileType} (${fileName}):</strong><br>                
					${result.warnings}
				`;
			}
		});
	}

	return warningsHtml;
}

export const POST = async (event) => {
	const { request } = event;
	let approverEmail;
	let paynow;
	let wip;

	try {
		const { itemId, receiptTempPath, deliveryTempPath, cost, privacyAnalysis } = await request.json();

		if (!itemId || !receiptTempPath || !deliveryTempPath || !cost) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Move files from temp to permanent storage
        const moveFile = async (tempPath) => {
            if (!tempPath) return null;
            const copyParams = { Bucket: BUCKET_NAME, CopySource: `${TEMP_BUCKET_NAME}/${tempPath}`, Key: tempPath };
            await s3.send(new CopyObjectCommand(copyParams));
            const deleteParams = { Bucket: TEMP_BUCKET_NAME, Key: tempPath };
            await s3.send(new DeleteObjectCommand(deleteParams));
            return `${PUBLIC_URL_BASE}/${tempPath}`;
        };

        let receiptUrl, deliveryUrl;
        try {
            [receiptUrl, deliveryUrl] = await Promise.all([
                moveFile(receiptTempPath),
                moveFile(deliveryTempPath)
            ]);
        } catch (s3Error) {
            console.error("S3 file move failed:", s3Error);
            return json({ error: "Failed to process uploaded files." }, { status: 500 });
        }

		const supabase = createServerSupabaseClient(event);
		const {
			data: { user }
		} = await supabase.auth.getUser();
		const partnerEmail = user.email;

		const { data: processClaim, error: processClaimError } = await supabase.rpc('process_claim', {
			partner_email: partnerEmail,
			item_id: itemId
		});

		if (processClaimError) {
			console.error(processClaimError);
		} else {
			approverEmail = processClaim.approverEmail;
			paynow = processClaim.paynow;
			wip = processClaim.wip;
		}

		if (wip.status !== 'ringfence_approved') {
			return json(
				{ error: 'Item cannot be claimed as there is no ringfence approval.' },
				{ status: 409 }
			);
		}

		if (wip.amount !== Math.round(cost * 100)) {
			return json({ error: 'Claim amount not the same as ringfenced amount.' }, { status: 409 });
		}

		if (wip.partner !== partnerEmail) {
			return json(
				{ error: 'You are not the approved partner who ringfenced this item.' },
				{ status: 409 }
			);
		}

		// === Generate PayNow QR and Upload to R2 ===

		const sgqrResponse = await fetch('https://sgqr.breadbreakers.sg', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': KEY
			},
			body: JSON.stringify({
				paynow,
				cost,
				itemId
			})
		});

		// Read response JSON
		const data = await sgqrResponse.json();

        const paynowQRImage = data.imageUrl;

		// === Update WIP ===
		await supabase
			.from('wip')
			.update({
				status: 'claim_requested',
				delivery: deliveryUrl,
				receipt: receiptUrl,
				paynow: paynowQRImage
			})
			.eq('id', itemId);

		// === Generate privacy warnings HTML ===
		const privacyWarningsHtml = generatePrivacyWarningsHtml(privacyAnalysis);

		// === Notify partner ===
		const partnerSubject = `🟠 Claim Submitted for ${wip.title}`;

		const partnerBody = `Your Claim Request has been sent to ${approverEmail} for approval.`;

		await sendEmail({
			to: partnerEmail,
			subject: partnerSubject,
			body: partnerBody,
			bcc: BREADBREAKERS_EMAIL
		});

		// === Notify approver with privacy analysis ===
		const approverSubject = `🟠 Claim Request for ${wip.title} (${wip.id})`;

		const approverBody = `
            <strong>Requester:</strong> ${partnerEmail}<br>
            <strong>Description:</strong> ${wip.description}<br>
            <strong>Contact:</strong> ${wip.contact}<br>
            <a href="${receiptUrl}"><strong>Redacted Receipt</strong></a><br>
            - Is the item the same as the description above?<br>
            <a href="${deliveryUrl}"><strong>Proof of Delivery</strong></a><br>
            - Did the social worker verify the item is received?<br>
            <strong>Requested claim:</strong> $${cost}<br>
            <strong>Paynow mobile number:</strong> ${paynow}<br>
            
            ${privacyWarningsHtml}
            
            <img src="${paynowQRImage}" alt="PayNow QR Code" style="width:200px;height:200px;" /><br>
            
            <p><a href="${SITE_URL}/claim/approve?id=${wip.id}" style="color: white; background: green; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-right: 10px; display: inline-block;">Approve Claim</a></p>
            <p><a href="${SITE_URL}/claim/reject?id=${wip.id}" style="color: white; background: red; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reject Claim</a></p>
        `;

		await sendEmail({
			to: approverEmail,
			subject: approverSubject,
			body: approverBody
		});

		return json({
			success: true,
			privacyWarnings: null
		});
	} catch (err) {
		console.error('Claim submission error:', err);
		return json({ error: err.message }, { status: 500 });
	}
};