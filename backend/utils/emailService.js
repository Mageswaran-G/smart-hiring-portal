// emailService
// Nodemailer setup and email sending functions
// Used by applicationController when status changes

const nodemailer = require('nodemailer');
const config     = require('../config');
const templates  = require('./emailTemplates');

// ─── Create transporter (Gmail SMTP) ─────────────────────────
// Transporter = the "email sender" — reused for all emails
// Gmail requires App Password — not your regular Gmail password
// How to get App Password:
//   1. Go to myaccount.google.com
//   2. Security → 2-Step Verification (must be ON)
//   3. App passwords → Generate for "Mail"
//   4. Copy the 16-character password into EMAIL_PASS in .env

const transporter = nodemailer.createTransport({
  service: 'gmail',          // Gmail SMTP — no host/port needed
  auth: {
    user: config.email.user, // your Gmail address
    pass: config.email.pass, // Gmail App Password (not real password)
  },
});


// ─── Verify connection on startup ────────────────────────────
// Runs when server starts — logs if email is working or not
// Never crashes the server if email fails
const verifyEmailConnection = async () => {
  if (!config.email.enabled) {
    console.log('[EMAIL] Skipped — EMAIL_USER and EMAIL_PASS not set in .env');
    return;
  }
  try {
    await transporter.verify();
    console.log('[EMAIL] Gmail SMTP connected successfully');
  } catch (err) {
    console.error('[EMAIL] Gmail SMTP connection failed:', err.message);
    console.error('[EMAIL] Check EMAIL_USER and EMAIL_PASS in .env');
  }
};

// Call verify when this module loads
verifyEmailConnection();


// ─── Subject + template selector ─────────────────────────────
// Maps each status to the right subject line and template function
const STATUS_EMAIL_CONFIG = {
  reviewing: {
    subject:  'Your application is under review — HirePortal',
    template: templates.reviewingTemplate,
  },
  shortlisted: {
    subject:  'You have been shortlisted! — HirePortal',
    template: templates.shortlistedTemplate,
  },
  hired: {
    subject:  'Congratulations! You got the job — HirePortal',
    template: templates.hiredTemplate,
  },
  rejected: {
    subject:  'Application update — HirePortal',
    template: templates.rejectedTemplate,
  },
};


// ─── Main send function ───────────────────────────────────────
// Called from applicationController after status update
//
// Parameters:
//   to            — candidate's email address
//   candidateName — candidate's full name
//   jobTitle      — job title they applied for
//   companyName   — company name
//   status        — new status (shortlisted / hired / rejected / reviewing)
//
// Never throws — errors are logged, not crashed
// This is intentional: status update must succeed even if email fails

exports.sendStatusEmail = async ({
  to,
  candidateName,
  jobTitle,
  companyName,
  status,
}) => {

  // Skip silently if email is not configured in .env
  if (!config.email.enabled) return;

  // Skip statuses we don't send emails for
  // 'applied' — no email (confirmation is a future feature)
  const emailConfig = STATUS_EMAIL_CONFIG[status];
  if (!emailConfig) return;

  try {
    const portalUrl = `${config.clientUrl}/candidate/applications`;

    // Build HTML using the right template
    const html = emailConfig.template({
      candidateName,
      jobTitle,
      companyName,
      portalUrl,
    });

    // Send the email
    const info = await transporter.sendMail({
      from:    config.email.from,
      to,
      subject: emailConfig.subject,
      html,
    });

    console.log(`[EMAIL] Sent "${status}" email to ${to} — MessageId: ${info.messageId}`);

  } catch (err) {
    // Log error but NEVER crash the server or fail the API response
    // Status update is more important than the email
    console.error(`[EMAIL] Failed to send "${status}" email to ${to}:`, err.message);
  }
};