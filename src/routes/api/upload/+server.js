import { google } from 'googleapis';
import { env } from '$env/dynamic/private';
import { Readable } from 'stream';

const FOLDER_ID = env.GOOGLE_DRIVE_FOLDER_ID; // root folder

// Helper to get or create nested folders in Google Drive
async function getOrCreateFolder(name, parentId = null, drive) {
  const query = `'${parentId || 'root'}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

  const res = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (res.data.files.length > 0) {
    return res.data.files[0].id;
  }

  const folderMetadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId ? [parentId] : [],
  };

  const folder = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id',
  });

  return folder.data.id;
}

export const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const itemId = formData.get('id');
    const label = formData.get('type');

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    // Convert File to Buffer and Stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    // Set up Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Generate folder structure: yyyy/MM Month
    const now = new Date();
    const year = now.getFullYear().toString();
    const monthNum = String(now.getMonth() + 1).padStart(2, '0');
    const monthName = now.toLocaleString('default', { month: 'long' });
    const monthFolderName = `${monthNum} ${monthName}`;

    // Get or create year/month nested folders
    const yearFolderId = await getOrCreateFolder(year, FOLDER_ID, drive);
    const monthFolderId = await getOrCreateFolder(monthFolderName, yearFolderId, drive);

    // Upload file
    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${itemId}_${label}_${Date.now()}`,
        mimeType: file.type,
        parents: [monthFolderId],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id',
    });

    const fileId = driveResponse.data.id;

    // Set file to be publicly readable
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
