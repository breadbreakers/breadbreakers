import { redirect } from '@sveltejs/kit';

export async function load({ request, locals }) {
  const origin = new URL(request.url).origin;

  const supabase = locals.supabase;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`
    }
  });

  throw redirect(303, data.url);
}
