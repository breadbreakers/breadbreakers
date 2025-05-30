import { decrypt } from '$lib/crypto';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent, locals }) => {

  const session = await locals.getUser?.();
  
  if (!session) throw redirect(303, '/login');

  const code = url.searchParams.get('source');

  let decrypted;
  try {
    decrypted = await decrypt(code);
  } catch (err) {
    throw redirect(303, '/');
  }

  const itemId = decrypted.split("_")[0];

  const { data: pd, error: requestsError } = await locals.supabase
    .from('pd')
    .select('*')
    .eq('id', itemId)
    .single();

  const decryptedName = await decrypt(pd.name);
  const decryptedAddress = await decrypt(pd.address);
  const decryptedMobile = await decrypt(pd.mobile);
  const lift = pd.lift

  /*const { data } = await locals.supabase
  .from('pdaccess')
  .insert([
      {
          id: itemId,
          partneremail: pd.partneremail
      }
  ]);*/

  return { decryptedName, decryptedAddress, decryptedMobile, itemId, lift };
};
