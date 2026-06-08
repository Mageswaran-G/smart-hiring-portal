import { X, CheckCheck, Trash2 } from 'lucide-react';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown({ notifications, loading, onClose, onMarkAllRead, onMarkOneRead, onClearAll, userRole }) {
  return (
    <div style={{
      position: 'absolute', top: '100%', right: 0, zIndex: 1000,
      width: 360, maxHeight: 480,
      background: '#fff', borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      marginTop: 8,
    }}>

      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>Notifications</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" onClick={onMarkAllRead} title="Mark all read"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}>
            <CheckCheck size={15} color="#64748b" />
          </button>
          <button type="button" onClick={onClearAll} title="Clear all"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}>
            <Trash2 size={15} color="#64748b" />
          </button>
          <button type="button" onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}>
            <X size={15} color="#64748b" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Loading...</div>
        )}
        {!loading && notifications.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>No notifications yet</p>
          </div>
        )}
        {!loading && notifications.map(n => (
          <NotificationItem key={n._id} notification={n} onRead={onMarkOneRead} userRole={userRole} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}
