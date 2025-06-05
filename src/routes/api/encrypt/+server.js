import { json } from '@sveltejs/kit';
import { encrypt } from '$lib/crypto';

export async function GET({ url }) {
  const data = url.searchParams.get('data');
  const encrypted = await encrypt(data);
  return json({ message: encrypted });
}
