import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, getErrorMessage } from '../services/authService';

// ── Animated Logo Mark ──
function LogoMark({ size = 36, color = '#E65C00' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={color} />
      <path d="M10 28 L20 12 L30 28" stroke="white" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="20" cy="22" r="3.5" fill="white" />
      <circle cx="20" cy="22" r="1.8" fill={color} />
    </svg>
  );
}

// ── Animated Loading Dots ──
function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: '#fff',
          display: 'inline-block',
          animation: `dotBlink 1.2s ${i * 0.2}s ease-in-out infinite`,
        }} />
      ))}
    </span>
  );
}

// ── Password strength checker ──
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#eee' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: '', color: '#eee' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f97316' },
    { label: 'Good', color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...levels[score] };
}

// ── CHANGE 3: Removed numbers from benefit text ──
const ROLES = [
  {
    id: 'candidate',
    label: 'Candidate',
    icon: '👤',
    desc: 'Find your dream',
    color: '#E65C00',
    benefit: 'Browse Opportunities',
  },
  {
    id: 'company',
    label: 'Company',
    icon: '🏢',
    desc: 'Hire the best talent',
    color: '#1D3557',
    benefit: 'Access Candidates',
  },
];

// ── CHANGE 2: Step config ──
// currentStep: 1 = filling form, 2 = submitted/loading, 3 = success
const STEPS = [
  { num: 1, label: 'Your details' },
  { num: 2, label: 'Profile setup' },
  { num: 3, label: 'Get started' },
];

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'candidate',
  });

  // CHANGE 1: Confirm password state
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // CHANGE 1: show/hide confirm
  const [focused, setFocused]   = useState(null);
  const [agreed, setAgreed]     = useState(false);

  // CHANGE 2: Track current step (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);

  const selectedRole = ROLES.find((r) => r.id === formData.role) || ROLES[0];
  const accent = selectedRole.color;
  const strength = getPasswordStrength(formData.password);

  // CHANGE 1: Check if passwords match
  const passwordsMatch = confirmPassword.length > 0 && formData.password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && formData.password !== confirmPassword;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const pickRole = (roleId) => {
    setFormData({ ...formData, role: roleId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) { setError('Please enter your full name.'); return; }
    if (formData.name.trim().length < 3) { setError('Name must be at least 3 characters.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    // CHANGE 1: Check confirm password
    if (!confirmPassword) { setError('Please re-type your password.'); return; }
    if (formData.password !== confirmPassword) { setError('Passwords do not match. Please check and try again.'); return; }

    if (!agreed) { setError('Please agree to the Terms & Privacy Policy.'); return; }

    setLoading(true);
    setError('');

    // CHANGE 2: Move to step 2 when button is clicked
    setCurrentStep(2);

    try {
      // Run signup API AND a 2 second wait at the same time
      // Both must finish before moving to step 3
      // This makes step 2 visible for at least 2 seconds
      await Promise.all([
        signup(formData),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      // Move to step 3 after 2 seconds minimum
      setCurrentStep(3);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      // CHANGE 2: Go back to step 1 if error
      setCurrentStep(1);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f0f0; font-family: 'Inter', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stripeSlide {
          from { transform: scaleY(0); transform-origin: top; }
          to   { transform: scaleY(1); transform-origin: top; }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%           { opacity: 1; transform: scale(1.1); }
        }

        .sp-page {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; padding: 24px; background: #f0f0f0;
        }
        .sp-card {
          width: 100%; max-width: 960px; display: flex; border-radius: 20px;
          overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.18);
          background: #fafafa; min-height: 640px; animation: fadeUp 0.5s ease;
        }

        /* Left Panel */
        .sp-left {
          width: 360px; flex-shrink: 0; background: #ffffff;
          display: flex; flex-direction: column; padding: 44px 40px;
          border-right: 1px solid #eee; position: relative; overflow: hidden;
        }
        .sp-stripe {
          position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          transition: background 0.4s; animation: stripeSlide 0.6s ease forwards;
        }
        .sp-logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 40px;
          animation: logoPulse 3s ease-in-out infinite;
        }
        .sp-logo-text {
          font-family: 'Sora', sans-serif; font-weight: 800;
          font-size: 18px; color: #0a0a14; letter-spacing: -0.5px;
        }
        .sp-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; margin-bottom: 14px; transition: color 0.4s;
        }
        .sp-big-text {
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 36px;
          line-height: 1.1; color: #0a0a14; letter-spacing: -1.5px; margin-bottom: 16px;
        }
        .sp-tagline {
          font-size: 13px; color: #888; line-height: 1.8; margin-bottom: 28px;
        }
        .sp-role-cards { display: flex; flex-direction: column; gap: 10px; margin-bottom: auto; }
        .sp-role-card {
          padding: 14px 16px; border-radius: 12px; border: 1.5px solid #eee;
          background: transparent; cursor: pointer; font-family: 'Inter', sans-serif;
          text-align: left; transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }
        .sp-role-card:hover { transform: translateX(2px); }
        .sp-role-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
        .sp-role-icon { font-size: 16px; width: 20px; text-align: center; }
        .sp-role-label { font-size: 13px; font-weight: 600; }
        .sp-role-dot { width: 6px; height: 6px; border-radius: 50%; margin-left: auto; flex-shrink: 0; }
        .sp-role-benefit { font-size: 11px; color: #999; padding-left: 30px; }
        .sp-footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 24px; }
        .sp-copyright { font-size: 11px; color: #bbb; letter-spacing: 0.5px; }

        /* Right Panel */
        .sp-right {
          flex: 1; background: #fafafa; display: flex; flex-direction: column;
          padding: 40px 48px; overflow-y: auto;
        }
        .sp-topbar { display: flex; justify-content: flex-end; margin-bottom: 28px; }
        .sp-topbar-text { font-size: 13px; color: #aaa; }
        .sp-form-title {
          font-family: 'Sora', sans-serif; font-size: 24px; font-weight: 700;
          color: #0a0a14; letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .sp-form-sub { font-size: 13px; color: #aaa; margin-bottom: 24px; }
        .sp-label {
          display: block; font-size: 11.5px; font-weight: 600; color: #555;
          letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 7px;
        }
        .sp-input {
          width: 100%; padding: 12px 14px; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; color: #0a0a14;
          background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sp-form { display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.3s ease; }

        /* Password strength */
        .sp-strength-bar { display: flex; gap: 4px; margin-top: 6px; }
        .sp-strength-segment { flex: 1; height: 3px; border-radius: 2px; transition: background 0.3s; }
        .sp-strength-label { font-size: 11px; margin-top: 4px; transition: color 0.3s; }

        /* Submit */
        .sp-submit {
          width: 100%; height: 46px; border: none; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; color: #fff; display: flex; align-items: center;
          justify-content: center; gap: 8px; transition: opacity 0.2s, transform 0.15s; margin-top: 4px;
        }
        .sp-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .sp-submit:active { transform: translateY(0); }
        .sp-submit:disabled { cursor: not-allowed; opacity: 0.7; }

        /* Status boxes */
        .sp-error-box {
          background: #fff5f5; border: 1px solid #fecaca; border-radius: 8px;
          padding: 10px 14px; font-size: 13px; color: #dc2626; animation: fadeUp 0.3s ease;
        }
        .sp-success-box {
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
          padding: 10px 14px; font-size: 13px; color: #16a34a; animation: fadeUp 0.3s ease;
        }

        /* CHANGE 2: Progress steps */
        .sp-steps {
          display: flex; align-items: center; gap: 8px; margin-bottom: 24px;
        }
        .sp-step { display: flex; align-items: center; gap: 6px; }
        .sp-step-label { font-size: 11px; font-weight: 500; transition: color 0.4s; white-space: nowrap; }
        .sp-step-dot {
          width: 22px; height: 22px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; font-size: 10px;
          font-weight: 700; flex-shrink: 0; transition: background 0.4s, color 0.4s, transform 0.3s;
        }
        .sp-step-line { flex: 1; height: 1.5px; transition: background 0.4s; }

        /* CHANGE 1: Password match indicator */
        .sp-match-indicator {
          font-size: 11px; margin-top: 5px; display: flex; align-items: center; gap: 4px;
          animation: fadeUp 0.2s ease;
        }
        .sp-match-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .sp-left { display: none; }
          .sp-right { padding: 32px 24px; }
        }
      `}</style>

      <div className="sp-page">
        <div className="sp-card">

          {/* ════════ LEFT PANEL ════════ */}
          <div className="sp-left">
            <div className="sp-stripe" style={{ background: accent }} />

            <div className="sp-logo">
              <LogoMark size={36} color={accent} />
              <span className="sp-logo-text">HirePortal</span>
            </div>

            <div className="sp-eyebrow" style={{ color: accent }}>Start your journey</div>
            <h1 className="sp-big-text">
              Your next<br />
              <span style={{ color: accent, transition: 'color 0.4s' }}>big break</span>
              <br />awaits.
            </h1>
            <p className="sp-tagline">
              Join thousands of students and companies already using HirePortal.
            </p>

            {/* Role cards */}
            <div className="sp-role-cards">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  className="sp-role-card"
                  onClick={() => pickRole(r.id)}
                  style={{
                    borderColor: formData.role === r.id ? r.color : '#eee',
                    background: formData.role === r.id ? `${r.color}0d` : 'transparent',
                  }}
                >
                  <div className="sp-role-card-top">
                    <span className="sp-role-icon">{r.icon}</span>
                    <span className="sp-role-label" style={{ color: formData.role === r.id ? r.color : '#333' }}>
                      {r.label}
                    </span>
                    {formData.role === r.id && (
                      <span className="sp-role-dot" style={{ background: r.color }} />
                    )}
                  </div>
                  {/* CHANGE 3: Shortened benefit text */}
                  <div className="sp-role-benefit">{r.benefit}</div>
                </button>
              ))}
            </div>

            <div className="sp-footer">
              <div className="sp-copyright">© 2026 HirePortal Inc.</div>
            </div>
          </div>

          {/* ════════ RIGHT PANEL ════════ */}
          <div className="sp-right">

            {/* Top bar */}
            <div className="sp-topbar">
              <span className="sp-topbar-text">
                Already have an account?{' '}
                <Link to="/login" style={{ color: accent, fontWeight: 600, textDecoration: 'none', transition: 'color 0.4s' }}>
                  Sign in →
                </Link>
              </span>
            </div>

            {/* CHANGE 2: Animated Progress Steps */}
            <div className="sp-steps">
              {STEPS.map((step, index) => {
                // Is this step done (past)?
                const isDone    = currentStep > step.num;
                // Is this step currently active?
                const isActive  = currentStep === step.num;
                // Is this step not reached yet?
                const isPending = currentStep < step.num;

                return (
                  <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: index < STEPS.length - 1 ? 1 : 'none' }}>
                    <div className="sp-step">
                      {/* Step circle */}
                      <div
                        className="sp-step-dot"
                        style={{
                          background: isDone ? accent : isActive ? accent : '#eee',
                          color:      isDone ? '#fff' : isActive ? '#fff' : '#aaa',
                          transform:  isActive ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        {/* Show tick if done, else show number */}
                        {isDone ? '✓' : step.num}
                      </div>
                      {/* Step label */}
                      <span
                        className="sp-step-label"
                        style={{
                          color: isDone ? accent : isActive ? accent : '#bbb',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Line between steps */}
                    {index < STEPS.length - 1 && (
                      <div
                        className="sp-step-line"
                        style={{ background: currentStep > step.num ? accent : '#eee' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Form title — changes based on step */}
            <h2 className="sp-form-title">
              {currentStep === 1 && 'Create your account'}
              {currentStep === 2 && 'Creating your account...'}
              {currentStep === 3 && 'You\'re all set!'}
            </h2>
            <p className="sp-form-sub">
              {currentStep === 1 && `${selectedRole.desc} — fill in your details below`}
              {currentStep === 2 && 'Please wait while we set up your account'}
              {currentStep === 3 && 'Your account is ready. Redirecting to login...'}
            </p>

            {/* Error message */}
            {error && <div className="sp-error-box" style={{ marginBottom: 14 }}>{error}</div>}

            {/* Success message */}
            {success && <div className="sp-success-box" style={{ marginBottom: 14 }}>{success}</div>}

            <form className="sp-form" onSubmit={handleSubmit}>

              {/* Full Name */}
              <div>
                <label className="sp-label">Full Name</label>
                <input
                  className="sp-input"
                  type="text" name="name" placeholder="Enter your full name"
                  value={formData.name} onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                  required
                  disabled={currentStep > 1}
                  style={{
                    border: focused === 'name' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
                    boxShadow: focused === 'name' ? `0 0 0 3px ${accent}1a` : 'none',
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="sp-label">Email Address</label>
                <input
                  className="sp-input"
                  type="email" name="email" placeholder="your@email.com"
                  value={formData.email} onChange={handleChange}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  required
                  disabled={currentStep > 1}
                  style={{
                    border: focused === 'email' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
                    boxShadow: focused === 'email' ? `0 0 0 3px ${accent}1a` : 'none',
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="sp-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="sp-input"
                    type={showPass ? 'text' : 'password'}
                    name="password" placeholder="Min 8 characters"
                    value={formData.password} onChange={handleChange}
                    onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)}
                    required
                    disabled={currentStep > 1}
                    style={{
                      border: focused === 'pass' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
                      boxShadow: focused === 'pass' ? `0 0 0 3px ${accent}1a` : 'none',
                      paddingRight: 40,
                    }}
                  />
                  <button type="button" onClick={() => setShowPass((s) => !s)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 14,
                  }}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>

                {/* Password strength bar */}
                {formData.password && (
                  <div style={{ animation: 'fadeUp 0.2s ease' }}>
                    <div className="sp-strength-bar">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="sp-strength-segment"
                          style={{ background: i <= strength.score ? strength.color : '#eee' }} />
                      ))}
                    </div>
                    {strength.label && (
                      <div className="sp-strength-label" style={{ color: strength.color }}>
                        {strength.label} password
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CHANGE 1: Confirm Password field */}
              <div>
                <label className="sp-label">Re-type Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="sp-input"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Type your password again"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused(null)}
                    required
                    disabled={currentStep > 1}
                    style={{
                      border: passwordsMismatch
                        ? '1.5px solid #ef4444'
                        : passwordsMatch
                        ? '1.5px solid #22c55e'
                        : focused === 'confirm'
                        ? `1.5px solid ${accent}`
                        : '1.5px solid #e5e5e5',
                      boxShadow: passwordsMismatch
                        ? '0 0 0 3px #ef44441a'
                        : passwordsMatch
                        ? '0 0 0 3px #22c55e1a'
                        : focused === 'confirm'
                        ? `0 0 0 3px ${accent}1a`
                        : 'none',
                      paddingRight: 40,
                    }}
                  />
                  {/* Show/hide confirm toggle */}
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 14,
                  }}>
                    {showConfirm ? '🙈' : '👁'}
                  </button>
                </div>

                {/* CHANGE 1: Match / Mismatch indicator */}
                {confirmPassword.length > 0 && (
                  <div className="sp-match-indicator">
                    <div className="sp-match-dot" style={{
                      background: passwordsMatch ? '#22c55e' : '#ef4444'
                    }} />
                    <span style={{ color: passwordsMatch ? '#16a34a' : '#dc2626' }}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 2 }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={currentStep > 1}
                  style={{ width: 15, height: 15, marginTop: 1, accentColor: accent, cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: 12.5, color: '#888', lineHeight: 1.5 }}>
                  I agree to HirePortal's{' '}
                  <span style={{ color: accent, fontWeight: 600 }}>Terms of Service</span>{' '}
                  and{' '}
                  <span style={{ color: accent, fontWeight: 600 }}>Privacy Policy</span>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="sp-submit"
                disabled={loading || !!success || passwordsMismatch}
                style={{
                  background: accent,
                  boxShadow: `0 4px 18px ${accent}44`,
                  transition: `background 0.4s, opacity 0.2s, transform 0.15s`,
                }}
              >
                {loading ? <LoadingDots /> : `Create ${selectedRole.label} Account →`}
              </button>

              {/* Sign in link */}
              <div style={{ textAlign: 'center', fontSize: 12.5, color: '#aaa' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: accent, fontWeight: 600, textDecoration: 'none', transition: 'color 0.4s' }}>
                  Sign in
                </Link>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  );
}