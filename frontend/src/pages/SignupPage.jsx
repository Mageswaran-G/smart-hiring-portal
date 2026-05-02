import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';

// ── Animated Logo Mark ──
function LogoMark({ size = 36, color = '#E65C00' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={color} />
      <path
        d="M10 28 L20 12 L30 28"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#fff',
            display: 'inline-block',
            animation: `dotBlink 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
    </span>
  );
}

// ── Password strength checker ──
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#eee' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: '',        color: '#eee'    },
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f97316' },
    { label: 'Good',   color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...levels[score] };
}

// ── Role options ──
const ROLES = [
  {
    id: 'candidate',
    label: 'Candidate',
    icon: '👤',
    desc: 'Find your dream internship',
    color: '#E65C00',
    benefit: 'Browse 12K+ opportunities',
  },
  {
    id: 'company',
    label: 'Company',
    icon: '🏢',
    desc: 'Hire the best talent',
    color: '#1D3557',
    benefit: 'Access 50K+ candidates',
  },
];

export default function SignupPage() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });

  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused]   = useState(null);
  const [agreed, setAgreed]     = useState(false);

  // Selected role drives left panel accent color
  const selectedRole = ROLES.find((r) => r.id === formData.role) || ROLES[0];
  const accent = selectedRole.color;

  // Password strength
  const strength = getPasswordStrength(formData.password);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Pick role from left panel
  const pickRole = (roleId) => {
    setFormData({ ...formData, role: roleId });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (formData.name.trim().length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms & Privacy Policy.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call backend signup API
      await signup(formData);

      // Show green success message
      setSuccess('Account created! Redirecting to login...');

      // Go to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Global Styles ── */}
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
          40%           { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .sp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f0f0f0;
        }

        .sp-card {
          width: 100%;
          max-width: 960px;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.18);
          background: #fafafa;
          min-height: 620px;
          animation: fadeUp 0.5s ease;
        }

        /* ── Left Panel ── */
        .sp-left {
          width: 360px;
          flex-shrink: 0;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          padding: 44px 40px;
          border-right: 1px solid #eee;
          position: relative;
          overflow: hidden;
        }

        .sp-stripe {
          position: absolute;
          top: 0; left: 0;
          width: 4px; height: 100%;
          transition: background 0.4s;
          animation: stripeSlide 0.6s ease forwards;
        }

        .sp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
          animation: logoPulse 3s ease-in-out infinite;
        }

        .sp-logo-text {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #0a0a14;
          letter-spacing: -0.5px;
        }

        .sp-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 14px;
          transition: color 0.4s;
        }

        .sp-big-text {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 36px;
          line-height: 1.1;
          color: #0a0a14;
          letter-spacing: -1.5px;
          margin-bottom: 16px;
        }

        .sp-tagline {
          font-size: 13px;
          color: #888;
          line-height: 1.8;
          margin-bottom: 28px;
        }

        /* Role Cards */
        .sp-role-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: auto;
        }

        .sp-role-card {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #eee;
          background: transparent;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-align: left;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }

        .sp-role-card:hover {
          transform: translateX(2px);
        }

        .sp-role-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .sp-role-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .sp-role-label {
          font-size: 13px;
          font-weight: 600;
        }

        .sp-role-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-left: auto;
          flex-shrink: 0;
        }

        .sp-role-benefit {
          font-size: 11px;
          color: #999;
          padding-left: 30px;
        }

        /* Footer */
        .sp-footer {
          border-top: 1px solid #eee;
          padding-top: 20px;
          margin-top: 24px;
        }

        .sp-copyright {
          font-size: 11px;
          color: #bbb;
          letter-spacing: 0.5px;
        }

        /* ── Right Panel ── */
        .sp-right {
          flex: 1;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          padding: 40px 48px;
          overflow-y: auto;
        }

        .sp-topbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 28px;
        }

        .sp-topbar-text {
          font-size: 13px;
          color: #aaa;
        }

        .sp-form-title {
          font-family: 'Sora', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a14;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .sp-form-sub {
          font-size: 13px;
          color: #aaa;
          margin-bottom: 24px;
        }

        .sp-label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: #555;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .sp-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #0a0a14;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .sp-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: fadeUp 0.3s ease;
        }

        /* Two column row */
        .sp-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Password strength bar */
        .sp-strength-bar {
          display: flex;
          gap: 4px;
          margin-top: 6px;
        }

        .sp-strength-segment {
          flex: 1;
          height: 3px;
          border-radius: 2px;
          transition: background 0.3s;
        }

        .sp-strength-label {
          font-size: 11px;
          margin-top: 4px;
          transition: color 0.3s;
        }

        /* Submit button */
        .sp-submit {
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 4px;
        }

        .sp-submit:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .sp-submit:active { transform: translateY(0); }
        .sp-submit:disabled { cursor: not-allowed; opacity: 0.7; }

        /* Status boxes */
        .sp-error-box {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          animation: fadeUp 0.3s ease;
        }

        .sp-success-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #16a34a;
          animation: fadeUp 0.3s ease;
        }

        /* Progress steps */
        .sp-steps {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 24px;
        }

        .sp-step {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #bbb;
          font-weight: 500;
        }

        .sp-step-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: #999;
          transition: background 0.3s, color 0.3s;
        }

        .sp-step-line {
          flex: 1;
          height: 1px;
          background: #eee;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .sp-left { display: none; }
          .sp-right { padding: 32px 24px; }
          .sp-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sp-page">
        <div className="sp-card">

          {/* ══════════════════════════
              LEFT PANEL
          ══════════════════════════ */}
          <div className="sp-left">

            {/* Accent stripe */}
            <div className="sp-stripe" style={{ background: accent }} />

            {/* Logo */}
            <div className="sp-logo">
              <LogoMark size={36} color={accent} />
              <span className="sp-logo-text">HirePortal</span>
            </div>

            {/* Editorial text */}
            <div className="sp-eyebrow" style={{ color: accent }}>
              Start your journey
            </div>
            <h1 className="sp-big-text">
              Your next<br />
              <span style={{ color: accent, transition: 'color 0.4s' }}>
                big break
              </span>
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
                    <span
                      className="sp-role-label"
                      style={{ color: formData.role === r.id ? r.color : '#333' }}
                    >
                      {r.label}
                    </span>
                    {formData.role === r.id && (
                      <span
                        className="sp-role-dot"
                        style={{ background: r.color }}
                      />
                    )}
                  </div>
                  <div className="sp-role-benefit">{r.benefit}</div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="sp-footer">
              <div className="sp-copyright">© 2026 HirePortal Inc.</div>
            </div>
          </div>

          {/* ══════════════════════════
              RIGHT PANEL — Form
          ══════════════════════════ */}
          <div className="sp-right">

            {/* Top bar */}
            <div className="sp-topbar">
              <span className="sp-topbar-text">
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: accent,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'color 0.4s',
                  }}
                >
                  Sign in →
                </Link>
              </span>
            </div>

            {/* Progress steps */}
            <div className="sp-steps">
              <div className="sp-step">
                <div
                  className="sp-step-dot"
                  style={{ background: accent, color: '#fff' }}
                >
                  1
                </div>
                <span style={{ color: accent }}>Your details</span>
              </div>
              <div className="sp-step-line" />
              <div className="sp-step">
                <div className="sp-step-dot">2</div>
                <span>Profile setup</span>
              </div>
              <div className="sp-step-line" />
              <div className="sp-step">
                <div className="sp-step-dot">3</div>
                <span>Get started</span>
              </div>
            </div>

            <h2 className="sp-form-title">Create your account</h2>
            <p className="sp-form-sub">
              {selectedRole.desc} — fill in your details below
            </p>

            {/* Error message */}
            {error && (
              <div className="sp-error-box" style={{ marginBottom: 14 }}>
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="sp-success-box" style={{ marginBottom: 14 }}>
                {success}
              </div>
            )}

            <form className="sp-form" onSubmit={handleSubmit}>

              {/* Full Name */}
              <div>
                <label className="sp-label">Full Name</label>
                <input
                  className="sp-input"
                  type="text"
                  name="name"
                  placeholder="Mageswaran G"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  required
                  style={{
                    border: focused === 'name'
                      ? `1.5px solid ${accent}`
                      : '1.5px solid #e5e5e5',
                    boxShadow: focused === 'name'
                      ? `0 0 0 3px ${accent}1a`
                      : 'none',
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="sp-label">Email Address</label>
                <input
                  className="sp-input"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  style={{
                    border: focused === 'email'
                      ? `1.5px solid ${accent}`
                      : '1.5px solid #e5e5e5',
                    boxShadow: focused === 'email'
                      ? `0 0 0 3px ${accent}1a`
                      : 'none',
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
                    name="password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('pass')}
                    onBlur={() => setFocused(null)}
                    required
                    style={{
                      border: focused === 'pass'
                        ? `1.5px solid ${accent}`
                        : '1.5px solid #e5e5e5',
                      boxShadow: focused === 'pass'
                        ? `0 0 0 3px ${accent}1a`
                        : 'none',
                      paddingRight: 40,
                    }}
                  />
                  {/* Show/hide toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#bbb',
                      fontSize: 14,
                    }}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>

                {/* Password strength bar — shows while typing */}
                {formData.password && (
                  <div style={{ animation: 'fadeUp 0.2s ease' }}>
                    <div className="sp-strength-bar">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="sp-strength-segment"
                          style={{
                            background: i <= strength.score
                              ? strength.color
                              : '#eee',
                          }}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <div
                        className="sp-strength-label"
                        style={{ color: strength.color }}
                      >
                        {strength.label} password
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  marginTop: 2,
                }}
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{
                    width: 15,
                    height: 15,
                    marginTop: 1,
                    accentColor: accent,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12.5, color: '#888', lineHeight: 1.5 }}>
                  I agree to HirePortal's{' '}
                  <span style={{ color: accent, fontWeight: 600 }}>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span style={{ color: accent, fontWeight: 600 }}>
                    Privacy Policy
                  </span>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="sp-submit"
                disabled={loading || !!success}
                style={{
                  background: accent,
                  boxShadow: `0 4px 18px ${accent}44`,
                  transition: `background 0.4s, opacity 0.2s, transform 0.15s`,
                }}
              >
                {loading ? <LoadingDots /> : `Create ${selectedRole.label} Account →`}
              </button>

              {/* Login link */}
              <div style={{ textAlign: 'center', fontSize: 12.5, color: '#aaa' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: accent,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'color 0.4s',
                  }}
                >
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