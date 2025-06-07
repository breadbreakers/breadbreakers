import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseService } from '$lib/server/supabase.server';
import { encrypt } from '$lib/crypto';
import { getSgTime } from '$lib/sgtime';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(event) {
  const { request } = event;

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️ Missing Stripe webhook signature or secret.');
    throw error(400, 'Invalid request');
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.warn('⚠️ Webhook signature verification failed.', err.message);
    throw error(400, 'Invalid request');
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const sgTime = getSgTime();
      const amount = stripeEvent.data.object.amount_total;
      const donor = stripeEvent.data.object.customer_details.email;
      const encryptedDonor = stripeEvent.data.object.id;
      const supabase = createServerSupabaseService(event);

      // Insert donation record
      const { data: expense, error: insertError } = await supabase
        .from('incoming')
        .insert([
          {
            source: `Donation`,
            id: encryptedDonor,
            amount,
            approveremail: donor,
            timestamp: sgTime
          }
        ]);

      if (insertError) {
        console.error('Error inserting donation:', insertError);
      }

      // get fees and insert into expenses
      const paymentIntentId = stripeEvent.data.object.payment_intent;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const chargeId = paymentIntent.charges.data[0]?.id;
      const charge = await stripe.charges.retrieve(chargeId);
      const balanceTxId = charge.balance_transaction;
      const balanceTx = await stripe.balanceTransactions.retrieve(balanceTxId);
      const stripeFee = balanceTx.fee; // in cents

      const { data: feeExpense, error: feeError } = await supabase
        .from('expenses')
        .insert([
          {
            description: `Stripe Processing Fee`,
            amount: stripeFee,
            approveremail: donor,
            link: encryptedDonor,
            timestamp: sgTime
          }
        ]);

      // Update internal balance table
      const { data: balance, error: balanceError } = await supabase
        .from('balance')
        .select('amount')
        .single();

      if (!balance || balanceError) {
        console.error('Error retrieving balance:', balanceError);
      } else {
        const balanceN = balance.amount;
        const newBalance = balanceN + amount - stripeFee;

        const { error: updateError } = await supabase
          .from('balance')
          .update({ amount: newBalance })
          .eq('amount', balanceN); // use optimistic update

        if (updateError) {
          console.error('Error updating balance:', updateError);
        }
      }

      // Send thank-you email
      const dollarAmount = (amount / 100).toFixed(2);
      await sendEmail({
        to: donor,
        subject: `Thank you for your support! 🙂`,
        body: `<p>Your donation of $${dollarAmount} has been received.</p><p>Reference: ${encryptedDonor}</p>`,
        bcc: 'hello@breadbreakers.sg'
      });

      // Immediately trigger a Stripe payout
      try {
        const stripeBalance = await stripe.balance.retrieve();
        const sgdAvailable = stripeBalance.available.find((entry) => entry.currency === 'sgd');

        if (sgdAvailable && sgdAvailable.amount > 0) {
          const payout = await stripe.payouts.create({
            amount: sgdAvailable.amount,
            currency: 'sgd'
          });

          console.log('✅ Payout created:', payout.id);
        } else {
          console.warn('ℹ️ No available SGD balance to payout.');
        }
      } catch (err) {
        console.error('❌ Error creating Stripe payout:', err.message);
      }

      break;

    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
      break;
  }

  return json({ received: true });
}
