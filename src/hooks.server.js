import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/private';

export const handle = async ({ event, resolve }) => {
  // Special case for DevTools
  if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
    return new Response(null, { status: 204 });
  }  

  // Supabase setup
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
              ...options,
              secure: true,
              httpOnly: true,
              sameSite: 'lax'              
            });
          });
        }
      }
    }
  );

  event.locals.getUser = async () => {
    const { data: { user }, error } = await event.locals.supabase.auth.getUser();
    return user;
  };  

  // Resolve the request and add security headers
  const response = await resolve(event);

  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self';");
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');

  return response;
};
