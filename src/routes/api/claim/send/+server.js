import { json } from '@sveltejs/kit';
import { google } from 'googleapis';
import { sendEmail } from '$lib/email.js';
import { env } from '$env/dynamic/private';
import { createServerClient } from '@supabase/ssr';
import { generatePayNowStr } from '$lib/paynow.js';
import QRCode from 'qrcode';
import { Readable } from 'stream';

export const POST = async (event) => {
    const { request } = event;
    let ringfencedAmount;
    const label = "QR";
    const FOLDER_ID = env.GOOGLE_DRIVE_FOLDER_ID;

    try {
        const { itemId, receiptUrl, deliveryUrl, cost } = await request.json();

        // TODO need to add this server side check also for ringfence and offer send, to prevent param injection
        if (!itemId || !receiptUrl || !deliveryUrl || !cost) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const supabase = createServerClient(
            env.SUPABASE_URL,
            env.SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll: () => event.cookies.getAll(),
                    setAll: (cookiesToSet) => {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            event.cookies.set(name, value, options);
                        });
                    }
                }
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: ringfenceStatus } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        // make sure ringfence is approved
        if (ringfenceStatus.status !== "ringfence_approved") {
            return json({ error: 'Item cannot be claimed as there is no ringfence approval.' }, { status: 409 });
        }

        // make sure claim abount == ringfence amount
        ringfencedAmount = ringfenceStatus.amount;
        
        if (parseFloat(ringfencedAmount) !== parseFloat(cost)) {
            return json({ error: 'Claim amount not the same as ringfenced amount.' }, { status: 409 });
        }

        // check if logged in person requesting claim for this item is the assigned partner 
        const { data: approvedPartner } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        if (approvedPartner.partner !== partnerEmail) {
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

        // insert into wip table
        const { data } = await supabase
            .from('wip')
            .update([
                {
                    status: "claim_requested"
                }
            ])
            .eq('id', itemId);

        // setup paynow
        const QRstring = generatePayNowStr({
            mobile: partnerPaynow.paynow,
            amount: cost,
            editable: false,
            expiry: getOneMonthLaterYYYYMMDD(),
            refNumber: itemId,
        });

        const qrImageDataURL = await QRCode.toDataURL(QRstring); // This is your image 
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
                name: `${label}_${Date.now()}.png`,
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

        // send email to partner that claim is succesfully submitted
        const partnerBody = `Your Claim Request has been sent for approval.`
        await sendEmail({
            to: partnerEmail, 
            subject: `[Claim Submitted] ${itemData.title}`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        // send email to approver
        const approverBody = `
            <h2>To Approve: ${itemData.title}</h2>
            <p><strong>Requester:</strong> ${partnerEmail}</p>
            <p><strong>Description:</strong> ${itemData.description}</p>
            <p><strong>Contact:</strong> ${itemData.contact_clean}</p>
            <p><strong>Receipt:</strong> <a href="${receiptUrl}">Receipt</a></p>
            <p><strong>Delivery:</strong> <a href="${deliveryUrl}">Deliver</a></p>
            <p><strong>Requested claim: </strong>$${cost}</p>
            <p><strong>Paynow to:</strong>${partnerPaynow.paynow}</p>
            <p>Scan this QR code to reimburse via PayNow:</p>
            <img src="https://drive.google.com/uc?id=${fileId}" alt="PayNow QR Code" style="width:200px;height:200px;" />
            <p>
            <a href="http://localhost:5173/api/claim/reject?${itemData.id}" style="color: white; background: red; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Reject</a>
            </p>
            `;
        /*await sendEmail({
            to: 'hello@breadbreakers.sg',
            subject: `[For Approval] Claim for ${itemData.title} (${itemData.id})`,
            body: approverBody,
        });*/

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