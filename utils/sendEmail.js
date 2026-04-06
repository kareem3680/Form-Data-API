import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "config.env", quiet: true });

/**
 * Email Utility (Brevo SMTP Edition)
 * Works perfectly on Vercel (no IP restrictions)
 */

/* ------------------------- Config / Helpers ------------------------- */

const env = {
  smtpUser: process.env.BREVO_SMTP_USER,
  smtpPass: process.env.BREVO_SMTP_PASS,
  from: process.env.EMAIL_FROM,
  brand: process.env.EMAIL_BRAND_NAME || "YouTurkeyTech",
};

// Basic HTML escaping
function escapeHtml(unsafe = "") {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ------------------------- HTML Template ------------------------- */

function buildHtml({ message, title = env.brand }) {
  const safeMessage = message.replace(/\n/g, "<br/>");

  return `
<div style="font-family:Arial,sans-serif;font-size:15px;color:#111827;line-height:1.6">
  <h2 style="color:#0ea5a4;margin-bottom:12px">${escapeHtml(title)}</h2>
  <div>${safeMessage}</div>
  <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
  <div style="font-size:13px;color:#6b7280">
    This email was sent by ${escapeHtml(title)}.
  </div>
</div>
`;
}

/* ------------------------- Transporter ------------------------- */

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

/* ------------------------- sendEmail Function ------------------------- */

const sendEmail = async (options = {}) => {
  const { email, subject, message, html, from } = options;

  if (!email) throw new Error("sendEmail: 'email' is required");
  if (!subject) throw new Error("sendEmail: 'subject' is required");
  if (!message && !html)
    throw new Error("sendEmail: 'message' or 'html' is required");

  if (!env.smtpUser || !env.smtpPass) {
    console.error("🛑 Missing SMTP credentials");
    return;
  }

  const htmlContent =
    html ||
    buildHtml({
      message,
      title: env.brand,
    });

  try {
    await transporter.sendMail({
      from: `"${env.brand}" <${from || env.from}>`,
      to: email,
      subject,
      html: htmlContent,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (err) {
    console.error("🛑 Email sending failed:", err.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
