import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent, locals }) => {
  const { session } = await parent();

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
        break;
      }

      retries++;
      const delay = Math.pow(2, retries) * 1000; // Exponential backoff
      console.log(`Retrying exchangeCodeForSession in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (error) {
      console.error('Error exchanging code for session after retries:', error);
      // Handle error appropriately, maybe redirect to an error page
      return { session }; // Or throw an error
    }

    //console.log('Cookies after exchangeCodeForSession:', cookies.getAll());
  }

  throw redirect(303, '/');
};
