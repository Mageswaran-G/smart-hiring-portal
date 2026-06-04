import { useEffect, useState } from 'react';
import { Activity, CheckCircle, ShieldCheck } from 'lucide-react';
import { API } from '../../../../services/authService';
import { API_ENDPOINTS } from '../../../../constants/api';

const STATUS_CONFIG = [
  { key: 'api',      label: 'API Server',   icon: Activity     },
  { key: 'database', label: 'Database',     icon: CheckCircle  },
  { key: 'storage',  label: 'File Storage', icon: ShieldCheck  },
];

export default function SystemStatusCard({ hireRate, ProgressRing }) {
  const [health, setHealth] = useState({
    api:      'online',
    database: 'online',
    storage:  'online',
  });

  useEffect(() => {
    API.get(API_ENDPOINTS.ADMIN_SYSTEM_HEALTH)
      .then(res => { if (res.data?.data) setHealth(res.data.data); })
      .catch(() => {});
  }, []);

  return (
    <div style={{
      background:    'rgba(255,255,255,0.07)',
      borderRadius:  24,
      padding:       '24px 28px',
      backdropFilter:'blur(20px)',
      border:        '1px solid rgba(255,255,255,0.15)',
      flexShrink:    0,
      minWidth:      300,
      boxShadow:     '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10, margin:'0 0 2px', fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>
            Platform Status
          </p>
          <p style={{ color:'#fff', fontSize:15, margin:0, fontWeight:700 }}>
            {Object.values(health).every(s => s === 'online') ? 'All Systems Operational' : 'Service Degraded'}
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
      <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:14 }} />

      {/* Status rows */}
      {STATUS_CONFIG.map(({ key, label, icon: Icon }) => {
        const isOnline  = health[key] === 'online';
        const dotColor  = isOnline ? '#4ade80' : '#f87171';
        const textColor = isOnline ? '#86efac' : '#fca5a5';
        const statusLabel = isOnline ? 'Online' : 'Offline';

        return (
          <div key={key} style={{
            display:'flex', alignItems:'center',
            justifyContent:'space-between',
            padding:'9px 0',
            borderBottom:'1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width:28, height:28, borderRadius:8,
                background:`${dotColor}18`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Icon size={13} color={textColor} />
              </div>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:500 }}>
                {label}
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{
                width:6, height:6, borderRadius:'50%',
                background:dotColor, display:'inline-block',
                boxShadow:`0 0 6px ${dotColor}`,
              }} />
              <span style={{ fontSize:11, fontWeight:700, color:textColor }}>
                {statusLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
