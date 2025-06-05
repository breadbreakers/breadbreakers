// src/routes/donate/checkout/+server.js
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request }) {
	const data = await request.formData();
	const amount = Number(data.get('amount')) * 100; // Stripe expects cents
	const recurring = data.get('recurring') === 'true';

	let sessionParams = {
		payment_method_types: (recurring? ['card'] : ['paynow', 'card']),
		line_items: [{
			price_data: {
				currency: 'sgd',
				product_data: { name: 'Donation' },
				unit_amount: amount,
				recurring: recurring ? { interval: 'month' } : undefined
			},
			quantity: 1
		}],
		mode: recurring ? 'subscription' : 'payment',
		success_url: 'https://breadbreakers.sg/donate/success',
		cancel_url: 'https://breadbreakers.sg/donate'
	};

	const session = await stripe.checkout.sessions.create(sessionParams);

	return new Response(null, {
		status: 303,
		headers: { location: session.url }
	});
}
