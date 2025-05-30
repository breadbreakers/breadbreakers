import { redirect } from '@sveltejs/kit';
import { createSupabaseClient } from '$lib/server/supabase.server';

export async function load({ request, cookies }) {
  const origin = new URL(request.url).origin;

  const supabase = createSupabaseClient(request, cookies);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`
    }
  });

  throw redirect(303, data.url);

  
}
