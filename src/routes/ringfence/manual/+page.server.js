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

  // get number of rows in requests_manual
  const { data: res, error } =  await locals.supabase.rpc('predict_next_request_id');

  const itemId = res[0].id

  return { itemId }

}
