import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request }) {
	const data = await request.formData();
	const amount = Math.round(Number(data.get('amount')) * 100);
	const recurring = data.get('recurring') === 'true';
	const fund = data.get('fund');

	let sessionParams = {
		payment_method_types: (recurring? ['card'] : ['paynow']),
		...(recurring ? { billing_address_collection: 'required' } : {}),
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
		success_url: `https://breadbreakers.sg/donate/success`,
		cancel_url: 'https://breadbreakers.sg/donate',
		customer_email: data.get('email'),
		metadata: {
			fund
		}
	};

	const session = await stripe.checkout.sessions.create(sessionParams);

	return new Response(null, {
		status: 303,
		headers: { location: session.url }
	});
}
