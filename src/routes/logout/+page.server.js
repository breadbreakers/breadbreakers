import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  
  const session = await locals.getUser?.();
  if (!session) throw redirect(303, '/');
  
  await locals.supabase.auth.signOut();

  return;
}