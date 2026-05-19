import { ChevronRight, Users } from 'lucide-react';
import { ROUTES } from '../../../../constants/routes';
import { C, largeCardStyle } from './dashboardTheme';
import { timeAgo } from './dashboardUtils';
import ApplicantAvatar from './ApplicantAvatar';
import StatusDropdown from './StatusDropdown';

export default function RecentApplicantsTable({ applications, onStatusUpdate, navigate }) {
  return (
    <div style={{ ...largeCardStyle, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.gray900, margin: 0, letterSpacing: '-0.3px' }}>Recent Applicants</h2>
        <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.accent, fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
          Manage all <ChevronRight size={14} />
        </button>
      </div>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Users size={28} color={C.border} />
          </div>
          <p style={{ color: C.gray500, fontSize: 15, margin: '0 0 5px', fontWeight: 600 }}>No applicants yet</p>
          <p style={{ color: C.gray400, fontSize: 13, margin: '0 0 18px' }}>Post a job to start receiving applications</p>
          <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Post a Job
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.5fr 1.5fr', gap: 12, padding: '0 12px 10px', borderBottom: `1px solid ${C.gray100}` }}>
            {['Candidate', 'Applied For', 'Status', 'Date'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.gray400, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>

          {applications.slice(0, 8).map((app, idx) => (
            <div key={app._id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.5fr 1.5fr', gap: 12, padding: '13px 12px', borderRadius: 12, background: idx % 2 === 0 ? 'transparent' : C.gray50, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <ApplicantAvatar candidate={app.candidate} border={`1.5px solid ${C.gray200}`} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: C.gray900, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.candidate?.name || 'Candidate'}
                  </p>
                  <p style={{ fontSize: 11, color: C.gray400, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.candidate?.email}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.gray600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {app.job?.title || '-'}
              </p>
              <StatusDropdown appId={app._id} current={app.status} onUpdate={onStatusUpdate} />
              <span style={{ fontSize: 11, color: C.gray400 }}>{timeAgo(app.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
