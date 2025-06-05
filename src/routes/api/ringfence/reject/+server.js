import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseClient } from '$lib/server/supabase.server';

export async function POST(event) {
    const { request } = event;

    try {

        const { itemId, rejectMessage } = await request.json();

        if (!itemId || !rejectMessage)
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
            return new Response('<p>Item has not requested for ringfence.</p>', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            });
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

        // update amounts
        const { data: balance, error: balanceError } = await supabase
            .from('balance')
            .select('*')
            .single();

        let balanceN = balance.amount;
        let ringfenceN = balance.ringfence;
        let itemCost = wipStatus.amount;
        
        // rejected ringfence - add back to total balance
        const newBalance = balanceN + (itemCost * 100);
        const newRingfence = ringfenceN - (itemCost * 100);

        const { data : balanceUpdate, balanceUpdateError } = await supabase
            .from('balance')
            .update({ 
                amount: newBalance,
                ringfence: newRingfence
            })
            .eq('amount', balanceN); // use the current value as a filter

        // delete entry in wip table
        // rls only allows approvers to delete
        const { data, error } = await supabase
            .from('wip')
            .delete()
            .eq('id', itemId);    

        // send email to partner that ringfence is rejected
        const partnerBody = `<p>Your Ringfence Request has been rejected for ${itemData.title}.</p><p>Remarks: ${rejectMessage}</p><p>Please submit your Ringfence Request again.</p>`

        await sendEmail({
            to: partnerEmail,
            subject: `Ringfence Rejected for ${itemData.title} (${itemId})`,
            body: partnerBody,
            bcc: 'hello@breadbreakers.sg' // for audit trail 
        });

        return json({ message: 'Ringfence Rejected' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
