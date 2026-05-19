import { ROUTES } from '../../../../constants/routes';
import { C, cardStyle } from './dashboardTheme';

export default function TopPerformingJobCard({ topJob, dashboardNow, navigate }) {
  if (!topJob) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center' }}>
        <p style={{ color: C.gray400, fontSize: 13, margin: '0 0 12px' }}>No jobs posted yet</p>
        <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Post First Job
        </button>
      </div>
    );
  }

  const daysLive = Math.floor((dashboardNow - new Date(topJob.createdAt).getTime()) / 86400000);
  const metrics = [
    { label: 'Applicants', value: topJob.applicationsCount || 0 },
    { label: 'Openings', value: topJob.openings || 1 },
    { label: 'Days live', value: daysLive },
    { label: 'Status', value: topJob.isActive ? 'Active' : 'Closed' },
  ];

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.gray900, margin: 0 }}>Top Performing Job</h3>
        <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 700, borderRadius: 7, padding: '3px 9px' }}>
          HOT
        </span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, color: C.gray900, margin: '0 0 14px', letterSpacing: '-0.2px' }}>
        {topJob.title}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ padding: '10px 12px', background: C.gray50, borderRadius: 10 }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: C.gray900, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{m.value}</p>
            <p style={{ fontSize: 10, color: C.gray400, margin: 0 }}>{m.label}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ width: '100%', background: C.primary, color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
        View Applicants {'->'}
      </button>
    </div>
  );
}
