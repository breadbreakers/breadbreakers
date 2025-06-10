import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent, locals }) => {
  const { session } = await parent(); // Get the current session if available

  const code = url.searchParams.get('code');

  if (code) {
    const supabase = locals.supabase;
    const maxRetries = 3;
    let retries = 0;
    let error = null;

    while (retries < maxRetries) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      error = exchangeError;

      if (!error) {
        // Successfully exchanged code for session.
        // Now, you likely want to clear the 'code' from the URL
        // and let the user land on the page, now authenticated.
        // OR redirect them to a specific post-login page.
        // Let's assume you want to land on the current page, but clean the URL.
        const cleanUrl = new URL(url.pathname, url.origin); // Reconstruct URL without search params
        throw redirect(303, cleanUrl.toString()); // Redirect to a clean URL without the 'code'
      }

      retries++;
      const delay = Math.pow(2, retries) * 1000; // Exponential backoff
      console.log(`Retrying exchangeCodeForSession in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (error) {
      console.error('Error exchanging code for session after retries:', error);
      // If there's a persistent error after retries,
      // you should redirect to an error page or the login page with an error message.
      // For now, redirecting to the base path with an error state (which you'd handle on the page).
      // Or, more robustly, throw an error that SvelteKit's error boundary can catch.
      // For a simple redirect, you might redirect to a login page or the homepage with an error flag.
      // Example: throw redirect(303, '/login?error=auth_failed');
      throw redirect(303, url.pathname); // Redirect to original path, and handle error on page if needed
    }
  }

  // If there's no 'code' in the URL, or if the code exchange happened and
  // the redirect inside the 'if (code)' block was executed,
  // this part will be reached only if NO 'code' was present.
  // In this case, you typically just want to proceed with loading the page normally.
  // You should NOT redirect here unless there's a specific reason
  // (e.g., if the user is not logged in and this page requires authentication).

  // If you *always* want authenticated users on this page, and redirect if not:
  // if (!session?.user) {
  //   throw redirect(303, '/login'); // Redirect to login page
  // }

  // Otherwise, just return an empty object or any data needed for the page.
  // No redirect is needed if the purpose is just to load the page.
  return {};
};