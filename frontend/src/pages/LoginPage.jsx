import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

// ── Animated Logo Mark (from your design) ──
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

// ── Role options — accent color changes left panel ──
const ROLES = [
  { id: 'candidate', label: 'Candidate', icon: '👤', desc: 'Find your dream', color: '#E65C00' },
  { id: 'company',   label: 'Company',   icon: '🏢', desc: 'Hire the best talent',      color: '#1D3557' },
  { id: 'admin',     label: 'Admin',     icon: '⚙️',  desc: 'Manage the portal',         color: '#6d28d9' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Form state
  const [formData, setFormData]   = useState({ email: '', password: '' });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [focused, setFocused]     = useState(null);
  const [view, setView]           = useState('login'); // 'login' | 'forgot'

  // Role picker — changes left panel accent color
  const [selectedRole, setSelectedRole] = useState('candidate');
  const accent = ROLES.find((r) => r.id === selectedRole)?.color || '#E65C00';
  const roleDesc = ROLES.find((r) => r.id === selectedRole)?.desc || '';

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // clear error on typing
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call backend login API
      const res = await login(formData);

      // Save token + user to shared memory (AuthContext)
      loginUser(res.data.accessToken, res.data.user);

      // Go to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Show backend error message
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Global styles (keyframes, shared input/button) ── */}
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

        .hp-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f0f0f0;
        }

        .hp-card {
          width: 100%;
          max-width: 900px;
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.18);
          background: #fafafa;
          min-height: 580px;
          animation: fadeUp 0.5s ease;
        }

        /* ── Left Panel ── */
        .hp-left {
          width: 380px;
          flex-shrink: 0;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          padding: 44px 44px;
          border-right: 1px solid #eee;
          position: relative;
          overflow: hidden;
        }

        .hp-stripe {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          transition: background 0.4s;
          animation: stripeSlide 0.6s ease forwards;
        }

        .hp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 48px;
          animation: logoPulse 3s ease-in-out infinite;
        }

        .hp-logo-text {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #0a0a14;
          letter-spacing: -0.5px;
        }

        .hp-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
          transition: color 0.4s;
        }

        .hp-big-text {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 42px;
          line-height: 1.1;
          color: #0a0a14;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }

        .hp-tagline {
          font-size: 13.5px;
          color: #888;
          line-height: 1.8;
          max-width: 260px;
        }

        /* Role Selector Pills */
        .hp-roles {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 24px;
        }

        .hp-role-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #eee;
          background: transparent;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #444;
          font-weight: 500;
          transition: border-color 0.2s, background 0.2s;
          text-align: left;
        }

        .hp-role-btn:hover {
          background: #f8f8f8;
        }

        .hp-role-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .hp-footer {
          border-top: 1px solid #eee;
          padding-top: 20px;
          margin-top: auto;
        }

        .hp-copyright {
          font-size: 11px;
          color: #bbb;
          letter-spacing: 0.5px;
        }

        /* ── Right Panel ── */
        .hp-right {
          flex: 1;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          padding: 44px 48px;
          overflow-y: auto;
        }

        .hp-topbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 32px;
        }

        .hp-topbar-text {
          font-size: 13px;
          color: #aaa;
        }

        .hp-form-title {
          font-family: 'Sora', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a14;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .hp-form-sub {
          font-size: 13px;
          color: #aaa;
          margin-bottom: 28px;
        }

        .hp-label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: #555;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .hp-input {
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

        .hp-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeUp 0.3s ease;
        }

        .hp-submit {
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

        .hp-submit:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .hp-submit:active {
          transform: translateY(0);
        }

        .hp-submit:disabled {
          cursor: not-allowed;
        }

        .hp-error-box {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          animation: fadeUp 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .hp-left { display: none; }
          .hp-right { padding: 32px 24px; }
        }
      `}</style>

      <div className="hp-page">
        <div className="hp-card">

          {/* ══════════════════════════
              LEFT PANEL — Editorial
          ══════════════════════════ */}
          <div className="hp-left">

            {/* Accent stripe — changes color with role */}
            <div className="hp-stripe" style={{ background: accent }} />

            {/* Logo */}
            <div className="hp-logo">
              <LogoMark size={36} color={accent} />
              <span className="hp-logo-text">HirePortal</span>
            </div>

            {/* Big editorial text */}
            <div style={{ flex: 1 }}>
              <div className="hp-eyebrow" style={{ color: accent }}>
                {roleDesc}
              </div>
              <h1 className="hp-big-text">
                Land your<br />
                <span style={{ color: accent, transition: 'color 0.4s' }}>
                  next role.
                </span>
                <br />Faster.
              </h1>
              <p className="hp-tagline">
                HirePortal connects top students with the companies that need them most.
              </p>

              {/* Role selector — accent changes with pick */}
              <div className="hp-roles">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    className="hp-role-btn"
                    onClick={() => setSelectedRole(r.id)}
                    style={{
                      borderColor: selectedRole === r.id ? accent : '#eee',
                      background: selectedRole === r.id ? `${accent}0d` : 'transparent',
                      color: selectedRole === r.id ? accent : '#444',
                    }}
                  >
                    <span className="hp-role-icon">{r.icon}</span>
                    <span>{r.label}</span>
                    {selectedRole === r.id && (
                      <span style={{
                        marginLeft: 'auto',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: accent,
                        flexShrink: 0,
                      }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="hp-footer">
              <div className="hp-copyright">© 2026 HirePortal Inc.</div>
            </div>
          </div>

          {/* ══════════════════════════
              RIGHT PANEL — Form
          ══════════════════════════ */}
          <div className="hp-right">

            {/* Top bar */}
            <div className="hp-topbar">
              <span className="hp-topbar-text">
                New to HirePortal?{' '}
                <Link
                  to="/signup"
                  style={{ color: accent, fontWeight: 600, textDecoration: 'none', transition: 'color 0.4s' }}
                >
                  Create account →
                </Link>
              </span>
            </div>

            {/* ── LOGIN VIEW ── */}
            {view === 'login' && (
              <>
                <h2 className="hp-form-title">Sign in</h2>
                <p className="hp-form-sub">Welcome back — enter your credentials to continue</p>

                {/* Error message */}
                {error && (
                  <div className="hp-error-box" style={{ marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <form className="hp-form" onSubmit={handleSubmit}>

                  {/* Email */}
                  <div>
                    <label className="hp-label">Email</label>
                    <input
                      className="hp-input"
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                      <label className="hp-label" style={{ marginBottom: 0 }}>Password</label>
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: accent,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          transition: 'color 0.4s',
                        }}
                      >
                        Forgot?
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="hp-input"
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
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
                      {/* Show/hide password toggle */}
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
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="hp-submit"
                    disabled={loading}
                    style={{
                      background: accent,
                      boxShadow: `0 4px 18px ${accent}44`,
                      transition: `background 0.4s, opacity 0.2s, transform 0.15s`,
                    }}
                  >
                    {loading ? <LoadingDots /> : 'Continue →'}
                  </button>

                  {/* Sign up link */}
                  <div style={{ textAlign: 'center', fontSize: 12.5, color: '#aaa', marginTop: 4 }}>
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      style={{ color: accent, fontWeight: 600, textDecoration: 'none', transition: 'color 0.4s' }}
                    >
                      Sign up free
                    </Link>
                  </div>

                </form>
              </>
            )}

            {/* ── FORGOT PASSWORD VIEW ── */}
            {view === 'forgot' && (
              <div style={{ animation: 'fadeUp 0.3s ease' }}>
                <h2 className="hp-form-title">Reset password</h2>
                <p className="hp-form-sub">
                  Enter your email and we'll send a reset link.
                </p>

                <div style={{ marginBottom: 14 }}>
                  <label className="hp-label">Email address</label>
                  <input
                    className="hp-input"
                    type="email"
                    placeholder="your@email.com"
                    style={{ border: '1.5px solid #e5e5e5' }}
                  />
                </div>

                <button
                  className="hp-submit"
                  style={{ background: accent, boxShadow: `0 4px 18px ${accent}44` }}
                >
                  Send Reset Link
                </button>

                <button
                  onClick={() => setView('login')}
                  style={{
                    display: 'block',
                    margin: '14px auto 0',
                    background: 'none',
                    border: 'none',
                    color: accent,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    transition: 'color 0.4s',
                  }}
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}