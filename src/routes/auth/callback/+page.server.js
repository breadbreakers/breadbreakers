import { redirect } from "@sveltejs/kit";

export const load = async ({ url, locals }) => {
	const code = url.searchParams.get("code");
	const rawRedirectTo = url.searchParams.get("redirectTo");
	let finalRedirect = "/"; // default redirect

	if (rawRedirectTo) {
		try {
			if (rawRedirectTo.includes("/profile?redirectTo=")) {
				finalRedirect = decodeURIComponent(
					decodeURIComponent(rawRedirectTo.split("/profile?redirectTo=")[1])
				);
			} else {
				finalRedirect = decodeURIComponent(rawRedirectTo);
			}

			// Validate that it's a safe relative path
			if (!/^\/(?!\/)/.test(finalRedirect)) {
				finalRedirect = "/";
			}
		} catch (e) {
			console.error("Error decoding redirectTo:", e);
			finalRedirect = "/";
		}
	}

	if (code) {
		const supabase = locals.supabase;

		const maxRetries = 3;
		let retries = 0;
		let error = null;

		while (retries < maxRetries) {
			const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
			error = exchangeError;
			if (!error) break;
			retries++;
			await new Promise((res) => setTimeout(res, Math.pow(2, retries) * 1000));
		}

		if (error) {
			console.error("OAuth exchange failed:", error);
			throw redirect(303, "/");
		}

		// NEW: Check if user is an partner after successful login
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			console.error("Failed to get user after OAuth:", userError);
			throw redirect(303, "/");
		}

		// Check if user is a partner
		const { data: partner } = await supabase
			.from("partners")
			.select("email")
			.eq("email", user.email)
			.single();

		// If not an approver, force logout and redirect with error message
		if (!partner) {
			// Force logout
			await supabase.auth.signOut();

			// Redirect to home with error message
			throw redirect(303, "/error/not-partner");
		}

		// Instead of throwing a redirect, return the redirect target to the client
		return {
			redirectTo: finalRedirect
		};
	}

	// If no code, redirect immediately
	throw redirect(303, "/");
};
