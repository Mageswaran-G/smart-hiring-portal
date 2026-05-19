import { Briefcase, PlusCircle, Users } from 'lucide-react';
import { ROUTES } from '../../../../constants/routes';
import { C, largeCardStyle } from './dashboardTheme';

export default function CompanyQuickActions({ jobsCount, applicationsCount, navigate }) {
  const actions = [
    { label: 'Post New Job', desc: 'Create listing', Icon: PlusCircle, route: ROUTES.COMPANY_JOB_CREATE, color: C.primary },
    { label: 'Job Postings', desc: `${jobsCount} posted`, Icon: Briefcase, route: ROUTES.COMPANY_JOBS, color: '#8b5cf6' },
    { label: 'Applicants', desc: `${applicationsCount} total`, Icon: Users, route: ROUTES.COMPANY_APPLICATIONS, color: '#0891b2' },
  ];

  return (
    <div style={largeCardStyle}>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: C.gray900, margin: '0 0 18px', letterSpacing: '-0.3px' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {actions.map(({ label, desc, Icon, route, color }) => (
          <button
            key={label}
            onClick={() => navigate(route)}
            style={{ background: `${color}08`, border: `1px solid ${color}22`, borderRadius: 16, position: 'relative', overflow: 'hidden', padding: '18px 14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${color}22`; e.currentTarget.style.borderColor = `${color}44`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${color}22`; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: color, opacity: 0.8 }} />
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: C.gray900, margin: '0 0 2px' }}>{label}</p>
              <p style={{ fontSize: 11, color: C.gray400, margin: 0 }}>{desc}</p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color, fontSize: 12, fontWeight: 600 }}>
              Open {'->'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
