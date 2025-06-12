import { generatePayNowStr } from '$lib/paynow.js';
import QRCode from 'qrcode';
import { env } from '$env/dynamic/private';
import { Readable } from 'stream';
import { google } from 'googleapis';

const FOLDER_ID = env.GOOGLE_DRIVE_FOLDER_ID;
            // setup paynow
                    const QRstring = generatePayNowStr({
                        mobile: '93809025',
                        amount: '1',
                        expiry: getOneMonthLaterYYYYMMDD(),
                        refNumber: '123',
                    });
            
                    const qrImageDataURL = await QRCode.toDataURL(QRstring);
                    const base64Data = qrImageDataURL.replace(/^data:image\/png;base64,/, '');
                    const buffer = Buffer.from(base64Data, 'base64');
                    const stream = Readable.from(buffer);
            
                    const auth = new google.auth.GoogleAuth({
                        credentials: {
                            client_email: env.GOOGLE_CLIENT_EMAIL,
                            private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                        },
                        scopes: ['https://www.googleapis.com/auth/drive.file'],
                    });
            
                    const drive = google.drive({ version: 'v3', auth });
            
                    // Upload the file
                    const driveResponse = await drive.files.create({
                        requestBody: {
                            name: `QR_TEST.png`,
                            mimeType: 'image/png',
                            parents: [FOLDER_ID],
                        },
                        media: {
                            mimeType: 'image/png',
                            body: stream,
                        },
                        fields: 'id',
                    });
            
                    const fileId = driveResponse.data.id;
            
                    // Set permission to public
                    await drive.permissions.create({
                        fileId,
                        requestBody: {
                            role: 'reader',
                            type: 'anyone',
                        },
                    });
            
                    // Return public image link
                    const paynowQRImage = `https://drive.google.com/uc?id=${fileId}`;


                    function getOneMonthLaterYYYYMMDD() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}