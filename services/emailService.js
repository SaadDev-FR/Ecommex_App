const nodemailer = require('nodemailer');

const {
    SENDER_EMAIL,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_HOST,
    EMAIL_HOST_PORT
} = require('../utils/constants');

async function sendEmail(to, subject, html) {
    try {
        const transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_HOST_PORT,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: SENDER_EMAIL,
            to,
            subject,
            html,
        };

        return await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error);
        throw new Error('Failed to send email');
    }

}

module.exports = { sendEmail }