import { Activity, CheckCircle, Clock, Zap, ShieldCheck } from 'lucide-react';
import { COLORS } from '../../../../theme/adminTheme';

const SYSTEM_STATUS = [
  { label: 'API Server',    status: 'online',   icon: Activity    },
  { label: 'Database',      status: 'online',   icon: CheckCircle },
  { label: 'File Storage',  status: 'online',   icon: ShieldCheck },
  { label: 'Module 5',      status: 'done',     icon: CheckCircle },
  { label: 'Module 6 (AI)', status: 'progress', icon: Zap         },
];

export default function SystemStatusCard({ hireRate, ProgressRing }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      borderRadius: 24,
      padding: '24px 28px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.15)',
      flexShrink: 0,
      minWidth: 300,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, margin: '0 0 2px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Platform Status
          </p>
          <p style={{ color: '#fff', fontSize: 15, margin: 0, fontWeight: 700 }}>
            All Systems Operational
          </p>
        </div>
        <ProgressRing
          value={hireRate}
          size={52} stroke={5}
          color="#a78bfa"
          bg="rgba(255,255,255,0.1)"
          textColor="#fff"
          label="rate"
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 14 }} />

      {/* Status rows */}
      {SYSTEM_STATUS.map(({ label, status, icon: Icon }) => {
        const isOnline = status === 'online' || status === 'done';
        const isProgress = status === 'progress';
        const dotColor = isOnline ? '#4ade80' : isProgress ? '#fbbf24' : '#6b7280';
        const textColor = isOnline ? '#86efac' : isProgress ? '#fde68a' : 'rgba(255,255,255,0.4)';
        const statusLabel = isOnline ? (status === 'done' ? 'Complete' : 'Online') : isProgress ? 'In Progress' : 'Locked';

        return (
          <div key={label} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: `${dotColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={13} color={textColor} />
              </div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                {label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: dotColor, display: 'inline-block',
                boxShadow: `0 0 6px ${dotColor}`,
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: textColor }}>
                {statusLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}