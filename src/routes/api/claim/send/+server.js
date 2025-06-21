import { json } from '@sveltejs/kit';
import { google } from 'googleapis';
import { sendEmail } from '$lib/email.js';
import { env } from '$env/dynamic/private';
import { Readable } from 'stream';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import * as sgqr from 'sgqr';
import sharp from 'sharp';
import { PUBLIC_SITE_URL } from "$env/static/public";

// Helper to create or get folder
async function getOrCreateFolder(name, parentId, drive) {
    const query = `'${parentId}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const res = await drive.files.list({ q: query, fields: 'files(id)' });

    if (res.data.files.length > 0) return res.data.files[0].id;

    const folder = await drive.files.create({
        requestBody: {
            name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
        },
        fields: 'id',
    });

    return folder.data.id;
}

// Helper to generate privacy warnings HTML for email
function generatePrivacyWarningsHtml(privacyAnalysis) {
    let warningsHtml = '';

    privacyAnalysis.forEach((analysis, index) => {
        const fileType = analysis.type === 'claim_receipt' ? 'Receipt' : 'Proof of Delivery';
        const fileName = analysis.file;
        const result = analysis.result;
   
        warningsHtml += `
            <strong>${fileType} (${fileName}):</strong><br>                
            ${result.warnings}
        `;        
    });

    return warningsHtml;
}

export const POST = async (event) => {
    const { request } = event;
    const FOLDER_ID = env.GOOGLE_DRIVE_FOLDER_ID;

    try {
        const { itemId, receiptUrl, deliveryUrl, cost, privacyAnalysis } = await request.json();

        if (!itemId || !receiptUrl || !deliveryUrl || !cost) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = createServerSupabaseClient(event);
        const { data: { user } } = await supabase.auth.getUser();
        const partnerEmail = user.email;

        const { data: getApprover } = await supabase
            .from('approvers')
            .select('*')
            .eq('role', 'president')
            .single();

        let approverEmail = getApprover.email;

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

        if (wip.status !== "ringfence_approved") {
            return json({ error: 'Item cannot be claimed as there is no ringfence approval.' }, { status: 409 });
        }

        if (wip.amount !== Math.round(cost * 100)) {
            return json({ error: 'Claim amount not the same as ringfenced amount.' }, { status: 409 });
        }

        if (wip.partner !== partnerEmail) {
            return json({ error: 'You are not the approved partner who ringfenced this item.' }, { status: 409 });
        }

        const { data: partnerPaynow } = await supabase
            .from('partners')
            .select('paynow')
            .eq('email', partnerEmail)
            .single();

        // === Generate and Resize PayNow QR ===
        const payload = await sgqr.generate_code({
            number: `+65${partnerPaynow.paynow}`,
            amount: cost.toString(),
            type: 'image/png',
            comments: itemId,
        });

        const inputBuffer = Buffer.from(payload);
        const metadata = await sharp(inputBuffer).metadata();
        const resizedBuffer = await sharp(inputBuffer)
            .resize({
                width: Math.round(metadata.width * 0.05),
                withoutEnlargement: true,
            })
            .png()
            .toBuffer();

        const stream = Readable.from(resizedBuffer);

        // === Set up Google Drive Auth ===
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: env.GOOGLE_CLIENT_EMAIL,
                private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // === Get folder structure yyyy/MM Month ===
        const now = new Date();
        const year = now.getFullYear().toString();
        const monthNum = String(now.getMonth() + 1).padStart(2, '0');
        const monthName = now.toLocaleString('default', { month: 'long' });
        const monthFolderName = `${monthNum} ${monthName}`;

        const yearFolderId = await getOrCreateFolder(year, FOLDER_ID, drive);
        const monthFolderId = await getOrCreateFolder(monthFolderName, yearFolderId, drive);

        // === Upload file to Drive ===
        const driveResponse = await drive.files.create({
            requestBody: {
                name: `${itemId}_claim_paynow_${Date.now()}.png`,
                mimeType: 'image/png',
                parents: [monthFolderId],
            },
            media: {
                mimeType: 'image/png',
                body: stream,
            },
            fields: 'id',
        });

        const fileId = driveResponse.data.id;

        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const paynowQRImage = `https://drive.google.com/uc?id=${fileId}`;

        // === Update WIP ===
        await supabase
            .from('wip')
            .update({
                status: "claim_requested",
                delivery: deliveryUrl,
                receipt: receiptUrl,
            })
            .eq('id', itemId);

        // === Generate privacy warnings HTML ===
        const privacyWarningsHtml = generatePrivacyWarningsHtml(privacyAnalysis);

        // === Notify partner ===
        const partnerSubject = `Claim Submitted for ${wip.title}`

        const partnerBody = `Your Claim Request has been sent to ${approverEmail} for approval.`;

        await sendEmail({
            to: partnerEmail,
            subject: partnerSubject,
            body: partnerBody,
            bcc: BREADBREAKERS_EMAIL,
        });

        // === Notify approver with privacy analysis ===
        const approverSubject = `Claim Request for ${wip.title} (${wip.id})`;

        const approverBody = `
            <strong>Requester:</strong> ${partnerEmail}<br>
            <strong>Description:</strong> ${wip.description}<br>
            <strong>Contact:</strong> ${wip.contact}<br>
            <a href="${receiptUrl}"><strong>Redacted Receipt</strong></a><br>
            - Is the item the same as the description above?<br>
            <a href="${deliveryUrl}"><strong>Proof of Delivery</strong></a><br>
            - Did the social worker verify the item is received?<br>
            <strong>Requested claim:</strong> $${cost}<br>
            <strong>Paynow mobile number:</strong> ${partnerPaynow.paynow}<br>
            
            ${privacyWarningsHtml}
            
            <img src="${paynowQRImage}" alt="PayNow QR Code" style="width:200px;height:200px;" /><br>
            
            <p><a href="${PUBLIC_SITE_URL}/claim/approve?id=${wip.id}" style="color: white; background: green; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-right: 10px; display: inline-block;">Approve Claim</a></p>
            <p><a href="${PUBLIC_SITE_URL}/claim/reject?id=${wip.id}" style="color: white; background: red; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reject Claim</a></p>
        `;

        await sendEmail({
            to: approverEmail,
            subject: approverSubject,
            body: approverBody,
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