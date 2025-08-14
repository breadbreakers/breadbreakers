import { env } from '$env/dynamic/private';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Buffer } from "node:buffer";
globalThis.Buffer = Buffer;

// === CONFIGURATION ===
const BUCKET_NAME = env.R2_BUCKET;
const TEMP_BUCKET_NAME = env.R2_TEMP_BUCKET; // For temporary uploads
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

export const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const itemId = formData.get('id');
    const label = formData.get('type');
    const isTemporary = formData.get('temporary') === 'true';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // === DATE-BASED PATH ===
    const now = new Date();
    const year = now.getFullYear().toString();
    const monthNum = String(now.getMonth() + 1).padStart(2, '0');
    const monthFolderName = `${monthNum}`;

    // File key (path) inside bucket
    const fileKey = `${year}/${monthFolderName}/${itemId}/${label}_${Date.now()}`;

    const bucket = isTemporary ? TEMP_BUCKET_NAME : BUCKET_NAME;

    if (!bucket) {
      throw new Error(isTemporary ? 'Temporary bucket is not configured.' : 'Storage bucket is not configured.');
    }

    // === UPLOAD TO R2 ===
    const uploadParams = {
      Bucket: bucket,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type
    };

    await s3.send(new PutObjectCommand(uploadParams));

    if (isTemporary) {
      // For temporary uploads, just return the key. The file is not public.
      return new Response(JSON.stringify({ fileKey }), { status: 200 });
    }

    // === PUBLIC URL for permanent uploads ===
    const publicUrl = `https://cloud.breadbreakers.sg/${fileKey}`;

    return new Response(JSON.stringify({ 
      fileId: fileKey, 
      fileUrl: publicUrl 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};