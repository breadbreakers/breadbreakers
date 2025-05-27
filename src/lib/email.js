import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from '$env/dynamic/private';

const REGION = "us-east-1";

export const ses = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function sendEmail({ to, from, subject, body, replyto, bcc, cc }) {

    const htmlBody = body.replace(/\n/g, '<br>');

    const subjectClean = subject;

    const params = {
        Destination: {
            ToAddresses: [to],
            CcAddresses: cc ? [cc] : [],
            BccAddresses: bcc ? [bcc] : []
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subjectClean,
            },
        },
        Source: 'Bread Breakers <hello@breadbreakers.sg>',
        ReplyToAddresses: replyto ? [replyto] : [],
    };

    const command = new SendEmailCommand(params);
    await ses.send(command);
}