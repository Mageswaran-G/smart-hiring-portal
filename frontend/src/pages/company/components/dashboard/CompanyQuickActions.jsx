import { Briefcase, PlusCircle, Users, ChevronRight, Building2 } from 'lucide-react';
import { ROUTES } from '../../../../constants/routes';
import { C, largeCardStyle } from './dashboardTheme';

export default function CompanyQuickActions({ jobsCount, applicationsCount, navigate }) {
  const actions = [
    { label: 'Post New Job',    desc: 'Create a job listing',          Icon: PlusCircle, route: ROUTES.COMPANY_JOB_CREATE,    color: C.primary  },
    { label: 'Job Postings',    desc: `${jobsCount} total jobs`,        Icon: Briefcase,  route: ROUTES.COMPANY_JOBS,          color: '#8b5cf6'  },
    { label: 'View Applicants', desc: `${applicationsCount} applicants`, Icon: Users,      route: ROUTES.COMPANY_APPLICATIONS,  color: '#0891b2'  },
    { label: 'Company Profile', desc: 'Update company info',            Icon: Building2,  route: ROUTES.PROFILE,               color: '#059669'  },
  ];

  return (
    <div style={{ ...largeCardStyle, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.gray900, margin: 0, letterSpacing: '-0.3px' }}>
          Quick Actions
        </h2>
        <span style={{ fontSize: 12, color: C.gray400, fontWeight: 500 }}>4 shortcuts</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {actions.map(({ label, desc, Icon, route, color }) => (
          <button
            key={label}
            onClick={() => navigate(route)}
            style={{
              background: `${color}06`,
              border: `1px solid ${color}18`,
              borderRadius: 14, position: 'relative', overflow: 'hidden',
              padding: '16px 14px', display: 'flex', flexDirection: 'column',
              alignItems: 'flex-start', gap: 10, cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 4px 16px ${color}20`;
              e.currentTarget.style.background = `${color}10`;
              e.currentTarget.style.borderColor = `${color}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = `${color}06`;
              e.currentTarget.style.borderColor = `${color}18`;
            }}
          >
            {/* Top accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: color, opacity: 0.7 }} />
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: C.gray900, margin: '0 0 2px' }}>{label}</p>
              <p style={{ fontSize: 11, color: C.gray400, margin: 0 }}>{desc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, color, fontSize: 11, fontWeight: 700 }}>
              Open <ChevronRight size={13} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}