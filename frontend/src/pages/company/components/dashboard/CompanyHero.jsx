import { ROUTES } from '../../../../constants/routes';
import CompanyAvatar from './CompanyAvatar';
import HiringFunnelCard from './HiringFunnelCard';
import { C } from './dashboardTheme';

export default function CompanyHero({ profile, stats, hireRate, navigate }) {
  return (
    <section style={{ padding: '28px 32px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Left — Company Card */}
        <div style={{
          background: C.grad,
          borderRadius: 24, padding: '36px 40px',
          color: '#fff', position: 'relative', overflow: 'hidden',
          minHeight: 250, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(14,30,64,0.4)',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(59,130,246,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: 60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
          {/* Dot grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

          {/* Company info */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <CompanyAvatar profile={profile} size={70}
                  border="2px solid rgba(255,255,255,0.25)"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
                />
                
              </div>
              <div>
                <p style={{ fontSize: 12, opacity: 0.6, margin: '0 0 4px', letterSpacing: '0.2px' }}>Welcome back,</p>
                <h1 style={{ fontWeight: 900, fontSize: 26, margin: '0 0 3px', lineHeight: 1.1, letterSpacing: '-0.8px', color: '#fff' }}>
                  {profile?.companyName || profile?.name || 'Company'}
                </h1>
                <p style={{ fontSize: 12, opacity: 0.55, margin: 0 }}>{profile?.email}</p>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {profile?.industry && (
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  {profile.industry}
                </span>
              )}
              {profile?.isVerified && (
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', fontWeight: 700 }}>
                  ✓ Verified
                </span>
              )}
              <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 5px rgba(74,222,128,0.8)' }} />
                Active
              </span>
            </div>
          </div>

          {/* Bottom — stats + buttons */}
          <div style={{ position: 'relative', marginTop: 12 }}>
            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Jobs',         value: stats.total           || 0 },
                { label: 'Applications', value: stats.applications    || 0 },
                { label: 'Shortlisted',  value: stats.shortlisted     || 0 },
                { label: 'Views',        value: stats.totalViews      || 0 },
                { label: 'Conversion',   value: `${stats.conversionRate || 0}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '7px 16px', textAlign: 'center',
                }}>
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: 20, lineHeight: 1 }}>{value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{
                padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 800,
                background: '#fff', color: C.dark, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                letterSpacing: '-0.2px',
              }}>
                + Post New Job
              </button>
              <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{
                padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}>
                View Applicants
              </button>
            </div>
          </div>
        </div>

        {/* Right — Hiring Funnel */}
        <HiringFunnelCard stats={stats} hireRate={hireRate} />
      </div>
    </section>
  );
}
