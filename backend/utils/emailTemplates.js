// emailTemplates
// HTML email templates for each application status
// Called by emailService.js — never directly by controllers

// ─── Shared header + footer wrapper ──────────────────────────
// Every email uses the same header and footer for consistency
const wrap = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

  <!-- Outer container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">

        <!-- Email card -->
        <table width="100%" style="max-width:560px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c, #f97316); padding: 28px 32px;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.5px;">
                HirePortal
              </h1>
              <p style="margin:4px 0 0; color:rgba(255,255,255,0.8); font-size:13px;">
                Smart Internship &amp; Hiring Portal
              </p>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding: 20px 32px; border-top: 1px solid #f3f4f6;">
              <p style="margin:0; color:#9ca3af; font-size:12px; text-align:center; line-height:1.6;">
                This email was sent by HirePortal. Please do not reply to this email.<br/>
                &copy; ${new Date().getFullYear()} HirePortal. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;


// ─── Shortlisted email ────────────────────────────────────────
// Sent when company moves candidate to "shortlisted"
exports.shortlistedTemplate = ({ candidateName, jobTitle, companyName, portalUrl }) =>
  wrap(`
    <!-- Icon circle -->
    <div style="width:56px; height:56px; background:#dbeafe; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 0 20px;">
      <span style="font-size:26px;">&#x2605;</span>
    </div>

    <h2 style="margin:0 0 8px; color:#111827; font-size:20px; font-weight:800;">
      You have been shortlisted!
    </h2>

    <p style="margin:0 0 20px; color:#6b7280; font-size:15px; line-height:1.6;">
      Hi <strong style="color:#111827;">${candidateName}</strong>,<br/><br/>
      Great news! <strong style="color:#111827;">${companyName}</strong> has shortlisted
      your application for the role of <strong style="color:#111827;">${jobTitle}</strong>.
    </p>

    <!-- Status badge -->
    <div style="background:#dbeafe; border:1px solid #bfdbfe; border-radius:10px; padding:16px 20px; margin:0 0 24px;">
      <p style="margin:0; color:#1e40af; font-size:14px; font-weight:700;">
        Application Status: Shortlisted
      </p>
      <p style="margin:6px 0 0; color:#3b82f6; font-size:13px;">
        The company is reviewing your profile in detail. You may be contacted soon for the next steps.
      </p>
    </div>

    <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.6;">
      Keep your profile updated and be ready to respond. Log in to HirePortal to track your application.
    </p>

    <!-- CTA button -->
    <a href="${portalUrl}"
       style="display:inline-block; background:linear-gradient(135deg,#ea580c,#f97316); color:#ffffff; text-decoration:none; padding:13px 28px; border-radius:10px; font-size:14px; font-weight:700;">
      View My Applications
    </a>

    <p style="margin:24px 0 0; color:#9ca3af; font-size:13px;">
      Best of luck, ${candidateName}!
    </p>
  `);


// ─── Hired email ──────────────────────────────────────────────
// Sent when company moves candidate to "hired"
exports.hiredTemplate = ({ candidateName, jobTitle, companyName, portalUrl }) =>
  wrap(`
    <!-- Celebration header -->
    <div style="background:linear-gradient(135deg,#065f46,#059669); border-radius:12px; padding:24px; margin:0 0 24px; text-align:center;">
      <p style="margin:0 0 6px; font-size:32px;">&#x1F389;</p>
      <h2 style="margin:0; color:#ffffff; font-size:22px; font-weight:900;">
        Congratulations!
      </h2>
      <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">
        You got the job!
      </p>
    </div>

    <p style="margin:0 0 20px; color:#6b7280; font-size:15px; line-height:1.6;">
      Hi <strong style="color:#111827;">${candidateName}</strong>,<br/><br/>
      We are thrilled to let you know that <strong style="color:#111827;">${companyName}</strong>
      has selected you for the role of <strong style="color:#111827;">${jobTitle}</strong>.
    </p>

    <!-- Status badge -->
    <div style="background:#d1fae5; border:1px solid #6ee7b7; border-radius:10px; padding:16px 20px; margin:0 0 24px;">
      <p style="margin:0; color:#065f46; font-size:14px; font-weight:700;">
        Application Status: Hired
      </p>
      <p style="margin:6px 0 0; color:#059669; font-size:13px;">
        The company will reach out to you directly with next steps and onboarding details.
      </p>
    </div>

    <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.6;">
      Make sure your contact details are up to date so the company can reach you easily.
      Log in to HirePortal to view your application details.
    </p>

    <!-- CTA button -->
    <a href="${portalUrl}"
       style="display:inline-block; background:linear-gradient(135deg,#059669,#10b981); color:#ffffff; text-decoration:none; padding:13px 28px; border-radius:10px; font-size:14px; font-weight:700;">
      View My Applications
    </a>

    <p style="margin:24px 0 0; color:#9ca3af; font-size:13px;">
      Wishing you a wonderful journey ahead, ${candidateName}!
    </p>
  `);


// ─── Rejected email ───────────────────────────────────────────
// Sent when company moves candidate to "rejected"
// Polite, encouraging tone — important for candidate experience
exports.rejectedTemplate = ({ candidateName, jobTitle, companyName, portalUrl }) =>
  wrap(`
    <h2 style="margin:0 0 8px; color:#111827; font-size:20px; font-weight:800;">
      Application Update
    </h2>

    <p style="margin:0 0 20px; color:#6b7280; font-size:15px; line-height:1.6;">
      Hi <strong style="color:#111827;">${candidateName}</strong>,<br/><br/>
      Thank you for applying to <strong style="color:#111827;">${jobTitle}</strong>
      at <strong style="color:#111827;">${companyName}</strong>.
    </p>

    <!-- Status badge -->
    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:16px 20px; margin:0 0 24px;">
      <p style="margin:0; color:#991b1b; font-size:14px; font-weight:700;">
        Application Status: Not Selected
      </p>
      <p style="margin:6px 0 0; color:#ef4444; font-size:13px;">
        After careful review, the company has decided to move forward with other candidates.
      </p>
    </div>

    <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.6;">
      Do not be discouraged — every application is a learning experience. 
      Keep your profile strong and continue applying to other opportunities on HirePortal.
    </p>

    <!-- CTA button -->
    <a href="${portalUrl}"
       style="display:inline-block; background:linear-gradient(135deg,#ea580c,#f97316); color:#ffffff; text-decoration:none; padding:13px 28px; border-radius:10px; font-size:14px; font-weight:700;">
      Browse More Jobs
    </a>

    <p style="margin:24px 0 0; color:#9ca3af; font-size:13px;">
      Best wishes for your job search, ${candidateName}.
    </p>
  `);


// ─── Reviewing email ──────────────────────────────────────────
// Sent when company starts reviewing — optional, light notification
exports.reviewingTemplate = ({ candidateName, jobTitle, companyName, portalUrl }) =>
  wrap(`
    <h2 style="margin:0 0 8px; color:#111827; font-size:20px; font-weight:800;">
      Your application is being reviewed
    </h2>

    <p style="margin:0 0 20px; color:#6b7280; font-size:15px; line-height:1.6;">
      Hi <strong style="color:#111827;">${candidateName}</strong>,<br/><br/>
      <strong style="color:#111827;">${companyName}</strong> has started reviewing
      your application for <strong style="color:#111827;">${jobTitle}</strong>.
    </p>

    <!-- Status badge -->
    <div style="background:#dbeafe; border:1px solid #bfdbfe; border-radius:10px; padding:16px 20px; margin:0 0 24px;">
      <p style="margin:0; color:#1e40af; font-size:14px; font-weight:700;">
        Application Status: Under Review
      </p>
      <p style="margin:6px 0 0; color:#3b82f6; font-size:13px;">
        The company is looking at your profile. We will notify you when there is an update.
      </p>
    </div>

    <a href="${portalUrl}"
       style="display:inline-block; background:linear-gradient(135deg,#ea580c,#f97316); color:#ffffff; text-decoration:none; padding:13px 28px; border-radius:10px; font-size:14px; font-weight:700;">
      Track My Application
    </a>
  `);

  // ─── Application received email ───────────────────────────────
exports.applicationReceivedTemplate = ({ candidateName, jobTitle, companyName, portalUrl }) =>
  wrap(`
    <h2 style="margin:0 0 8px; color:#111827; font-size:20px; font-weight:800;">
      Application Submitted!
    </h2>
    <p style="margin:0 0 20px; color:#6b7280; font-size:15px; line-height:1.6;">
      Hi <strong style="color:#111827;">${candidateName}</strong>,<br/><br/>
      Your application for <strong style="color:#111827;">${jobTitle}</strong>
      at <strong style="color:#111827;">${companyName}</strong> was submitted successfully.
    </p>
    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px 20px; margin:0 0 24px;">
      <p style="margin:0; color:#166534; font-size:14px; font-weight:700;">
        Application Received
      </p>
      <p style="margin:6px 0 0; color:#16a34a; font-size:13px;">
        The company will review your profile. You will be notified of any updates.
      </p>
    </div>
    <a href="${portalUrl}"
       style="display:inline-block; background:linear-gradient(135deg,#ea580c,#f97316); color:#ffffff; text-decoration:none; padding:13px 28px; border-radius:10px; font-size:14px; font-weight:700;">
      Track My Application
    </a>
  `);