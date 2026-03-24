// lib/sendEmail.js
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY in .env.local");
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendEmail: wrapper for Resend SDK
 * @param {Object} options
 * @param {string} options.to - recipient email
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.from] - optional override; default from env
 */
export async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }) {
  try {
    const { data } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });
    return data; // contains message id if successful
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
}
