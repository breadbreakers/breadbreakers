import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  // check if logged in
  const session = await locals.getUser?.();
  if (!session) throw redirect(303, '/profile');

  // get user details
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  if (userError || !user) throw redirect(303, '/profile');

  // check if is partner
  const { data: partner, error: partnerError } = await locals.supabase
    .from('partners')
    .select('email')
    .eq('email', user.email)
    .single();

  if (partnerError || !partner) throw redirect(303, '/');

  // get the item details based on the get param
  const itemId = url.searchParams.get('id');

  // check if item is in wip not ringfence_requested, ringfence_approved, or claim_requested
  const { data: wip, error: wipError } = await locals.supabase
    .from('wip')
    .select('*')
    .eq('id', itemId)
    .single();

  if (wip !== null) {
    if (wip.status == "ringfence_requested") {
      throw redirect(303, '/');
    }

    if (wip.status == "ringfence_approved") {
      throw redirect(303, '/');
    }

    if (wip.status == "claim_requestesd") {
      throw redirect(303, '/');
    }
  }

  let itemData = null;
  if (itemId) {
    const { data : fetchedItem, error : itemError } = await locals.supabase
      .from('requests')
      .select('*')
      .eq('id', itemId)
      .single();

    if (!fetchedItem || itemError) throw redirect(303, '/'); //no such item in request table

    itemData = fetchedItem;
  }

  // Return only validated data
  return { item: itemData };
}
