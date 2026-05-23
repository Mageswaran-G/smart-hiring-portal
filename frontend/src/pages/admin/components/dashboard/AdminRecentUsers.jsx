import { Users } from 'lucide-react';
import SafeAvatar from "../../../../components/ui/SafeAvatar";

function timeAgo(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function AdminRecentUsers({ recentUsers = [] }) {
  const roleColor = (role) =>
    role === 'candidate' ? '#ea580c' : role === 'company' ? '#0891b2' : '#7c3aed';

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '22px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: '1px solid rgba(0,0,0,0.06)', flex: 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.2px' }}>
          Recent Signups
        </h3>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, background: '#f9fafb', padding: '3px 10px', borderRadius: 8, border: '1px solid #f3f4f6' }}>
          Last 5 users
        </span>
      </div>

      {recentUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Users size={22} color="#d1d5db" />
          </div>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: 0, fontWeight: 500 }}>No recent signups</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recentUsers.slice(0, 7).map((u, idx) => {
            const color = roleColor(u.role);
            return (
              <div key={u._id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 10px', borderRadius: 12,
                transition: 'background 0.15s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <SafeAvatar
                  src={u.photo} name={u.name}
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  fallbackStyle={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `${color}12`,
                    border: `1.5px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color, fontWeight: 800, fontSize: 14, flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.name || '—'}
                  </p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{
                    background: `${color}12`, color,
                    fontSize: 9, fontWeight: 800,
                    borderRadius: 6, padding: '3px 8px',
                    textTransform: 'uppercase',
                    border: `1px solid ${color}20`,
                  }}>
                    {u.role}
                  </span>
                  <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>
                    {timeAgo(u.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}