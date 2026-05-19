import { C } from './dashboardTheme';

export default function HiringFunnelCard({ stats, hireRate }) {
  const stages = [
    { stage: 'Applied', count: stats.applications || 0, pct: 100, color: C.accent },
    {
      stage: 'Reviewing',
      count: stats.reviewing || 0,
      pct: stats.applications > 0 ? Math.round((stats.reviewing / (stats.applications || 1)) * 100) : 0,
      color: '#0891b2',
    },
    {
      stage: 'Shortlisted',
      count: stats.shortlisted || 0,
      pct: stats.applications > 0 ? Math.round((stats.shortlisted / (stats.applications || 1)) * 100) : 0,
      color: '#ea580c',
    },
    { stage: 'Hired', count: stats.hired || 0, pct: hireRate, color: '#a855f7' },
  ];

  return (
    <div style={{ background: '#0a0a14', borderRadius: 18, padding: '18px 22px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)', flexShrink: 0, minWidth: 260 }}>
      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, margin: '0 0 12px', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
        Hiring Funnel
      </p>

      {stages.map((p) => (
        <div key={p.stage} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
          <div style={{ flex: 1, height: 28, position: 'relative' }}>
            <div style={{ width: `${p.pct}%`, height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${p.color}, ${p.color}88)`, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, fontWeight: 600, color: '#fff', minWidth: 60, transition: 'width 0.8s ease' }}>
              {p.stage}
            </div>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: 'right', color: '#fff' }}>
            {p.count}
          </span>
        </div>
      ))}

      {stats.applications > 0 && (
        <div style={{ padding: '8px 12px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, fontSize: 11.5, color: 'rgba(255,255,255,0.85)', marginTop: 10 }}>
          Conversion: <strong style={{ color: '#93c5fd' }}>{hireRate}%</strong> applied {'->'} hired
        </div>
      )}
    </div>
  );
}
