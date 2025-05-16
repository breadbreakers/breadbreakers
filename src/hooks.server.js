import { handle } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
    return new Response(null, { status: 204 }); // No Content
  }
  return resolve(event);
};