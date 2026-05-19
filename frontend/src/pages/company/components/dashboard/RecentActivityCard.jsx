import { C, cardStyle } from './dashboardTheme';

export default function RecentActivityCard({ recentActivity }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.gray900, margin: 0 }}>Recent Activity</h3>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px #22c55e33' }} />
      </div>

      {recentActivity.length === 0 ? (
        <p style={{ color: C.gray400, fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No activity yet</p>
      ) : (
        recentActivity.map((a, i) => (
          <div key={`${a.text}-${a.time}-${i}`} style={{ display: 'flex', gap: 11 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0, boxShadow: `0 0 0 3px ${a.color}33` }} />
              {i < recentActivity.length - 1 && (
                <div style={{ width: 1, flex: 1, background: C.gray100, margin: '3px 0' }} />
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: 12 }}>
              <p style={{ fontSize: 12, color: C.gray800, margin: '0 0 2px', lineHeight: 1.45 }}>{a.text}</p>
              <p style={{ fontSize: 10, color: C.gray400, margin: 0 }}>{a.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
