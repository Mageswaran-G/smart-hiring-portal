import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

const CARDS = (stats) => [
  {
    label: 'Total Users',
    value: stats?.totalUsers ?? '—',
    sub: `${stats?.totalCandidates ?? 0} candidates`,
    icon: Users,
    color: '#7c3aed',
    trend: stats?.userTrend || [2,4,3,6,5,8,7,10,9,12],
  },
  {
    label: 'Companies',
    value: stats?.totalCompanies ?? '—',
    sub: 'registered',
    icon: Building2,
    color: '#0891b2',
    trend: [1,1,2,2,3,3,stats?.totalCompanies||0],
  },
  {
    label: 'Jobs Posted',
    value: stats?.totalJobs ?? '—',
    sub: 'all time',
    icon: Briefcase,
    color: '#8b5cf6',
    trend: [1,2,2,3,3,3,stats?.totalJobs||0],
  },
  {
    label: 'Applications',
    value: stats?.totalApplications ?? '—',
    sub: `${stats?.hired ?? 0} hired`,
    icon: FileText,
    color: '#059669',
    trend: stats?.appTrend || [1,2,3,3,4,4,5],
  },
];

const StatsGrid = ({ stats, isMobile = false }) => (
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
      {CARDS(stats).map((card) => (
        <StatCard key={card.label} {...card} isMobile={isMobile} />
      ))}
    </div>
  </section>
);

export default StatsGrid;
