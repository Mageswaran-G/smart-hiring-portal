import SystemStatusCard from './SystemStatusCard';
import ProgressRing from '../../../../components/charts/ProgressRing';

const grad = 'linear-gradient(135deg, #1e0b4b 0%, #2e1065 25%, #4c1d95 55%, #6d28d9 80%, #7c3aed 100%)';

export default function AdminHero({ adminName, adminEmail, stats, hireRate }) {
  return (
    <section style={{ background: grad, padding: '64px 56px 76px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 52,
      }}>

        {/* Left: Admin Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>

          {/* Avatar with glow ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 108, height: 108, borderRadius: '50%',
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed, #4c1d95)',
              padding: 3,
              boxShadow: '0 0 32px rgba(167,139,250,0.5), 0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 38,
              }}>
                {adminName[0].toUpperCase()}
              </div>
            </div>
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: 6, right: 6,
              width: 18, height: 18, borderRadius: '50%',
              background: '#22c55e',
              border: '3px solid #2e1065',
              boxShadow: '0 0 8px rgba(34,197,94,0.6)',
            }} />
          </div>

          {/* Name + badges */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.92)',
                fontSize: 11, fontWeight: 800, borderRadius: 9999,
                padding: '4px 14px', letterSpacing: '0.6px',
                border: '1px solid rgba(255,255,255,0.28)',
              }}>
                SUPER ADMIN
              </span>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(34,197,94,0.25)', color: '#86efac',
                fontSize: 11, fontWeight: 700, borderRadius: 9999,
                padding: '4px 12px', border: '1px solid rgba(34,197,94,0.3)',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#22c55e', display: 'inline-block',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                System Online
              </span>
            </div>

            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 36, margin: '0 0 7px', letterSpacing: '-1px' }}>
              {adminName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, margin: '0 0 18px' }}>
              {adminEmail}
            </p>

            {/* Quick stat pills */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: `${stats?.totalUsers || 0} Users` },
                { label: `${stats?.totalJobs || 0} Jobs` },
                { label: `${stats?.totalApplications || 0} Applications` },
              ].map(({ label }) => (
                <span key={label} style={{
                  background: 'rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.92)',
                  fontSize: 12, fontWeight: 700, borderRadius: 9999,
                  padding: '5px 15px', border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  {label}
                </span>
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