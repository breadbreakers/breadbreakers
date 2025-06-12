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

      if (!error) break;

      retries++;
      await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
    }

    if (error) {
      console.error('OAuth exchange failed:', error);
      return { redirectTo: '/' }; // fallback redirect
    }

    return {
      redirectTo: '/'
    };
  }

  return { redirectTo: '/' };
};
