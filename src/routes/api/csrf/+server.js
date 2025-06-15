import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export async function GET({ cookies }) {
  const csrfToken = randomUUID();
  cookies.set('csrf_token', csrfToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/'
  });
  return json({ csrfToken });
}