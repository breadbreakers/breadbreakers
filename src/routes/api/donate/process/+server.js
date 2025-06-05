import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email.js';
import { createServerSupabaseService } from '$lib/server/supabase.server';
import { encrypt } from '$lib/crypto';
import { getSgTime } from '$lib/sgtime'

// Initialize Stripe with your API secret key (sk_...)
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(event) {

  const { request } = event;

  // Get the raw request body as text (required for signature verification)
  const body = await request.text();
  // Get the Stripe signature from the headers
  const signature = request.headers.get('stripe-signature');

  // Check for signature and webhook secret
  if (!signature) {
    console.warn('⚠️ Webhook signature is missing.');
    throw error(400, 'Invalid request');
  }
  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️ STRIPE_WEBHOOK_SECRET is missing.');
    throw error(400, 'Invalid request');
  }

  let stripeEvent;
  try {
    // Verify the webhook signature and construct the event
    stripeEvent = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.warn('⚠️ Webhook signature verification failed.', err.message);
    throw error(400, 'Invalid request');
  }

  // Handle the event

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const amount = stripeEvent.data.object.amount_total;
      const donor = stripeEvent.data.object.customer_details.email;
      const encryptedDonor = await encrypt(donor);

      const supabase = createServerSupabaseService(event);

      const { data: expense } = await supabase
        .from('incoming')
        .insert([
          {
            source: `Donation from ${encryptedDonor}`,
            amount,
            approveremail: donor,
            timestamp: getSgTime()
          }
        ]);

      // update amounts
      const { data: balance, error: balanceError } = await supabase
        .from('balance')
        .select('amount')
        .single();

      let balanceN = balance.amount;
      let newBalance = balanceN + amount;

      const { data: balanceUpdate, balanceUpdateError } = await supabase
        .from('balance')
        .update({
          amount: newBalance
        })
        .eq('amount', balanceN); // use the current value as a filter

      break;
    default:
      break;
  }

  // Respond to Stripe to acknowledge receipt
  return json({ received: true });
}
