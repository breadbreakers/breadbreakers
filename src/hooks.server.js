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
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { 
              path: '/',
              secure: true,
              httpOnly: true,
              sameSite: 'lax',
              ...options
            })
          })
        }
      }
    }
  );

 event.locals.getUser = async () => {
    const { data: { user }, error } = await event.locals.supabase.auth.getUser();
    //if (error) console.error("Failed to fetch user:", error.message);
    return user;
  };  

  return resolve(event);
};
