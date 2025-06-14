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

  const response = await resolve(event);

  // Only 'self' and data: needed for font-src since Fontello is local
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      `img-src 'self' data: https://your-supabase-project.supabase.co`,
      `connect-src 'self' https://your-supabase-project.supabase.co`,
      "frame-src 'self'"
    ].join('; ')
  );
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');

  return response;
};
