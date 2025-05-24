import { google } from 'googleapis';
import { env } from '$env/dynamic/private';
import { Readable } from 'stream';

const FOLDER_ID = env.GOOGLE_DRIVE_FOLDER_ID;

export const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const label = formData.get('label') || 'receipt';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Buffer to Readable Stream
    const stream = Readable.from(buffer);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${label}_${Date.now()}_${file.name}`,
        mimeType: file.type,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: stream, // Use the stream here!
      },
      fields: 'id',
    });

    const fileId = driveResponse.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

    return new Response(JSON.stringify({ fileId, fileUrl }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};