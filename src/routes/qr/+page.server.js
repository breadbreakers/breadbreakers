import { env } from '$env/dynamic/private';
import * as sgqr from 'sgqr';
import sharp from 'sharp';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// === CONFIGURATION ===
const BUCKET_NAME = env.R2_BUCKET;
const REGION = env.R2_REGION;
const ENDPOINT = env.R2_ENDPOINT;

// === INIT AWS S3 CLIENT ===
const s3 = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: env.R2_ACCESS_ID,
    secretAccessKey: env.R2_SECRET,
  },
});

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

// === DATE-BASED PATH ===
const now = new Date();
const year = now.getFullYear().toString();
const monthNum = String(now.getMonth() + 1).padStart(2, '0');
//const monthName = now.toLocaleString('default', { month: 'long' });
const monthFolderName = `${monthNum}`;

// File key (path) inside bucket
const fileKey = `${year}/${monthFolderName}/QR_CODE_${Date.now()}.png`;

// === UPLOAD TO S3 ===
const uploadParams = {
  Bucket: BUCKET_NAME,
  Key: fileKey,
  Body: resizedBuffer,
  ContentType: 'image/png'
};

await s3.send(new PutObjectCommand(uploadParams));

// === PUBLIC URL ===
// Format depends on your bucket region and name
const publicUrl = `https://cloud.breadbreakers.sg/${fileKey}`;

console.log('✅ Public QR Code URL:', publicUrl);
