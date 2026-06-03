import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import { COLORS } from '../../../../theme/adminTheme';

const getCards = (stats) => [
  { label: 'Total Users', value: stats?.totalUsers ?? '--', sub: `${stats?.totalCandidates ?? 0} candidates`, icon: Users, color: COLORS.primary, bg: '#f5f3ff' },
  { label: 'Companies', value: stats?.totalCompanies ?? '--', sub: 'registered', icon: Building2, color: COLORS.blue, bg: '#eff6ff' },
  { label: 'Jobs Posted', value: stats?.totalJobs ?? '--', sub: 'all time', icon: Briefcase, color: '#7c3aed', bg: '#faf5ff' },
  { label: 'Applications', value: stats?.totalApplications ?? '--', sub: `${stats?.hired ?? 0} hired`, icon: FileText, color: COLORS.successText, bg: '#f0fdf4' },
];

const StatsGrid = ({ stats, isMobile = false }) => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px' : '28px 32px 0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 12 : 20 }}>
      {getCards(stats).map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
            style={{ background: '#fff', borderRadius: 20, padding: '24px 24px 20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={card.color} />
              </div>
            </div>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 900, color: '#111827', letterSpacing: '-1px', lineHeight: 1, marginBottom: 6 }}>{card.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{card.label}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{card.sub}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${card.color}40, ${card.color}15)`, borderRadius: '0 0 20px 20px' }} />
          </div>
        );
      })}
    </div>
  </div>
);

export default StatsGrid;