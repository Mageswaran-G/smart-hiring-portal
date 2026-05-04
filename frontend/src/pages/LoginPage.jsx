import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getErrorMessage } from '../services/authService';
import { useAuth } from '../context/AuthContext';

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

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused]   = useState(null);
  const [view, setView]         = useState('login');

  // Fixed accent color — no role selector needed on login
  const accent = '#E65C00';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(formData);
      loginUser(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ← FIXED: return ( not return {
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
          min-height: 560px;
          animation: fadeUp 0.5s ease;
        }

        /* Left Panel */
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
          top: 0; left: 0;
          width: 4px; height: 100%;
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

        /* Right Panel */
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
        .hp-topbar-text { font-size: 13px; color: #aaa; }
        .hp-form-title {
          font-family: 'Sora', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a14;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .hp-form-sub { font-size: 13px; color: #aaa; margin-bottom: 28px; }
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
        .hp-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .hp-submit:active { transform: translateY(0); }
        .hp-submit:disabled { cursor: not-allowed; }
        .hp-error-box {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          animation: fadeUp 0.3s ease;
        }

        @media (max-width: 700px) {
          .hp-left { display: none; }
          .hp-right { padding: 32px 24px; }
        }
      `}</style>

      <div className="hp-page">
        <div className="hp-card">

          {/* ════════ LEFT PANEL ════════ */}
          <div className="hp-left">

            <div className="hp-stripe" style={{ background: accent }} />

            <div className="hp-logo">
              <LogoMark size={36} color={accent} />
              <span className="hp-logo-text">HirePortal</span>
            </div>

            {/* Editorial content — no role buttons */}
            <div style={{ flex: 1 }}>
              <div className="hp-eyebrow" style={{ color: accent }}>
                 Internship & JOBs
              </div>
              <h1 className="hp-big-text">
                Land your<br />
                <span style={{ color: accent }}>next role.</span>
                <br />Faster.
              </h1>
              <p className="hp-tagline">
                HirePortal connects top students with the companies that need them most.
              </p>
            </div>

            <div className="hp-footer">
              <div className="hp-copyright">© 2026 HirePortal Inc.</div>
            </div>

          </div>{/* ← end hp-left */}

          {/* ════════ RIGHT PANEL ════════ */}
          <div className="hp-right">

            <div className="hp-topbar">
              <span className="hp-topbar-text">
                New to HirePortal?{' '}
                <Link to="/signup" style={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
                  Create account →
                </Link>
              </span>
            </div>

            {/* LOGIN VIEW */}
            {view === 'login' && (
              <>
                <h2 className="hp-form-title">Sign in</h2>
                <p className="hp-form-sub">Welcome back — enter your credentials to continue</p>

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
                        border: focused === 'email' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
                        boxShadow: focused === 'email' ? `0 0 0 3px ${accent}1a` : 'none',
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
                          background: 'none', border: 'none', color: accent,
                          fontSize: 12, cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif', fontWeight: 500,
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
                          border: focused === 'pass' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
                          boxShadow: focused === 'pass' ? `0 0 0 3px ${accent}1a` : 'none',
                          paddingRight: 40,
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        style={{
                          position: 'absolute', right: 12, top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none',
                          cursor: 'pointer', color: '#bbb', fontSize: 14,
                        }}
                      >
                        {showPass ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="hp-submit"
                    disabled={loading}
                    style={{
                      background: accent,
                      boxShadow: `0 4px 18px ${accent}44`,
                    }}
                  >
                    {loading ? <LoadingDots /> : 'Continue →'}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 12.5, color: '#aaa', marginTop: 4 }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
                      Sign up
                    </Link>
                  </div>

                </form>
              </>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {view === 'forgot' && (
              <div style={{ animation: 'fadeUp 0.3s ease' }}>
                <h2 className="hp-form-title">Reset password</h2>
                <p className="hp-form-sub">Enter your email and we'll send a reset link.</p>

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
                    display: 'block', margin: '14px auto 0',
                    background: 'none', border: 'none',
                    color: accent, fontSize: 13, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', fontWeight: 500,
                  }}
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

          </div>{/* ← end hp-right */}

        </div>
      </div>
    </>
  );
}