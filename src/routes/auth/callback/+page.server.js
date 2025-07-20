import { redirect } from "@sveltejs/kit";

function getFinalRedirect(rawRedirectTo) {
	if (!rawRedirectTo) return "/";

	try {
		let redirectTarget = rawRedirectTo;

		if (rawRedirectTo.includes("/profile?redirectTo=")) {
			redirectTarget = decodeURIComponent(
				decodeURIComponent(rawRedirectTo.split("/profile?redirectTo=")[1])
			);
		} else {
			redirectTarget = decodeURIComponent(rawRedirectTo);
		}

		// Validate relative path
		return /^\/(?!\/)/.test(redirectTarget) ? redirectTarget : "/";
	} catch (e) {
		console.error("Error decoding redirectTo:", e);
		return "/";
	}
}

async function exchangeCode(supabase, code) {
	const maxRetries = 3;

	for (let i = 0; i < maxRetries; i++) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) return true;

		await new Promise((res) => setTimeout(res, Math.pow(2, i + 1) * 1000));
	}

	console.error("OAuth exchange failed after retries");
	return false;
}

async function isPartnerUser(supabase, email) {
	const { data: partner } = await supabase
		.from("partners")
		.select("email")
		.eq("email", email)
		.single();

	return !!partner;
}

export const load = async ({ url, locals }) => {
	const code = url.searchParams.get("code");
	const rawRedirectTo = url.searchParams.get("redirectTo");
	const finalRedirect = getFinalRedirect(rawRedirectTo);

	if (!code) throw redirect(303, "/");

	const supabase = locals.supabase;

	const exchanged = await exchangeCode(supabase, code);
	if (!exchanged) throw redirect(303, "/");

	const {
		data: { user },
		error: userError
	} = await supabase.auth.getUser();

	if (userError || !user) {
		console.error("Failed to get user after OAuth:", userError);
		throw redirect(303, "/");
	}

	const isPartner = await isPartnerUser(supabase, user.email);
	if (!isPartner) {
		await supabase.auth.signOut();
		throw redirect(303, "/error/not-partner");
	}

	return { redirectTo: finalRedirect };
};
