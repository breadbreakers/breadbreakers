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

  // check if is approver
  const { data: approver, error: approverError } = await locals.supabase
    .from('approvers')
    .select('email')
    .eq('email', user.email)
    .single();

  if (approverError || !approver) throw redirect(303, '/');

  // Return only validated data
  return { user };
}
