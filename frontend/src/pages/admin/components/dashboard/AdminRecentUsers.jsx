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
    role === 'candidate' ? '#ea580c' : role === 'company' ? '#1e3a5f' : '#7c3aed';

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '22px',
      boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
      border: '1px solid #f3f4f6', flex: 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0 }}>
          Recent Signups
        </h3>
        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
          Last {recentUsers.length} users
        </span>
      </div>

      {recentUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Users size={28} color="#e5e7eb" style={{ margin: '0 auto 10px' }} />
          <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>No recent signups</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recentUsers.slice(0, 7).map((u, idx) => {
            const color = roleColor(u.role);
            return (
              <div key={u._id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 10px', borderRadius: 12,
                background: idx % 2 === 0 ? 'transparent' : '#f9fafb'
              }}>
                <SafeAvatar
                  src={u.photo}
                  name={u.name}
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  fallbackStyle={{ width: 36, height: 36, borderRadius: '50%',
                    background: `${color}14`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color, fontWeight: 800, fontSize: 14, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#111827',
                    margin: '0 0 1px', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.name || '—'}
                  </p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column',
                  alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                  <span style={{ background: `${color}14`, color, fontSize: 9,
                    fontWeight: 800, borderRadius: 6, padding: '3px 8px',
                    textTransform: 'uppercase' }}>
                    {u.role}
                  </span>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>
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