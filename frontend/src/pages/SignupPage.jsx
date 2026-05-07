import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, getErrorMessage } from '../services/authService';
import { ROUTES } from '../constants/routes';

// Role options — candidate and company only (admin is created directly in DB)
const ROLES = [
  { id: 'candidate', label: 'Candidate', desc: 'Find your dream', color: '#E65C00', benefit: 'Browse Opportunities' },
  { id: 'company',   label: 'Company',   desc: 'Hire the best talent', color: '#1D3557', benefit: 'Access Candidates' },
];

// Progress steps shown at top of form
const STEPS = [
  { num: 1, label: 'Your details' },
  { num: 2, label: 'Profile setup' },
  { num: 3, label: 'Get started' },
];

// Password strength — checks 4 conditions
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#eee' };
  let score = 0;
  if (password.length >= 8)        score++;
  if (/[A-Z]/.test(password))      score++;
  if (/[0-9]/.test(password))      score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { label: '',       color: '#eee' },
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f97316' },
    { label: 'Good',   color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...levels[score] };
}

// HP Logo SVG
function LogoMark({ size = 36, color = '#E65C00' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={color} />
      <path d="M10 28 L20 12 L30 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="20" cy="22" r="3.5" fill="white" />
      <circle cx="20" cy="22" r="1.8" fill={color} />
    </svg>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData,         setFormData]         = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [error,            setError]            = useState('');
  const [success,          setSuccess]          = useState('');
  const [loading,          setLoading]          = useState(false);
  const [showPass,         setShowPass]         = useState(false);
  const [showConfirm,      setShowConfirm]      = useState(false);
  const [focused,          setFocused]          = useState(null);
  const [agreed,           setAgreed]           = useState(false);
  const [currentStep,      setCurrentStep]      = useState(1);

  const selectedRole    = ROLES.find(r => r.id === formData.role) || ROLES[0];
  const accent          = selectedRole.color;
  const strength        = getPasswordStrength(formData.password);
  const passwordsMatch  = confirmPassword.length > 0 && formData.password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && formData.password !== confirmPassword;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim())             { setError('Please enter your full name.'); return; }
    if (formData.name.trim().length < 3)   { setError('Name must be at least 3 characters.'); return; }
    if (formData.password.length < 8)      { setError('Password must be at least 8 characters.'); return; }
    if (!confirmPassword)                  { setError('Please re-type your password.'); return; }
    if (formData.password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreed)                           { setError('Please agree to the Terms and Privacy Policy.'); return; }

    setLoading(true);
    setError('');
    setCurrentStep(2);

    try {
      // Run signup + 2 second wait at same time
      // Makes step 2 visible for at least 2 seconds
      await Promise.all([
        signup(formData),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);
      setCurrentStep(3);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    } catch (err) {
      setCurrentStep(1);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sp-page">
      <div className="sp-card">

        {/* LEFT PANEL */}
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

          {/* Role selector cards */}
          <div className="sp-role-cards">
            {ROLES.map(r => (
              <button
                key={r.id}
                className="sp-role-card"
                onClick={() => setFormData({ ...formData, role: r.id })}
                style={{
                  borderColor: formData.role === r.id ? r.color : '#eee',
                  background:  formData.role === r.id ? `${r.color}0d` : 'transparent',
                }}>
                <div className="sp-role-card-top">
                  <span className="sp-role-label" style={{ color: formData.role === r.id ? r.color : '#333' }}>
                    {r.label}
                  </span>
                  {formData.role === r.id && <span className="sp-role-dot" style={{ background: r.color }} />}
                </div>
                <div className="sp-role-benefit">{r.benefit}</div>
              </button>
            ))}
          </div>

          <div className="sp-footer">
            <div className="sp-copyright">2026 HirePortal Inc.</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="sp-right">

          <div className="sp-topbar">
            <span className="sp-topbar-text">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} style={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </span>
          </div>

          {/* Progress steps */}
          <div className="sp-steps">
            {STEPS.map((step, index) => {
              const isDone    = currentStep > step.num;
              const isActive  = currentStep === step.num;
              return (
                <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: index < STEPS.length - 1 ? 1 : 'none' }}>
                  <div className="sp-step">
                    <div className="sp-step-dot" style={{
                      background: isDone || isActive ? accent : '#eee',
                      color:      isDone || isActive ? '#fff' : '#aaa',
                      transform:  isActive ? 'scale(1.15)' : 'scale(1)',
                    }}>
                      {isDone ? 'Done' : step.num}
                    </div>
                    <span className="sp-step-label" style={{
                      color:      isDone || isActive ? accent : '#bbb',
                      fontWeight: isActive ? 600 : 400,
                    }}>
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="sp-step-line" style={{ background: currentStep > step.num ? accent : '#eee' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form title — changes based on step */}
          <h2 className="sp-form-title">
            {currentStep === 1 && 'Create your account'}
            {currentStep === 2 && 'Creating your account...'}
            {currentStep === 3 && "You're all set!"}
          </h2>
          <p className="sp-form-sub">
            {currentStep === 1 && `${selectedRole.desc} — fill in your details below`}
            {currentStep === 2 && 'Please wait while we set up your account'}
            {currentStep === 3 && 'Your account is ready. Redirecting to login...'}
          </p>

          {error   && <div className="sp-error-box">{error}</div>}
          {success && <div className="sp-success-box">{success}</div>}

          <form className="sp-form" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div>
              <label className="sp-label">Full Name</label>
              <input
                className="sp-input"
                type="text" name="name" placeholder="Enter your full name"
                value={formData.name} onChange={handleChange}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                required disabled={currentStep > 1}
                style={{
                  border:    focused === 'name' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
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
                required disabled={currentStep > 1}
                style={{
                  border:    focused === 'email' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
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
                  required disabled={currentStep > 1}
                  style={{
                    border:       focused === 'pass' ? `1.5px solid ${accent}` : '1.5px solid #e5e5e5',
                    boxShadow:    focused === 'pass' ? `0 0 0 3px ${accent}1a` : 'none',
                    paddingRight: 40,
                  }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-300 text-sm">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Password strength bar */}
              {formData.password && (
                <div style={{ animation: 'fadeUp 0.2s ease' }}>
                  <div className="sp-strength-bar">
                    {[1, 2, 3, 4].map(i => (
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

            {/* Confirm Password */}
            <div>
              <label className="sp-label">Re-type Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="sp-input"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Type your password again"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                  required disabled={currentStep > 1}
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
                <button type="button" onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-300 text-sm">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <div className="sp-match-indicator">
                  <div className="sp-match-dot" style={{ background: passwordsMatch ? '#22c55e' : '#ef4444' }} />
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
                onChange={e => setAgreed(e.target.checked)}
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

            {/* Submit button */}
            <button
              type="submit"
              className="sp-submit"
              disabled={loading || !!success || passwordsMismatch}
              style={{
                background:  accent,
                boxShadow: `0 4px 18px ${accent}44`,
                transition:  'background 0.4s, opacity 0.2s, transform 0.15s',
              }}>
              {loading ? (
                <span className="inline-flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                      style={{ animation: `dotBlink 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                  ))}
                </span>
              ) : `Create ${selectedRole.label} Account`}
            </button>

            <p className="text-center text-xs text-gray-400 mt-1">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} style={{ color: accent, fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}