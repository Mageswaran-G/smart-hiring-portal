import Sparkline from './Sparkline';
import { C, cardStyle } from './dashboardTheme';

export default function CompanyStatsGrid({ statCards }) {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '26px 32px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {statCards.map(({ label, value, sub, Icon, color, trend, id }) => (
          <div key={label} style={{ ...cardStyle, borderRadius: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 12, color: C.gray400, margin: '0 0 5px', fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: 36, fontWeight: 900, color: C.gray900, margin: 0, lineHeight: 1, letterSpacing: '-1px' }}>{value}</p>
                <p style={{ fontSize: 11, color: C.gray400, margin: '4px 0 0' }}>{sub}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
              </div>
            </div>
            <Sparkline data={trend} color={color} w={108} h={38} id={id} />
          </div>
        ))}
      </div>
    </section>
  );
}
