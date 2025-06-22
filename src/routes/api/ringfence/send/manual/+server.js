import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';
import { getSgTime } from '$lib/sgtime'
import { PUBLIC_SITE_URL } from "$env/static/public";

export async function POST(event) {
    const { request } = event;

    let approverEmail;

    try {
        const { itemId, linkUrl, cost, swConfirmUrl, itemCostUrl, itemTitle, itemDesc, itemContact, privacyAnalysis } = await request.json();

        if (!itemId || !linkUrl || !cost || !swConfirmUrl || !itemCostUrl || !itemTitle || !itemDesc || !itemContact) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        if (cost < 0) {
            return json({ error: 'Cost cannot be less than 0.' }, { status: 409 });
        }

        const supabase = createServerSupabaseClient(event);

        const { data : db, error : dbError } = await supabase.rpc('get_dashboard_stats', {
            email: null
        });

        let balanceN = db.balanceData - db.ringfenceN - db.operatingIncoming;

        if (balanceN - (cost * 100) < 0) {
            return json({ error: 'Insufficient funds!' }, { status: 409 });
        }

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

        // if the partner is the approver, route it to the checker
        if (approverCheck) {
            approverEmail = approverCheck.checker;
        }

        // === Generate privacy warnings HTML ===
        const privacyWarningsHtml = generatePrivacyWarningsHtml(privacyAnalysis);

        // populate the item
        let itemData = {
            title: itemTitle,
            description: itemDesc,
            contact_clean: itemContact,
            id: itemId
        };

        // insert into wip table
        const { data : wipInsert, error: wipError } = await supabase
            .from('wip')
            .insert([
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

        // insert into requests_manual table
        const { data : reqInsert, error: reqError } = await supabase
            .from('requests_manual')
            .insert([
                {
                    id: itemId,
                    date: getSgTime().substring(0, 10),
                    title: itemData.title,
                    description: itemData.description,
                    contact_clean : itemData.contact_clean                    
                }
            ]);

        // send email to partner that ringfence is submitted
        const partnerBody = `<p>Dear Partner</p><p>Your Ringfence Request has been sent to ${approverEmail} for approval.</p><p>Please <u>do not</u> proceed with the purchase until the request is approved.</p>`

        await sendEmail({
            to: partnerEmail, // to the partner
            subject: `Ringfence Request for ${itemData.title} (${itemId})`,
            body: partnerBody,
            bcc: BREADBREAKERS_EMAIL // for audit trail 
        });

        // send email to approver
        const approverBody = `
            <strong>Description:</strong> ${itemData.description}<br>
            <strong>Contact:</strong> ${itemData.contact_clean}<br>
            <strong>Amount to ringfence inclusive of cost delivery:</strong> $${cost}<br>
            <strong>To purchase from:</strong> <a href="${linkUrl}">${linkUrl}</a><br>Is the purchase from an <a href="https://breadbreakers.sg/governance/procurement">authorised retailer</a>? If not, is it explicitly requested from the Social Worker?<br>
            <a href="${itemCostUrl}"><strong>Screenshot of cost with delivery fee</strong></a><br>Is the cost in the screenshot the same as the requested amount?<br>Is the cost reasonable?<br>Is the delivery fee reasonable?<br>
            <a href="${swConfirmUrl}"><strong>Social worker confirmation</strong></a><br>Did the social worker provide the necessary contact information?<br>Did the screenshot specify the item?<br>
            ${privacyWarningsHtml}
            <p>
                <a href="${PUBLIC_SITE_URL}/ringfence/approve?id=${itemData.id}" style="color: white; background: green; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Approve Ringfence</a>
            </p>
            <p>
                <a href="${PUBLIC_SITE_URL}/ringfence/reject?id=${itemData.id}" style="color: white; background: red; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Reject Ringfence</a>
            </p>
            `;

        await sendEmail({
            to: approverEmail,
            subject: `Ringfence Request for ${itemData.title} (${itemId})`,
            body: approverBody,
            replyTo: partnerEmail
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}

// Helper to generate privacy warnings HTML for email
function generatePrivacyWarningsHtml(privacyAnalysis) {
    let warningsHtml = '';

    privacyAnalysis.forEach((analysis, index) => {
        const fileType = analysis.type === 'ringfence_sw' ? 'Social Worker Confirmation' : 'Cost and Delivery';
        const fileName = analysis.file;
        const result = analysis.result;
   
        warningsHtml += `
            <strong>✨ ${fileType} (${fileName}):</strong><br>                
            ${result.warnings}
        `;        
    });

    return warningsHtml;
}