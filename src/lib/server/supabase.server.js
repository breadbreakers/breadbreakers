import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/private';

export function createServerSupabaseClient(event) {
    return createServerClient(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => event.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, options);
                    });
                }
            }
        }
    );
}
