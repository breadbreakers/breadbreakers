import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
  const session = await locals.getUser?.();

  if (!session) {
    const redirectTo = url.pathname + url.search;
    const encodedRedirectTo = encodeURIComponent(redirectTo);
    throw redirect(303, `/profile?redirectTo=${encodedRedirectTo}`);
  }

  const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
  if (userError || !user) throw redirect(303, '/');

  const { data: partner, error: partnerError } = await locals.supabase
    .from('partners')
    .select('email')
    .eq('email', user.email)
    .single();
  if (partnerError || !partner) throw redirect(303, '/error/not-partner');

  const itemId = url.searchParams.get('id');
  const { data: requests, error: requestsError } = await locals.supabase
    .from('requests')
    .select('*')
    .eq('id', itemId)
    .single();
  if (requestsError || !requests) throw redirect(303, '/error/not-request');

  return { requests };
}
