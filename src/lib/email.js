import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from '$env/dynamic/private';
import { BREADBREAKERS_EMAIL_FROM } from "$lib/strings";

const REGION = "us-east-1";

export const ses = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: env.BB_AWS_ACCESS_KEY_ID,
        secretAccessKey: env.BB_AWS_SECRET_ACCESS_KEY,
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
        Source: BREADBREAKERS_EMAIL_FROM,
        ReplyToAddresses: replyto ? [replyto] : [],
    };

    const command = new SendEmailCommand(params);
    //console.log("Sending email with params:", params);
    try {
      const result = await ses.send(command);
      //console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
}
