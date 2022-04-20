import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

let session = [];

const sendEmail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        html: `<p><strong>HTML</strong> version of the message. Click <a href="https://youtube.com">this link</a></p>`,
        subject,
        html
    };

    const info = await transporter.sendMail(mailOptions);
};

export default {
    comparePasswords: (password, hash) => {
        return bcrypt.compare(password, hash);
    },
    hashPassword: (password) => {
        return bcrypt.hash(password, 10);
    },
    issueJwt: (user) => {
        const payload = { 
            sub: user.id, 
            name: user.username, 
            iat: Math.floor(Date.now() / 1000)
        };
        
        return jwt.sign(
            payload, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1h' }
        );
    },
    /**
     * Verifies a one-time code is present and not expired.
     * The one-time code cannot be used again after this method is called.
     * 
     * @param {*} code One-time code to verify
     * @returns subject if code is valid, false otherwise
     */
    verifyOneTimeCode: (code) => {
        const { subject, expiresAt } = session.find(s => s.code === code) || {};
        let result = false;
        if (expiresAt > Date.now()) {
            result = subject;
        }
        session = session.filter(s => s.code !== code);
        return result;
    },
    /**
     * Generates a one-time code.
     * 
     * @param {*} subject Subject of the code, e.g. user id or email address
     * @returns One-time code
     */
    generateOneTimeCode: (subject) => {
        const code = randomBytes(24).toString('hex');
        session.push({ 
            code,
            subject,
            expiresAt: Date.now() + 15 * 60 * 1000 
        });
        return code;
    },
    /**
     * Sends an email with a link, that verifies that email.
     * 
     * @param {*} email The email address to send the one-time code to
     * @param {*} code The one-time code to send
     */
    sendVerificationEmail: async (email, code) => {
        const resetUrl = `http://localhost:3000/auth/verify-email?code=${code}`;
        const subject = 'Verify your email address';
        const text = `Please verify your email by following this link: ${resetUrl}`;
        sendEmail(email, subject, text);
    },
    sendResetPasswordEmail: async (email, code) => {
        const resetUrl = `http://localhost:8080/reset-password?code=${code}`;
        const subject = 'Password reset request';
        const html = [
            '<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>',
            '<p>If you did not request this, ignore this email and your password will remain unchanged.</p>',
            `<p>To reset your password, following <a href="${resetUrl}">this link</a>.<p>`
        ].join('');
        sendEmail(email, subject, html);
    }
};