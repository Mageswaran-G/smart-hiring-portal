import { ROUTES } from '../../../../constants/routes';
import CompanyAvatar from './CompanyAvatar';
import HiringFunnelCard from './HiringFunnelCard';
import { C } from './dashboardTheme';

export default function CompanyHero({ profile, stats, hireRate, navigate }) {
  return (
    <section style={{ padding: '24px 32px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
        <div style={{ background: C.grad, borderRadius: 24, padding: '28px 32px', color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <CompanyAvatar profile={profile} size={64} border="1.5px solid rgba(255,255,255,0.3)" />
              <div>
                <p style={{ fontSize: 13, opacity: 0.85, margin: '0 0 2px' }}>Welcome back,</p>
                <h1 style={{ fontWeight: 900, fontSize: 28, margin: '0 0 3px', lineHeight: 1.05, letterSpacing: '-0.8px', color: '#fff' }}>
                  {profile?.companyName || profile?.name || 'Company'}
                </h1>
                {profile?.email && <p style={{ fontSize: 12, opacity: 0.75, margin: 0 }}>{profile.email}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile?.industry && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 9999, fontSize: 11.5, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                  {profile.industry}
                </span>
              )}
              {profile?.isVerified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 9999, fontSize: 11.5, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#fff', color: C.dark, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              + Post New Job {'->'}
            </button>
            <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
              View Applicants
            </button>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { label: `${stats.total || 0} jobs`, bg: 'rgba(255,255,255,0.18)' },
                { label: `${stats.applications || 0} applicants`, bg: 'rgba(255,255,255,0.18)' },
                { label: `${stats.shortlisted || 0} shortlisted`, bg: 'rgba(59,130,246,0.5)' },
              ].map(({ label, bg }) => (
                <span key={label} style={{ padding: '7px 12px', borderRadius: 9999, fontSize: 11.5, fontWeight: 600, background: bg, color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <HiringFunnelCard stats={stats} hireRate={hireRate} />
      </div>
    </section>
  );
}
