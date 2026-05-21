import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Section from '@/components/ui/Section';
import { UI } from '@/constants/ui';

const getCards = (stats) => [
  {
    label: 'Total Users',
    value: stats?.totalUsers ?? '--',
    sub: `${stats?.totalCandidates ?? 0} candidates`,
    icon: Users,
    color: UI.colors.primary,
    trend: stats?.userTrend || [2,4,3,6,5,8,7,10,9,12],
  },
  {
    label: 'Companies',
    value: stats?.totalCompanies ?? '--',
    sub: 'registered',
    icon: Building2,
    color: UI.colors.info,
    trend: [1,1,2,2,3,3,stats?.totalCompanies||0],
  },
  {
    label: 'Jobs Posted',
    value: stats?.totalJobs ?? '--',
    sub: 'all time',
    icon: Briefcase,
    color: UI.colors.accent,
    trend: [1,2,2,3,3,3,stats?.totalJobs||0],
  },
  {
    label: 'Applications',
    value: stats?.totalApplications ?? '--',
    sub: `${stats?.hired ?? 0} hired`,
    icon: FileText,
    color: UI.colors.success,
    trend: stats?.appTrend || [1,2,3,3,4,4,5],
  },
];

const StatsGrid = ({ stats, isMobile = false }) => (
  <Section isMobile={isMobile}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
      gap: isMobile ? 10 : 16,
    }}>
      {getCards(stats).map((card) => (
        <StatCard key={card.label} {...card} isMobile={isMobile} />
      ))}
    </div>
  </Section>
);

export default StatsGrid;
