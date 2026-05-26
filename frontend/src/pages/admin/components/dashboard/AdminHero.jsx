import SystemStatusCard from './SystemStatusCard';
import { ProgressRing } from '../../../../components/ui/charts';
import { COLORS, GRADIENTS } from '../../../../theme/adminTheme';

export default function AdminHero({ adminName, adminEmail, stats, hireRate }) {
  return (
    <section style={{
      background: GRADIENTS.admin,
      padding: '52px 56px 64px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative circles */}
      <div style={{
        position: 'absolute', top: -80, right: 320,
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(167,139,250,0.08)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: 100,
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(124,58,237,0.12)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 40,
        position: 'relative', zIndex: 1,
      }}>

        {/* Left: Admin Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed, #4c1d95)',
              padding: 3,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 34,
                letterSpacing: '-1px',
              }}>
                {adminName[0].toUpperCase()}
              </div>
            </div>
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: 4, right: 4,
              width: 16, height: 16, borderRadius: '50%',
              background: '#4ade80',
              border: '2.5px solid #2e1065',
              boxShadow: '0 0 8px rgba(74,222,128,0.7)',
            }} />
          </div>

          {/* Name + info */}
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: 10, fontWeight: 800, borderRadius: 6,
                padding: '3px 10px', letterSpacing: '0.8px',
                border: '1px solid rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
              }}>
                Super Admin
              </span>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(74,222,128,0.15)',
                color: '#86efac',
                fontSize: 10, fontWeight: 700, borderRadius: 6,
                padding: '3px 10px',
                border: '1px solid rgba(74,222,128,0.25)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#4ade80', display: 'inline-block',
                  boxShadow: '0 0 6px rgba(74,222,128,0.8)',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                System Online
              </span>
            </div>

            <h1 style={{
              color: '#fff', fontWeight: 900, fontSize: 32,
              margin: '0 0 4px', letterSpacing: '-0.8px',
              textShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}>
              {adminName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: '0 0 16px' }}>
              {adminEmail}
            </p>

            {/* Quick stat pills */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'Users', value: stats?.totalUsers || 0 },
                { label: 'Jobs', value: stats?.totalJobs || 0 },
                { label: 'Applications', value: stats?.totalApplications || 0 },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  padding: '6px 14px',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: 16, lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 10, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: System Status Panel */}
        <SystemStatusCard hireRate={hireRate} ProgressRing={ProgressRing} />
      </div>
    </section>
  );
}