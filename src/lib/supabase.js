// Correct initialization should include:
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
);

// OAuth call should use app's redirect route
export const signInWithGoogle = () => {
  const redirectTo = `${location.origin}/auth/callback`;
  console.log('Google sign-in redirectTo:', redirectTo);
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo
    }
  });
}
