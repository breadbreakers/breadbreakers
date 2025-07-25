import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
  const csrfToken = generateUUID();
  cookies.set('csrf_token', csrfToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/'
  });
  return json({ csrfToken });
}

function generateUUID() {
  // Get 16 random bytes
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  // Set the version to 4 (UUIDv4)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set the variant to RFC 4122
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
  }

  return (
    byteToHex[bytes[0]] +
    byteToHex[bytes[1]] +
    byteToHex[bytes[2]] +
    byteToHex[bytes[3]] +
    '-' +
    byteToHex[bytes[4]] +
    byteToHex[bytes[5]] +
    '-' +
    byteToHex[bytes[6]] +
    byteToHex[bytes[7]] +
    '-' +
    byteToHex[bytes[8]] +
    byteToHex[bytes[9]] +
    '-' +
    byteToHex[bytes[10]] +
    byteToHex[bytes[11]] +
    byteToHex[bytes[12]] +
    byteToHex[bytes[13]] +
    byteToHex[bytes[14]] +
    byteToHex[bytes[15]]
  );
}