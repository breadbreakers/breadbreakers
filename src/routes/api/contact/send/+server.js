import { json } from "@sveltejs/kit";
import { sendEmail } from "$lib/email";
import { BREADBREAKERS_EMAIL } from "$lib/strings.js";
import { RECAPTCHA_SECRET_KEY } from "$env/static/private";

export async function POST({ request, cookies }) {
	try {
		const { name, email, message, recaptchaToken, csrfToken } = await request.json();

		// Basic validation
		if (!name || !email || !message || !recaptchaToken || !csrfToken) {
			return json({ success: false, error: "Missing required fields" }, { status: 400 });
		}

		// ✅ CSRF Validation
		const storedToken = cookies.get("csrf_token");
		if (!storedToken || storedToken !== csrfToken) {
			return json({ success: false, error: "Invalid CSRF token" }, { status: 403 });
		}

		// ✅ Verify reCAPTCHA v3 token
		const verificationRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				secret: RECAPTCHA_SECRET_KEY,
				response: recaptchaToken
			})
		});

		const verificationData = await verificationRes.json();
		console.log("reCAPTCHA verification result:", verificationData);

		if (!verificationData.success || verificationData.score < 0.5) {
			return json({ success: false, error: "reCAPTCHA verification failed" }, { status: 400 });
		}

		try {
			// ✅ Send the email
			await sendEmail({
				to: BREADBREAKERS_EMAIL,
				subject: `Contact Form Submission from ${name}`,
				replyto: email,
				body: message
			});
		} catch (error) {
			console.error("Failed to send email:", error);
		}

		return json({ success: true });
	} catch (error) {
		console.error("Error sending contact form:", error);
		return json({ success: false, error: "Internal Server Error" }, { status: 500 });
	}
}
