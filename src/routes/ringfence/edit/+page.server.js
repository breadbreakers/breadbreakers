import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  // check if logged in
  const session = await locals.getUser?.();
  if (!session) {
    const redirectTo = url.pathname + url.search;
    const encodedRedirectTo = encodeURIComponent(redirectTo);
    throw redirect(303, `/profile?redirectTo=${encodedRedirectTo}`);
  }

  // get user details
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  if (userError || !user) throw redirect(303, '/profile');

  // check if is partner
  const { data: partner, error: partnerError } = await locals.supabase
    .from('partners')
    .select('email')
    .eq('email', user.email)
    .single();

  if (partnerError || !partner) throw redirect(303, '/error/not-partner');

  // get the item details based on the get param
  const itemId = url.searchParams.get('id');

  // check if item is in wip
  const { data: wip, error: wipError } = await locals.supabase
    .from('wip')
    .select('*')
    .eq('id', itemId)
    .single();

  if (wipError || !wip) throw redirect(303, '/error/not-wip');

  // don't allow edit if its in the claim requested stage
  if (wip.status == "claim_requested") {
    throw redirect(303, '/error/claim-requested');
  }

  // Return only validated data
  return { item: wip };
}
