import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/private';

export const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
    return new Response(null, { status: 204 });
  }

  event.locals.supabase = createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: event.cookies
    }
  );

  event.locals.getUser = async () => {
    const { data: { user }, error } = await event.locals.supabase.auth.getUser();
    if (error) console.error("Failed to fetch user:", error.message);
    return user;
  };

  return resolve(event);
};
