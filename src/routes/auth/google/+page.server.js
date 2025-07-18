import { redirect } from '@sveltejs/kit';

export async function load({ request, url, locals }) {
  const origin = new URL(request.url).origin;
  const supabase = locals.supabase;

  const redirectToParam = url.searchParams.get('redirectTo'); // already encoded

  const callbackUrl = new URL(`${origin}/auth/callback`);

  if (redirectToParam && /^\/(?!\/)/.test(redirectToParam)) {
    callbackUrl.searchParams.set('redirectTo', redirectToParam); 
  }

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString()
    }
  });

  throw redirect(303, data.url);
}
