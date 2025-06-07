import { json } from '@sveltejs/kit';
import { google } from 'googleapis';
import { sendEmail } from '$lib/email.js';
import { env } from '$env/dynamic/private';
import { generatePayNowStr } from '$lib/paynow.js';
import QRCode from 'qrcode';
import { Readable } from 'stream';
import { createServerSupabaseClient } from '$lib/server/supabase.server';

export const POST = async (event) => {
    const { request } = event;
    const FOLDER_ID = env.GOOGLE_DRIVE_FOLDER_ID;

    let ringfencedAmount;
    let approverEmail;

    try {
        const { itemId, receiptUrl, deliveryUrl, cost } = await request.json();

        if (!itemId || !receiptUrl || !deliveryUrl || !cost) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const supabase = createServerSupabaseClient(event);

        const { data: { user } } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: getApprover } = await supabase
            .from('approvers')
            .select('*')
            .eq('role', 'president')
            .single();

        approverEmail = getApprover.email;

        // get approver list and check if partner is inside
        const { data: approverCheck } = await supabase
            .from('approvers')
            .select('*')
            .eq('email', partnerEmail)
            .single();

        if (approverCheck) {
            approverEmail = approverCheck.checker;
        }

        const { data: wip } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        // make sure ringfence is approved
        if (wip.status !== "ringfence_approved") {
            return json({ error: 'Item cannot be claimed as there is no ringfence approval.' }, { status: 409 });
        }

        // make sure claim abount == ringfence amount
        ringfencedAmount = wip.amount;
        
        if (parseInt(ringfencedAmount) !== parseInt(cost * 100)) {
            return json({ error: 'Claim amount not the same as ringfenced amount.' }, { status: 409 });
        }

        // check if logged in person requesting claim for this item is the assigned partner 
        if (wip.partner !== partnerEmail) {
            return json({ error: 'You are not the approved partner who ringfenced this item.' }, { status: 409 });
        }

        // get the partner paynow
        const { data: partnerPaynow } = await supabase
            .from('partners')
            .select('paynow')
            .eq('email', partnerEmail)
            .single();

        // get the items based on itemId
        let itemData = null;

        const { data: item, error: itemError } = await supabase
            .from('requests')
            .select('*')
            .eq('id', itemId)
            .single();

        itemData = item;

        // setup paynow
        const QRstring = generatePayNowStr({
            mobile: partnerPaynow.paynow,
            amount: cost,
            editable: false,
            expiry: getOneMonthLaterYYYYMMDD(),
            refNumber: itemId,
        });

        const qrImageDataURL = await QRCode.toDataURL(QRstring);
        const base64Data = qrImageDataURL.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const stream = Readable.from(buffer);

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_CLIENT_EMAIL,
                private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Upload the file
        const driveResponse = await drive.files.create({
            requestBody: {
                name: `QR_${Date.now()}.png`,
                mimeType: 'image/png',
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: 'image/png',
                body: stream,
            },
            fields: 'id',
        });

        const fileId = driveResponse.data.id;

        // Set permission to public
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Return public image link
        const paynowQRImage = `https://drive.google.com/uc?id=${fileId}`;

        // insert into wip table
        const { data } = await supabase
            .from('wip')
            .update([
                {
                    status: "claim_requested",
                    delivery: deliveryUrl,
                    receipt: receiptUrl
                }
            ])
            .eq('id', itemId);

        // send email to partner that claim is succesfully submitted
        const partnerBody = `Your Claim Request has been sent for approval.`
        await sendEmail({
            to: partnerEmail, 
            subject: `Claim Submitted for ${itemData.title}`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        // send email to approver
        const approverBody = `
            <p><strong>Requester:</strong> ${partnerEmail}</p>
            <p><strong>Description:</strong> ${itemData.description}</p>
            <p><strong>Contact:</strong> ${itemData.contact_clean}</p>
            <p><a href="${receiptUrl}"><strong>Receipt</strong></a><br>Verify that all personal data has been redacted. Verify that the item matches the request.</p>
            <p><a href="${deliveryUrl}"><strong>Proof of Delivery</strong></a><br>Verify that all personal data has been redacted.</p>
            <p><strong>Requested claim:</strong> $${cost}<br>Verify that the cost is reasonable for the item.</p>
            <p><strong>Paynow mobile number:</strong> ${partnerPaynow.paynow}</p>
	        <img src="${paynowQRImage}" alt="PayNow QR Code" style="width:200px;height:200px;" />
            <p><a href="https://breadbreakers.sg/claim/approve?id=${itemData.id}" style="color: white; background: green; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Approve</a></p>
            <p><a href="https://breadbreakers.sg/claim/reject?id=${itemData.id}" style="color: white; background: red; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Reject</a></p>
            `;
   
        await sendEmail({
            to: approverEmail,
            subject: `Claim Request for ${itemData.title} (${itemData.id})`,
            body: approverBody,
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};

function getOneMonthLaterYYYYMMDD() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}