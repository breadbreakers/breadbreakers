import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';

export async function POST(event) {
    const { request } = event;
    let message = "Nil";
    
    try {
        const { itemId, approveMessage } = await request.json();

        if (!approveMessage) {
            message = "Nil";
        } else {
            message = approveMessage;
        }

        if (!itemId)
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

        const supabase = createServerSupabaseClient(event);

        // no need to check if it's approver, because rls only allows approvers to delete from wip

        // check if item is in ringfence_requested state
        // rls only allows logged in user to view their own rows
        const { data: wipStatus } = await supabase
            .from('wip')
            .select('*')
            .eq('id', itemId)
            .single();

        if (wipStatus.status !== "ringfence_requested") {
            return json({ message: 'RItem has not requested for ringfence.' }, { status: 200 });
        }

        const partnerEmail = wipStatus.partner;

        // get the items based on itemId
        let itemData = null;

        const { data: item, error: itemError } = await supabase
            .from('requests')
            .select('*')
            .eq('id', itemId)
            .single();

        itemData = item;

        // update wip table that is approved
        const { data, error } = await supabase
            .from('wip')
            .update({ status: 'ringfence_approved' })
            .eq('id', itemId);

        // update amounts
        const { data: balance, error: balanceError } = await supabase
            .from('balance')
            .select('*')
            .single();

        let balanceN = balance.amount;
        let ringfenceN = balance.ringfence;
        let itemCost = wipStatus.amount;
        const newBalance = balanceN - itemCost;
        const newRingfence = ringfenceN + itemCost;

        const { data : balanceUpdate, balanceUpdateError } = await supabase
            .from('balance')
            .update({ 
                amount: newBalance,
                ringfence: newRingfence
            })
            .eq('amount', balanceN); // use the current value as a filter

        // send email to partner that ringfence is approved
        const partnerBody = `<p>Your Ringfence Request has been approved for ${itemData.title}.</p><p>Remarks: ${message}</p><p>Use <a href="https://breadbreakers.sg/claim?id=${itemData.id}">this form to submit a claims request</a> after the item is procured and delivered.`

        await sendEmail({
            to: partnerEmail, 
            subject: `[Ringfence Approved] ${itemData.title} (${itemId})`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        return json({ message: 'Ringfence Approved' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
