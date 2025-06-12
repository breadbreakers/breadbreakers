import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/email';
import { BREADBREAKERS_EMAIL } from '$lib/strings.js';

export async function POST({ request }) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail({
      to: BREADBREAKERS_EMAIL, // Replace with your email address
      subject: `Contact Form Submission from ${name}`,
      replyto: email,
      body: message,
      bcc: 'jaredyeo@gmail.com'
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
