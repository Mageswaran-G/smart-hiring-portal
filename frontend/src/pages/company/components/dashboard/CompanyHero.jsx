import { ROUTES } from '../../../../constants/routes';
import CompanyAvatar from './CompanyAvatar';
import HiringFunnelCard from './HiringFunnelCard';
import { C } from './dashboardTheme';

export default function CompanyHero({ profile, stats, hireRate, navigate }) {
  return (
    <section style={{ padding: '36px 48px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>
        <div style={{ background: C.grad, borderRadius: 28, padding: '42px 48px', color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 20 }}>
              <CompanyAvatar profile={profile} size={78} border="2px solid rgba(255,255,255,0.38)" />
              <div>
                <p style={{ fontSize: 14, opacity: 0.88, margin: '0 0 5px', letterSpacing: '0.1px' }}>Welcome back,</p>
                <h1 style={{ fontWeight: 900, fontSize: 32, margin: '0 0 5px', lineHeight: 1.05, letterSpacing: '-1px', color: '#fff' }}>
                  {profile?.companyName || profile?.name || 'Company'}
                </h1>
                {profile?.email && <p style={{ fontSize: 13, opacity: 0.78, margin: 0, letterSpacing: '0.1px' }}>{profile.email}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              {profile?.industry && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 9999, fontSize: 12, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', fontWeight: 500 }}>
                  {profile.industry}
                </span>
              )}
              {profile?.isVerified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 9999, fontSize: 12, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', fontWeight: 500 }}>
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', marginTop: 8 }}>
            <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ padding: '13px 26px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: '#fff', color: C.dark, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              + Post New Job {'->'}
            </button>
            <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ padding: '13px 22px', borderRadius: 12, fontSize: 14, fontWeight: 500, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', cursor: 'pointer' }}>
              View Applicants
            </button>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: `${stats.total || 0} jobs`, bg: 'rgba(255,255,255,0.18)' },
                { label: `${stats.applications || 0} applicants`, bg: 'rgba(255,255,255,0.18)' },
                { label: `${stats.shortlisted || 0} shortlisted`, bg: 'rgba(59,130,246,0.5)' },
              ].map(({ label, bg }) => (
                <span key={label} style={{ padding: '8px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: bg, color: '#fff', border: '1px solid rgba(255,255,255,0.22)' }}>
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