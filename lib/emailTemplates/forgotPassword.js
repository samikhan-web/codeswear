// lib/emailTemplates/forgotPassword.js
export default function forgotPasswordTemplate({ resetUrl, name }) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; padding:24px; color:#111;">
      <h2 style="margin-bottom:8px">Reset your password</h2>
      <p>Hi ${name || "there"},</p>
      <p>We received a request to reset the password for your CodesWear account. Click the button below to set a new password. This link expires in 15 minutes.</p>
      <p style="margin:24px 0;">
        <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;border-radius:6px;background:#ec4899;color:#fff;text-decoration:none;">
          Reset password
        </a>
      </p>
      <p style="font-size:13px;color:#666">If you did not request a password reset, you can ignore this email — no changes were made.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;">
      <small style="color:#666">If the button doesn't work, copy and paste this URL into your browser: ${resetUrl}</small>
    </div>
  `;
}
