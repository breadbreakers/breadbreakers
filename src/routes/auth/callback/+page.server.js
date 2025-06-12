import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent, locals }) => {
  const code = url.searchParams.get('code');
  const rawRedirectTo  = url.searchParams.get('redirectTo'); // now works!
  let finalRedirect;
  if (rawRedirectTo) {
    finalRedirect = decodeURIComponent(decodeURIComponent(rawRedirectTo.split("/profile?redirectTo=")[1]));
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
      await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
    }

    if (error) {
      console.error('OAuth exchange failed:', error);
      throw redirect(303, '/');
    }

    if (finalRedirect && /^\/(?!\/)/.test(finalRedirect)) {
      throw redirect(303, finalRedirect);
    }

    throw redirect(303, "/");
  }

  throw redirect(303, '/');
};
