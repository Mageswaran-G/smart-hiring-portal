import { MiniBarChart, ProgressRing } from '@/components/ui/charts';
import { TrendingUp, Users, Building2 } from 'lucide-react';
import { COLORS, GRADIENTS } from '../../../../theme/adminTheme';

const PlatformAnalyticsCard = ({ stats }) => {
  const hireRate = stats?.totalApplications > 0
    ? Math.round((stats.hired / stats.totalApplications) * 100) : 0;

  // userTrend: use real 7-day growth data from backend if available
  // stats.userGrowth comes from getAdminAnalytics — array of { _id: date, count: number }
  // For the dashboard quick view we use the last 7 days count array
  const userTrend = Array.isArray(stats?.userGrowth) && stats.userGrowth.length > 0
    ? stats.userGrowth.map(d => d.count)
    : Array.isArray(stats?.userTrend) && stats.userTrend.length > 0
      ? stats.userTrend
      : [0, 0, 0, 0, 0, 0, 0];

  const breakdown = [
    { label: 'Candidates', value: stats?.totalCandidates || 0, total: stats?.totalUsers || 1, color: '#ea580c', icon: Users },
    { label: 'Companies',  value: stats?.totalCompanies  || 0, total: stats?.totalUsers || 1, color: '#0891b2', icon: Building2 },
  ];

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: '1px solid rgba(0,0,0,0.06)', marginBottom: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
          Platform Analytics
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', color: '#16a34a', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
          <TrendingUp size={13} /> Live Data
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Left: Hire Rate */}
        <div style={{ background: GRADIENTS.admin, borderRadius: 16, padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circle */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <ProgressRing value={hireRate} size={72} stroke={7} color="#a78bfa" bg="rgba(255,255,255,0.15)" textColor="#fff" />
            <div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Platform Hire Rate
              </p>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                {stats?.hired || 0} Hired
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>
                from {stats?.totalApplications || 0} applications
              </p>
            </div>
          </div>
        </div>

        {/* Right: User Breakdown */}
        <div style={{ background: '#fafafa', borderRadius: 16, padding: '20px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: COLORS.primary, margin: '0 0 16px', letterSpacing: '-0.2px' }}>
            User Breakdown
          </p>

          {breakdown.map(({ label, value, total, color, icon: Icon }) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={12} color={color} />
                    </div>
                    <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#111827', fontWeight: 800 }}>
                    {value} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 9999, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}

          {/* 7-day trend */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <MiniBarChart data={userTrend} color={COLORS.primary} w={180} h={36} />
            <p style={{ fontSize: 10, color: '#9ca3af', margin: '5px 0 0', fontWeight: 500 }}>
              User signups — 7-day trend
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalyticsCard;