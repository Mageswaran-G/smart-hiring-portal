import { useNavigate } from 'react-router-dom';
import { Bell, Briefcase, UserPlus, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const iconMap = {
  new_application:          { icon: Briefcase,    color: '#1e3a5f' },
  application_reviewing:    { icon: Clock,         color: '#f59e0b' },
  application_shortlisted:  { icon: CheckCircle,  color: '#22c55e' },
  application_rejected:     { icon: XCircle,       color: '#ef4444' },
  application_hired:        { icon: CheckCircle,  color: '#7c3aed' },
  application_withdrawn:    { icon: XCircle,       color: '#f97316' },
  new_company:              { icon: UserPlus,      color: '#0891b2' },
  interview_scheduled:      { icon: Calendar,      color: '#7c3aed' },
  interview_rescheduled:    { icon: Calendar,      color: '#f59e0b' },
  interview_accepted:       { icon: CheckCircle,  color: '#22c55e' },
  interview_rejected:       { icon: XCircle,       color: '#ef4444' },
};

// Map notification type to redirect path based on user role
const getRedirectPath = (notification, userRole) => {
  const type = notification.type;

  // Candidate notifications — go to applications page
  if ([
    'application_reviewing',
    'application_shortlisted',
    'application_rejected',
    'application_hired',
    'interview_scheduled',
    'interview_rescheduled',
  ].includes(type)) {
    if (type.startsWith('interview')) return ROUTES.CANDIDATE_INTERVIEWS;
    return ROUTES.CANDIDATE_APPLICATIONS;
  }

  // Company notifications — go to applicants page
  if (['new_application', 'application_withdrawn', 'interview_accepted', 'interview_rejected'].includes(type)) {
    return ROUTES.COMPANY_APPLICATIONS;
  }

  // Admin notifications
  if (type === 'new_company') return ROUTES.ADMIN_COMPANIES;

  return null;
};

export default function NotificationItem({ notification, onRead, userRole, onClose }) {
  const navigate = useNavigate();
  const { icon: Icon, color } = iconMap[notification.type] || { icon: Bell, color: '#6b7280' };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleClick = () => {
    // Mark as read
    if (!notification.isRead) onRead(notification._id);

    // Navigate to relevant page
    const path = getRedirectPath(notification, userRole);
    if (path) {
      if (onClose) onClose();
      navigate(path);
    }
  };

  const redirectPath = getRedirectPath(notification, userRole);

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex', gap: 12, padding: '12px 16px',
        background: notification.isRead ? '#fff' : '#f0f9ff',
        borderBottom: '1px solid #f1f5f9',
        cursor: redirectPath ? 'pointer' : (notification.isRead ? 'default' : 'pointer'),
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => { if (redirectPath) e.currentTarget.style.background = '#f8fafc'; }}
      onMouseLeave={e => { e.currentTarget.style.background = notification.isRead ? '#fff' : '#f0f9ff'; }}
    >
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: notification.isRead ? 500 : 700, color: '#1e293b', margin: '0 0 2px', lineHeight: 1.4 }}>{notification.title}</p>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', lineHeight: 1.4 }}>{notification.message}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{timeAgo(notification.createdAt)}</p>
          {redirectPath && (
            <span style={{ fontSize: 11, color: color, fontWeight: 600 }}>View</span>
          )}
        </div>
      </div>
      {!notification.isRead && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 4 }} />
      )}
    </div>
  );
}
