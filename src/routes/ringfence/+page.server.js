// src/routes/your-protected-page/+page.server.js
import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  // 1. Check for session (from cookies)
  const session = await locals.getUser?.();
  if (!session) throw redirect(303, '/');

  // 2. Securely fetch the authenticated user from Supabase Auth server
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  if (userError || !user) throw redirect(303, '/');

   // 3. Check if is partner
  const { data: partner, error: partnerError } = await locals.supabase
    .from('partners')
    .select('email')
    .eq('email', user.email)
    .single();

  if (partnerError || !partner) throw redirect(303, '/');

  // get the item details based on the get param
  const itemId = url.searchParams.get('id');
  let itemData = null;
  if (itemId) {
    const { data, error } = await locals.supabase
      .from('requests')
      .select('*')
      .eq('id', itemId)
      .single();
    
    if (!error) itemData = data;
  }

  // Return only validated data
  return { session, user, item: itemData };
}
