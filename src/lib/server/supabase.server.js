import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/private';

export function createSupabaseClient(request, cookies) {
  return createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      request,
      cookies: {
        get(name) {
          return cookies.get(name);
        },
        set(name, value, options) {
          cookies.set(name, value, {
            ...options,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true
          });
        },
        remove(name, options) {
          cookies.delete(name, {
            ...options,
            path: '/'
          });
        }
      }
    }
  );
}
