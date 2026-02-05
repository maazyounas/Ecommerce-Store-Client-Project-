// utils/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // yourgmail@gmail.com
    pass: process.env.EMAIL_PASS,     // app password
  },
});

export const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/reset-password/${token}`;

  const mailOptions = {
    from: `"MyStore Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
