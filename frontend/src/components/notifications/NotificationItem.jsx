import { Bell, Briefcase, UserPlus, CheckCircle, XCircle, Clock } from 'lucide-react';

const iconMap = {
  new_application:       { icon: Briefcase,   color: '#1e3a5f' },
  application_reviewing: { icon: Clock,        color: '#f59e0b' },
  application_shortlisted:{ icon: CheckCircle, color: '#22c55e' },
  application_rejected:  { icon: XCircle,      color: '#ef4444' },
  application_hired:     { icon: CheckCircle,  color: '#7c3aed' },
  new_company:           { icon: UserPlus,     color: '#0891b2' },
};

export default function NotificationItem({ notification, onRead }) {
  const { icon: Icon, color } = iconMap[notification.type] || { icon: Bell, color: '#6b7280' };
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div
      onClick={() => !notification.isRead && onRead(notification._id)}
      style={{
        display: 'flex', gap: 12, padding: '12px 16px',
        background: notification.isRead ? '#fff' : '#f0f9ff',
        borderBottom: '1px solid #f1f5f9',
        cursor: notification.isRead ? 'default' : 'pointer',
        transition: 'background 0.2s',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: notification.isRead ? 500 : 700, color: '#1e293b', margin: '0 0 2px', lineHeight: 1.4 }}>{notification.title}</p>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px', lineHeight: 1.4 }}>{notification.message}</p>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.isRead && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 4 }} />
      )}
    </div>
  );
}
