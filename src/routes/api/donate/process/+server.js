import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseService } from '$lib/server/supabase.server';
import { encrypt } from '$lib/crypto';
import { getSgTime } from '$lib/sgtime';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000; // 2 seconds

async function getBalanceTransactionWithRetry(chargeId, stripe) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const charge = await stripe.charges.retrieve(chargeId);
    if (charge.balance_transaction) {
      return charge.balance_transaction;
    }
    if (attempt < MAX_RETRIES) {
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
    }
  }
  throw new Error('Balance transaction still null after retries');
}

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

  const supabase = createServerSupabaseService(event);
  const sgTime = getSgTime();

  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      try {
        const paymentIntent = stripeEvent.data.object;
        const amount = paymentIntent.amount_received;
        const donor = paymentIntent.receipt_email;
        const chargeId = paymentIntent.latest_charge;
        const balanceTxId = await getBalanceTransactionWithRetry(chargeId, stripe);
        const balanceTx = await stripe.balanceTransactions.retrieve(balanceTxId);
        const stripeFee = balanceTx.fee;

        // insert expense for fees
        const { data: feeExpense, error: feeError } = await supabase
          .from('expenses')
          .insert([
            {
              description: `Stripe Transaction Fee`,
              amount: stripeFee,
              approveremail: donor,
              link: chargeId,
              timestamp: sgTime
            }
          ]);

        // Insert donation record
        const { data: expense, error: insertError } = await supabase
          .from('incoming')
          .insert([
            {
              source: `Donation`,
              id: chargeId,
              amount,
              approveremail: donor,
              timestamp: sgTime
            }
          ]);

        const { data: balance, error: balanceError } = await supabase
          .from('balance')
          .select('amount')
          .single();

        const balanceN = balance.amount;
        const newBalance = balanceN + amount - stripeFee;

        const { error: updateError } = await supabase
          .from('balance')
          .update({ amount: newBalance })
          .eq('amount', balanceN); // use optimistic update

        // Send thank-you email
        const dollarAmount = (amount / 100).toFixed(2);
        await sendEmail({
          to: donor,
          subject: `Thank you for your support! 🙂`,
          body: `<p>Your donation of $${dollarAmount} has been received.</p><p>Reference: ${chargeId}</p><p>Please note that a processing fee of $${stripeFee} is deducted by our payment provider to facilitate secure payments.</p>`,
          bcc: 'hello@breadbreakers.sg'
        });

      } catch (err) {
        console.error(err);
      }
      break;
    case 'balance.available':
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
