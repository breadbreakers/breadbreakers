import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {

  const itemId = url.searchParams.get('id');

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

  // check if is approver
  const { data: approver, error: approverError } = await locals.supabase
    .from('approvers')
    .select('email')
    .eq('email', user.email)
    .single();

  if (approverError || !approver) throw redirect(303, '/error/not-approver');

  // check if item is in wip and claim_requested
  const { data: wip, error: wipError } = await locals.supabase
    .from('wip')
    .select('*')
    .eq('id', itemId)
    .single();

  if (wipError || !wip) throw redirect(303, '/error/not-wip');
  
  if (wip.status !== "claim_requested") {
    throw redirect(303, '/error/claim-requested');
  }

  // Return only validated data
  return { session, user, item: wip };
}
