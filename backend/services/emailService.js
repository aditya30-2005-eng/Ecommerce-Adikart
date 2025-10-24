// backend/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    },
});

export const sendResetLinkEmail = async (toEmail, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_SERVICE_USER,
        to: toEmail,
        subject: 'Adikart Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #4F46E5;">Password Reset Request</h2>
                <p>We received a request to reset your password for your Adikart account. Click the button below to set a new password:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #10B981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Reset My Password
                </a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Password Reset Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email via Nodemailer:", error);
        return false;
    }
};