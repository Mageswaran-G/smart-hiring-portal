import { C } from './dashboardTheme';
import { TrendingUp } from 'lucide-react';

export default function HiringFunnelCard({ stats, hireRate }) {
  const stages = [
    { stage: 'Applied',     count: stats.applications || 0, pct: 100, color: '#3b82f6' },
    { stage: 'Reviewing',   count: stats.reviewing    || 0, pct: stats.applications > 0 ? Math.round((stats.reviewing   / stats.applications) * 100) : 0, color: '#0891b2' },
    { stage: 'Shortlisted', count: stats.shortlisted  || 0, pct: stats.applications > 0 ? Math.round((stats.shortlisted / stats.applications) * 100) : 0, color: '#f59e0b' },
    { stage: 'Hired',       count: stats.hired        || 0, pct: hireRate, color: '#a855f7' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0d1424 0%, #111827 60%, #0a1628 100%)',
      borderRadius: 24, padding: '24px 26px',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex', flexDirection: 'column', gap: 0,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative glow */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, margin: '0 0 2px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
            Hiring Funnel
          </p>
          <p style={{ color: '#fff', fontSize: 15, margin: 0, fontWeight: 700 }}>
            Pipeline Overview
          </p>
        </div>
        <div style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 10, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendingUp size={12} color="#a855f7" />
          <span style={{ color: '#c4b5fd', fontSize: 12, fontWeight: 700 }}>{hireRate}% rate</span>
        </div>
      </div>

      {/* Stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stages.map(({ stage, count, pct, color }) => (
          <div key={stage}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{stage}</span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 800 }}>{count}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{
                width: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${color}, ${color}80)`,
                borderRadius: 9999,
                transition: 'width 0.8s ease',
                boxShadow: `0 0 8px ${color}60`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

      {/* Conversion rate */}
      <div style={{
        background: 'rgba(59,130,246,0.08)',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: 12, padding: '10px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          Applied → Hired
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#93c5fd' }}>
          {hireRate}% conversion
        </span>
      </div>
    </div>
  );
}