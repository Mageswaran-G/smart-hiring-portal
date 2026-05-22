import { COLORS } from '../../theme/adminTheme';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, Briefcase, TrendingUp, Award, Building2, FileText } from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAdminAnalytics } from '../../services/adminService';

const C = {
  purple: COLORS.primary, light: '#ede9fe',
  green:  COLORS.successText, blue:  COLORS.blue,
  orange: COLORS.warningText, red:   COLORS.dangerText,
  gray:   COLORS.gray500, dark:  COLORS.gray900,
};

const BarChart = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: COLORS.gray500 }}>{d.value}</span>
          <div style={{
            width: '100%',
            height: Math.max(4, (d.value / max) * 80),
            background: color,
            borderRadius: '4px 4px 0 0',
          }} />
          <span style={{ fontSize: 9, color: COLORS.gray500 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const FunnelStep = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray900 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>
          {count} <span style={{ color: COLORS.gray500, fontWeight: 400, fontSize: 11 }}>({pct}%)</span>
        </span>
      </div>
      <div style={{ height: 8, background: COLORS.gray100, borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color, borderRadius: 9999,
          transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );
};

const STATS = (users, jobs, totalApps, funnel) => [
  { label: 'Total Users',   value: users.total,     sub: `${users.candidates} candidates`, Icon: Users,     color: COLORS.primary },
  { label: 'Companies',     value: users.companies,  sub: 'registered',                    Icon: Building2, color: COLORS.blue   },
  { label: 'Total Jobs',    value: jobs.total,       sub: `${jobs.active} active`,          Icon: Briefcase, color: COLORS.successText  },
  { label: 'Total Applied', value: totalApps,        sub: `${funnel.hired || 0} hired`,    Icon: FileText,  color: COLORS.warningText },
];

export default function AdminAnalyticsPage() {
    const { data: res, isLoading: loading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn:  getAdminAnalytics,
  });

  const data = res?.data;

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: 40, textAlign: 'center', color: COLORS.gray500 }}>
        Loading analytics...
      </div>
    </DashboardLayout>
  );

  const funnel       = data?.funnel       || {};
  const users        = data?.users        || {};
  const jobs         = data?.jobs         || {};
  const userGrowth   = data?.userGrowth   || [];
  const jobGrowth    = data?.jobGrowth    || [];
  const topCompanies = data?.topCompanies || [];

  const totalApps = (funnel.applied || 0) + (funnel.reviewing || 0) +
    (funnel.shortlisted || 0) + (funnel.hired || 0) + (funnel.rejected || 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const userChart = days.map(day => ({
    value: userGrowth.find(u => u._id === day)?.count || 0,
    label: day.slice(5),
  }));

  const jobChart = days.map(day => ({
    value: jobGrowth.find(j => j._id === day)?.count || 0,
    label: day.slice(5),
  }));

  const stats = STATS(users, jobs, totalApps, funnel);

  return (
    <DashboardLayout>
      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
            Platform Analytics
          </h1>
          <p style={{ color: COLORS.gray500, marginTop: 4, fontSize: 14 }}>
            Real-time data across users, jobs, and applications
          </p>
        </div>

        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 24 }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: '#fff', borderRadius: 16, padding: '20px 22px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: `1px solid ${COLORS.gray100}`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${stat.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}>
                <stat.Icon size={20} color={stat.color} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: stat.color,
                lineHeight: 1, letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray900, marginTop: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 20, marginBottom: 20 }}>

          {/* Application Funnel */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: `1px solid ${COLORS.gray100}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <TrendingUp size={18} color={COLORS.primary} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                Application Funnel
              </h2>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: COLORS.gray500 }}>
                {totalApps} total
              </span>
            </div>
            <FunnelStep label="Applied"     count={funnel.applied     || 0} total={totalApps} color={COLORS.blue}   />
            <FunnelStep label="Reviewing"   count={funnel.reviewing   || 0} total={totalApps} color={COLORS.primary} />
            <FunnelStep label="Shortlisted" count={funnel.shortlisted || 0} total={totalApps} color={COLORS.warningText} />
            <FunnelStep label="Hired"       count={funnel.hired       || 0} total={totalApps} color={COLORS.successText}  />
            <FunnelStep label="Rejected"    count={funnel.rejected    || 0} total={totalApps} color={COLORS.dangerText}    />
          </div>

          {/* User Growth */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: `1px solid ${COLORS.gray100}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Users size={18} color={COLORS.primary} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                User Signups — Last 7 Days
              </h2>
            </div>
            <BarChart data={userChart} color={COLORS.primary} />
            <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
              <div style={{ background: '#f5f3ff', borderRadius: 10,
                padding: '10px 16px', flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.gray500 }}>Candidates</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.primary }}>
                  {users.candidates}
                </div>
              </div>
              <div style={{ background: '#eff6ff', borderRadius: 10,
                padding: '10px 16px', flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.gray500 }}>Companies</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.blue }}>
                  {users.companies}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Job Growth */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: `1px solid ${COLORS.gray100}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Briefcase size={18} color={COLORS.successText} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                Jobs Posted — Last 7 Days
              </h2>
            </div>
            <BarChart data={jobChart} color={COLORS.successText} />
            <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
              <div style={{ background: '#f0fdf4', borderRadius: 10,
                padding: '10px 16px', flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.gray500 }}>Active</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.successText }}>
                  {jobs.active}
                </div>
              </div>
              <div style={{ background: '#fef2f2', borderRadius: 10,
                padding: '10px 16px', flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.gray500 }}>Closed</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.dangerText }}>
                  {jobs.closed}
                </div>
              </div>
            </div>
          </div>

          {/* Top Companies */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: `1px solid ${COLORS.gray100}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Award size={18} color={COLORS.warningText} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
                Top Hiring Companies
              </h2>
            </div>
            {topCompanies.length === 0 ? (
              <div style={{ textAlign: 'center', color: COLORS.gray500, padding: '20px 0' }}>
                No hiring data yet
              </div>
            ) : topCompanies.map((company, i) => (
              <div key={company._id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < topCompanies.length - 1 ? `1px solid ${COLORS.gray100}` : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: COLORS.light, color: COLORS.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: COLORS.gray900 }}>
                  {company.name || 'Unknown Company'}
                </div>
                <div style={{
                  background: '#f0fdf4', color: COLORS.successText,
                  padding: '4px 12px', borderRadius: 20,
                  fontSize: 12, fontWeight: 700,
                }}>
                  {company.hires} hired
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}