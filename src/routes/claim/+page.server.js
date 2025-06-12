import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  const itemId = url.searchParams.get('id');

  // check if logged in
  const session = await locals.getUser?.();
  if (!session) throw redirect(303, '/');

  // get user details
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  if (userError || !user) throw redirect(303, '/');

   // check if is partner (this is the claim request page for partners)
  const { data: partner, error: partnerError } = await locals.supabase
    .from('partners')
    .select('email')
    .eq('email', user.email)
    .single();

  if (partnerError || !partner) throw redirect(303, '/');

   // check if this user logged in is indeed already at ringfence_approved for this item
  const { data: wip, error: wipError } = await locals.supabase
    .from('wip')
    .select('*')
    .eq('id', itemId)
    .single();

  if (wipError || !wip) throw redirect(303, '/');

  if (wip.partner === user.email) {
    if (wip.status !== "ringfence_approved") {
      throw redirect(303, '/');
    }
  } else {
    throw redirect(303, '/');
  }

  // Return only validated data
  return { session, user, item: wip };
}
