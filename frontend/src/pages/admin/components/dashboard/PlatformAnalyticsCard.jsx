// PlatformAnalyticsCard.jsx
// Shows Platform Hire Rate + User Breakdown + 7-day trend

import { useRef, useEffect } from 'react';
import { MiniBarChart, ProgressRing } from '../../../../components/ui/charts';

const C = {
  primary: '#7c3aed',
  grad: 'linear-gradient(135deg, #1e0b4b 0%, #2e1065 25%, #4c1d95 55%, #6d28d9 80%, #7c3aed 100%)',
  border: '#ddd6fe',
  light: '#f5f3ff',
};



const PlatformAnalyticsCard = ({ stats }) => {
  const hireRate = stats?.totalApplications > 0
    ? Math.round((stats.hired / stats.totalApplications) * 100)
    : 0;

  const userTrend = stats?.userTrend || [1,1,2,2,3,3,4];

  const breakdown = [
    { label: 'Candidates', value: stats?.totalCandidates || 0,
      total: stats?.totalUsers || 1, color: '#ea580c' },
    { label: 'Companies',  value: stats?.totalCompanies  || 0,
      total: stats?.totalUsers || 1, color: '#1e3a5f' },
  ];

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      padding: '26px',
      boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
      border: `1px solid ${C.border}`,
      marginBottom: 20,
    }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827',
        margin: '0 0 20px', letterSpacing: '-0.3px' }}>
        Platform Analytics
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Left: Hire Rate */}
        <div style={{ background: C.grad, borderRadius: 16, padding: '20px',
          display: 'flex', alignItems: 'center', gap: 18 }}>
          <ProgressRing value={hireRate} />
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '0 0 4px' }}>
              Platform Hire Rate
            </p>
            <p style={{ color: '#fff', fontWeight: 900, fontSize: 20,
              margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              {stats?.hired || 0} Hired
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>
              from {stats?.totalApplications || 0} applications
            </p>
          </div>
        </div>

        {/* Right: User Breakdown */}
        <div style={{ background: C.light, borderRadius: 16, padding: '20px',
          border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: C.primary,
            margin: '0 0 14px' }}>User Breakdown</p>

          {breakdown.map(({ label, value, total, color }) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#4b5563', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 12, color: '#111827', fontWeight: 800 }}>
                    {value} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 7, background: 'rgba(0,0,0,0.07)',
                  borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%',
                    background: color, borderRadius: 9999,
                    transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })}

          {/* 7-day trend */}
          <div style={{ marginTop: 14, paddingTop: 14,
            borderTop: `1px solid ${C.border}` }}>
            <MiniBarChart data={userTrend} color={C.primary} w={180} h={40} />
            <p style={{ fontSize: 10, color: '#9ca3af', margin: '5px 0 0',
              fontWeight: 500 }}>User signups — 7-day trend</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformAnalyticsCard;
