import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  // if no cookies, go to login page
  const session = await locals.getUser?.();
  if (!session) throw redirect(303, '/login');

  // get the user info
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  if (userError || !user) throw redirect(303, '/');

   // check if user is a partner, as only partners can send offers
   // rls enabled to only allow the logged in user to read their own data
   // i.e. if user is not listed in the partners table, they cannot read the table at all 
  const { data: partner, error: partnerError } = await locals.supabase
    .from('partners')
    .select('email')
    .eq('email', user.email)
    .single();

  if (partnerError || !partner) throw redirect(303, '/');

  // return only validated data
  return { session, user };
}
