export async function GET() {
  const origin = 'https://breadbreakers.sg';

  const urls = [
    '/',
    '/about',
    '/ledger',
    '/faq',
    '/governance',
    '/get-involved',
    '/resources',
    '/donate',
    '/contact',
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map(
      (url) => `
      <url>
        <loc>${origin}${url}</loc>
      </url>
    `
    ).join('') +
    `</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
