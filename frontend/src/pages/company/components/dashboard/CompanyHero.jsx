import { ROUTES } from '../../../../constants/routes';
import CompanyAvatar from './CompanyAvatar';
import HiringFunnelCard from './HiringFunnelCard';
import { C } from './dashboardTheme';

export default function CompanyHero({ profile, stats, hireRate, navigate }) {
  return (
    <section style={{ padding: '32px 48px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>

        {/* Left — Company Card */}
        <div style={{
          background: C.grad, borderRadius: 24, padding: '36px 42px',
          color: '#fff', position: 'relative', overflow: 'hidden',
          minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: 80, width: 140, height: 140, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', pointerEvents: 'none' }} />
          {/* Dot grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

          {/* Company info */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
              <CompanyAvatar profile={profile} size={72} border="2px solid rgba(255,255,255,0.3)" />
              <div>
                <p style={{ fontSize: 13, opacity: 0.7, margin: '0 0 4px' }}>Welcome back,</p>
                <h1 style={{ fontWeight: 900, fontSize: 28, margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.8px', color: '#fff' }}>
                  {profile?.companyName || profile?.name || 'Company'}
                </h1>
                {profile?.email && (
                  <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>{profile.email}</p>
                )}
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile?.industry && (
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600 }}>
                  {profile.industry}
                </span>
              )}
              {profile?.isVerified && (
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', fontWeight: 700 }}>
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          {/* Bottom — buttons + stats */}
          <div style={{ position: 'relative', marginTop: 8 }}>
            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Jobs', value: stats.total || 0 },
                { label: 'Applications', value: stats.applications || 0 },
                { label: 'Shortlisted', value: stats.shortlisted || 0 },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '6px 14px', textAlign: 'center' }}>
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: 18, lineHeight: 1 }}>{value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{
                padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: '#fff', color: C.dark, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                + Post New Job
              </button>
              <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{
                padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,0.12)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer',
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