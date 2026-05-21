import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import { Sparkline } from '@/components/ui/charts';



const CARDS = (stats) => [
  {
    id: 'u',
    label: 'Total Users',
    value: stats?.totalUsers ?? '—',
    sub: `${stats?.totalCandidates ?? 0} candidates`,
    Icon: Users,
    color: '#7c3aed',
    trend: stats?.userTrend || [2,4,3,6,5,8,7,10,9,12],
  },
  {
    id: 'c',
    label: 'Companies',
    value: stats?.totalCompanies ?? '—',
    sub: 'registered',
    Icon: Building2,
    color: '#0891b2',
    trend: [1,1,2,2,3,3,stats?.totalCompanies||0],
  },
  {
    id: 'j',
    label: 'Jobs Posted',
    value: stats?.totalJobs ?? '—',
    sub: 'all time',
    Icon: Briefcase,
    color: '#8b5cf6',
    trend: [1,2,2,3,3,3,stats?.totalJobs||0],
  },
  {
    id: 'a',
    label: 'Applications',
    value: stats?.totalApplications ?? '—',
    sub: `${stats?.hired ?? 0} hired`,
    Icon: FileText,
    color: '#059669',
    trend: stats?.appTrend || [1,2,3,3,4,4,5],
  },
];

const StatsGrid = ({ stats, isMobile = false }) => {
  const cards = CARDS(stats);

  return (
    <section style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: isMobile ? '14px 14px 0' : '26px 32px 0',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
        gap: isMobile ? 10 : 16,
      }}>
        {cards.map(({ id, label, value, sub, Icon, color, trend }) => (
          <div key={id} style={{
            background: '#fff',
            borderRadius: 18,
            padding: '22px',
            boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            {/* Label + Icon row */}
            <div style={{ display:'flex', justifyContent:'space-between',
              alignItems:'flex-start', marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 12, color:'#6b7280',
                  margin:'0 0 5px', fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: 36, fontWeight: 900, color:'#111827',
                  margin: 0, lineHeight: 1, letterSpacing:'-1px' }}>{value}</p>
                <p style={{ fontSize: 11, color:'#9ca3af',
                  margin:'4px 0 0' }}>{sub}</p>
              </div>
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: `${color}12`,
                display: 'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon size={22} color={color} />
              </div>
            </div>

            {/* Sparkline */}
            <Sparkline data={trend} color={color} w={108} h={38} id={id} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsGrid;
