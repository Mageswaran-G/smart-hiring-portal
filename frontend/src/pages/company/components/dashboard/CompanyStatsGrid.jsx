import Sparkline from './Sparkline';
import { C, cardStyle } from './dashboardTheme';

export default function CompanyStatsGrid({ statCards }) {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 48px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {statCards.map(({ label, value, sub, Icon, color, trend, trendPct, id }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: 20, padding: '20px 22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top row — icon + trend badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{
                background: trendPct?.startsWith('-') ? '#fef2f2' : '#f0fdf4',
                color: trendPct?.startsWith('-') ? '#dc2626' : '#16a34a',
                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
              }}>
                {trendPct?.startsWith('-') ? '↘' : '↗'} {trendPct || '0%'}
              </div>
            </div>
            {/* Value */}
            <p style={{ fontSize: 32, fontWeight: 900, color: C.gray900, margin: '0 0 2px', lineHeight: 1, letterSpacing: '-1px' }}>{value}</p>
            <p style={{ fontSize: 12, color: C.gray400, margin: '0 0 10px', fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: 11, color: C.gray400, margin: '0 0 10px' }}>{sub}</p>
            <Sparkline data={trend} color={color} w={108} h={34} id={id} />
            {/* Bottom accent */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}40, ${color}10)`, borderRadius: '0 0 20px 20px' }} />
          </div>
        ))}
      </div>
    </section>
  );
}