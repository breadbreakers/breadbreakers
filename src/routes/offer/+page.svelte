<script>
	import { onMount } from "svelte";
	import { OFFER_EMAIL, OFFER_SUBJECT, OFFER_WA } from "$lib/strings";

	export let data;

	let email;
	let mailto;
	let whatsApp;
	let mobileN = false;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		email = params.get("email") || "";

		mailto = `mailto:${email}?subject=${OFFER_SUBJECT} ${data.requests.title}&body=${OFFER_EMAIL}%0D%0A%0D%0A${data.requests.title}%0D%0A${data.requests.description}%0D%0A%0D%0ARef: ${data.requests.id}`;

		const pattern = /\b[89]\d{7}\b/g;

		mobileN = String(data.requests.contact_full).match(pattern);

		if (mobileN) {
			let whatsAppMsg = `${OFFER_WA}

${data.requests.title}
${data.requests.description}
Ref: ${data.requests.id}
`;
			whatsAppMsg = encodeURIComponent(whatsAppMsg);
			whatsApp = `https://wa.me/65${mobileN}?text=${whatsAppMsg}`;
		}
	});
</script>

<svelte:head>
	<title>Bread Breakers (SG) | Offer Assistance</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="section">
	<div class="container">
		<p class="mb-2"><strong class="is-underlined">Item:</strong> {data.requests.title}</p>
		<p class="mb-2">
			<strong class="is-underlined">Description:</strong>
			{data.requests.description}
		</p>
		<p class="mb-2"><strong class="is-underlined">Contact:</strong> {data.requests.contact_full}</p>
		<p class="mb-2"><strong class="is-underlined">Reference:</strong> {data.requests.id}</p>

		<h2 class="subtitle is-5 has-text-centered mt-6">
			<i class="demo-icon icon-mail">&#xe804;</i><a href={mailto} class="pr-2 link">Email</a>
		</h2>

		{#if whatsApp}
			<h2 class="subtitle is-5 has-text-centered mt-6">
				<i class="demo-icon icon-whatsapp">&#xF232;</i><a
					href={whatsApp}
					target="_blank"
					rel="noopener"
					class="link">WhatsApp</a
				>
			</h2>
		{/if}
	</div>
</div>
