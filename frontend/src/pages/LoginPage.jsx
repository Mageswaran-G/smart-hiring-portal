import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getErrorMessage } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

// Brand accent color — used for focus rings, buttons, links
const ACCENT = '#E65C00';

// HP logo SVG — shows in left panel
function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={ACCENT} />
      <path d="M10 28 L20 12 L30 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="20" cy="22" r="3.5" fill="white" />
      <circle cx="20" cy="22" r="1.8" fill={ACCENT} />
    </svg>
  );
}

// Animated loading dots — shown inside submit button while logging in
function LoadingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 0.2}s` }}
          className="w-1.5 h-1.5 rounded-full bg-white inline-block"
          // dotBlink animation defined in index.css
          // opacity and scale pulse to indicate loading
          css={{ animation: `dotBlink 1.2s ${i * 0.2}s ease-in-out infinite` }}
        />
      ))}
    </span>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState(null);
  const [view,     setView]     = useState('login'); // 'login' or 'forgot'

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
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Dynamic focus styles — must stay inline because value changes on focus/blur
  const emailStyle = {
    border:    focused === 'email' ? `1.5px solid ${ACCENT}` : '1.5px solid #e5e5e5',
    boxShadow: focused === 'email' ? `0 0 0 3px ${ACCENT}1a` : 'none',
  };
  const passStyle = {
    border:       focused === 'pass' ? `1.5px solid ${ACCENT}` : '1.5px solid #e5e5e5',
    boxShadow:    focused === 'pass' ? `0 0 0 3px ${ACCENT}1a` : 'none',
    paddingRight: 40,
  };

  return (
    <div className="hp-page">
      <div className="hp-card">

        {/* ── LEFT PANEL ── */}
        <div className="hp-left">

          {/* Orange animated stripe on left edge */}
          <div className="hp-stripe" style={{ background: ACCENT }} />

          {/* Logo */}
          <div className="hp-logo">
            <LogoMark size={36} />
            <span className="hp-logo-text">HirePortal</span>
          </div>

          {/* Editorial content */}
          <div style={{ flex: 1 }}>
            <div className="hp-eyebrow" style={{ color: ACCENT }}>
              Internship & Jobs
            </div>
            <h1 className="hp-big-text">
              Land your<br />
              <span style={{ color: ACCENT }}>next role.</span>
              <br />Faster.
            </h1>
            <p className="hp-tagline">
              HirePortal connects top students with the companies that need them most.
            </p>
          </div>

          <div className="hp-footer">
            <div className="hp-copyright">2026 HirePortal Inc.</div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hp-right">

          <div className="hp-topbar">
            <span className="hp-topbar-text">
              New to HirePortal?{' '}
              <Link to={ROUTES.SIGNUP} style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>
                Create account
              </Link>
            </span>
          </div>

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <>
              <h2 className="hp-form-title">Sign in</h2>
              <p className="hp-form-sub">Welcome back — enter your credentials to continue</p>

              {error && <div className="hp-error-box">{error}</div>}

              <form className="hp-form" onSubmit={handleSubmit}>

                {/* Email field */}
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
                    style={emailStyle}
                  />
                </div>

                {/* Password field */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="hp-label" style={{ marginBottom: 0 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-xs cursor-pointer bg-transparent border-none font-medium"
                      style={{ color: ACCENT, fontFamily: 'Inter, sans-serif' }}>
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
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
                      style={passStyle}
                    />
                    {/* Show/hide password toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-300 text-sm">
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="hp-submit"
                  disabled={loading}
                  style={{
                    background:  ACCENT,
                    boxShadow: `0 4px 18px ${ACCENT}44`,
                  }}>
                  {loading ? (
                    // Inline loading dots using CSS animation from index.css
                    <span className="inline-flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                          style={{ animation: `dotBlink 1.2s ${i * 0.2}s ease-in-out infinite` }}
                        />
                      ))}
                    </span>
                  ) : 'Continue'}
                </button>

                <p className="text-center text-xs text-gray-400 mt-1">
                  Don't have an account?{' '}
                  <Link to={ROUTES.SIGNUP} style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>
                    Sign up
                  </Link>
                </p>

              </form>
            </>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot' && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              <h2 className="hp-form-title">Reset password</h2>
              <p className="hp-form-sub">Enter your email and we will send a reset link.</p>

              <div className="mb-4">
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
                style={{ background: ACCENT, boxShadow: `0 4px 18px ${ACCENT}44` }}>
                Send Reset Link
              </button>

              <button
                onClick={() => setView('login')}
                className="block mx-auto mt-4 bg-transparent border-none text-sm cursor-pointer font-medium"
                style={{ color: ACCENT, fontFamily: 'Inter, sans-serif' }}>
                Back to Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}