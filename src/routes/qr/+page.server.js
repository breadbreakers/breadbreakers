import { env } from '$env/dynamic/private';
import { Readable } from 'stream';
import { google } from 'googleapis';
import * as sgqr from 'sgqr';
import sharp from 'sharp';

// === CONFIGURATION ===
const FOLDER_ID = env.GOOGLE_DRIVE_FOLDER_ID; // base folder (e.g., "PayNow_QRCodes")

// === GENERATE PAYNOW QR ===
const payload = await sgqr.generate_code({
  number: '+6593809025',
  amount: '1',
  type: 'image/png',
  comments: '123456',
});

const inputBuffer = Buffer.from(payload);

// === RESIZE TO 5% ===
const metadata = await sharp(inputBuffer).metadata();
const resizedBuffer = await sharp(inputBuffer)
  .resize({
    width: Math.round(metadata.width * 0.05),
    withoutEnlargement: true,
  })
  .png()
  .toBuffer();

const stream = Readable.from(resizedBuffer);

// === GOOGLE DRIVE AUTH WITH OAUTH ===
const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// === DATE-BASED FOLDER STRUCTURE ===
const now = new Date();
const year = now.getFullYear().toString();
const monthNum = String(now.getMonth() + 1).padStart(2, '0');
const monthName = now.toLocaleString('default', { month: 'long' });
const monthFolderName = `${monthNum} ${monthName}`;

// === FIND OR CREATE FOLDER ===
async function getOrCreateFolder(name, parentId = null) {
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

// === CREATE NESTED FOLDERS ===
const yearFolderId = await getOrCreateFolder(year, FOLDER_ID);
const monthFolderId = await getOrCreateFolder(monthFolderName, yearFolderId);

// === UPLOAD TO GOOGLE DRIVE ===
const driveResponse = await drive.files.create({
  requestBody: {
    name: `QR_CODE_${Date.now()}.png`,
    mimeType: 'image/png',
    parents: [monthFolderId],
  },
  media: {
    mimeType: 'image/png',
    body: stream,
  },
  fields: 'id',
});

const fileId = driveResponse.data.id;

// === SET PERMISSION TO PUBLIC ===
await drive.permissions.create({
  fileId,
  requestBody: {
    role: 'reader',
    type: 'anyone',
  },
});

// === PUBLIC URL ===
const publicUrl = `https://drive.google.com/uc?id=${fileId}`;
console.log('✅ Public QR Code URL:', publicUrl);