import { Activity, CheckCircle, Clock, Lock, ShieldCheck } from 'lucide-react';
import { COLORS } from '../../../../theme/adminTheme';

const SYSTEM_STATUS = [
  { label: 'API Server',    status: 'online',   icon: Activity    },
  { label: 'Database',      status: 'online',   icon: CheckCircle },
  { label: 'File Storage',  status: 'online',   icon: ShieldCheck },
  { label: 'Module 5',      status: 'progress', icon: Clock       },
  { label: 'Module 6 (AI)', status: 'offline',  icon: Lock        },
];

export default function SystemStatusCard({ hireRate, ProgressRing }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.24)',
      borderRadius: 28,
      padding: '28px 34px',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.11)',
      flexShrink: 0,
      minWidth: 316,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, margin: 0, fontWeight: 700 }}>
          Platform Status
        </p>
        <ProgressRing
          value={hireRate}
          size={56} stroke={6}
          color="#a78bfa"
          bg="rgba(255,255,255,0.15)"
          textColor="#fff"
          label="rate"
        />
      </div>

      {/* Status rows */}
      {SYSTEM_STATUS.map(({ label, status, icon: Icon }) => {
        const dotColor   = status === 'online' ? COLORS.success : status === 'progress' ? COLORS.warning : COLORS.gray500;
        const textColor  = status === 'online' ? '#86efac' : status === 'progress' ? '#fde68a' : 'rgba(255,255,255,0.45)';
        const statusLabel = status === 'online' ? 'Online' : status === 'progress' ? 'In Progress' : 'Locked';

        return (
          <div key={label} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Icon size={14} color={textColor} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}>
                {label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: textColor }}>{statusLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}