// src/routes/auth/callback/+page.server.js
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent, locals }) => {
  const code = url.searchParams.get('code');
  const rawRedirectTo = url.searchParams.get('redirectTo');
  let finalRedirect = '/'; // default redirect
  
  if (rawRedirectTo) {
    try {
      if (rawRedirectTo.includes('/profile?redirectTo=')) {
        finalRedirect = decodeURIComponent(decodeURIComponent(rawRedirectTo.split("/profile?redirectTo=")[1]));
      } else {
        finalRedirect = decodeURIComponent(rawRedirectTo);
      }
      
      // Validate that it's a safe relative path
      if (!/^\/(?!\/)/.test(finalRedirect)) {
        finalRedirect = '/';
      }
    } catch (e) {
      console.error('Error decoding redirectTo:', e);
      finalRedirect = '/';
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
      await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
    }

    if (error) {
      console.error('OAuth exchange failed:', error);
      throw redirect(303, '/');
    }

    // Instead of throwing a redirect, return the redirect target to the client
    return {
      redirectTo: finalRedirect
    };
  }

  // If no code, redirect immediately
  throw redirect(303, '/');
};
