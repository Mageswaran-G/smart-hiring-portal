// ModuleRoadmap.jsx
import { Shield, Brain, Mail, Lock } from 'lucide-react';

const MODULES = [
  {
    num: 5, status: 'Active', title: 'Admin Dashboard',
    icon: Shield, color: '#7c3aed', progress: 60, locked: false,
    features: ['User management', 'Job moderation', 'Platform analytics', 'Role controls'],
  },
  {
    num: 6, status: 'Soon', title: 'AI Features',
    icon: Brain, color: '#9ca3af', progress: 0, locked: true,
    features: ['AI job suggestions', 'Resume matching', 'Smart screening', 'Skill gap analysis'],
  },
  {
    num: 7, status: 'Soon', title: 'Email Notifications',
    icon: Mail, color: '#9ca3af', progress: 0, locked: true,
    features: ['Application updates', 'Job alerts', 'Weekly digest', 'Status changes'],
  },
];

const ModuleRoadmap = () => (
  <div style={{
    background: '#fff',
    borderRadius: 20,
    padding: '26px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
    border: '1px solid #ddd6fe',
  }}>
    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827',
      margin: '0 0 16px', letterSpacing: '-0.3px' }}>
      Module Roadmap
    </h2>

    {/* Warning banner */}
    <div style={{
      background: '#fffbeb', border: '1px solid #fcd34d',
      borderRadius: 10, padding: '10px 14px', marginBottom: 18,
      fontSize: 12, color: '#92400e', display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      ⚠️ Module 5 is under development. Advanced admin controls coming soon.
    </div>

    {/* Module cards — stacked vertically to fit sidebar */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {MODULES.map((mod) => {
        const Icon = mod.icon;
        return (
          <div key={mod.num} style={{
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '14px 16px',
            opacity: mod.locked ? 0.65 : 1,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            {/* Icon */}
            <div style={{
              background: mod.locked ? '#f3f4f6' : '#ede9fe',
              borderRadius: 10, padding: 8,
              display: 'flex', flexShrink: 0,
            }}>
              {mod.locked
                ? <Lock size={16} color="#9ca3af" />
                : <Icon size={16} color="#7c3aed" />}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 10, fontWeight: 700,
                  color: '#6b7280', letterSpacing: 0.5 }}>
                  MODULE {mod.num}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '1px 7px',
                  borderRadius: 20, color: mod.locked ? '#9ca3af' : '#f59e0b',
                  background: mod.locked ? '#f3f4f6' : '#fef3c7',
                }}>
                  {mod.status}
                </span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700,
                color: '#111827', marginBottom: 6 }}>
                {mod.title}
              </div>

              {/* Progress bar — only for active */}
              {!mod.locked && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: '#6b7280' }}>Progress</span>
                    <span style={{ fontSize: 10, fontWeight: 700,
                      color: '#7c3aed' }}>{mod.progress}%</span>
                  </div>
                  <div style={{ background: '#e5e7eb', borderRadius: 4, height: 5 }}>
                    <div style={{ width: `${mod.progress}%`, background: '#7c3aed',
                      borderRadius: 4, height: 5 }} />
                  </div>
                </div>
              )}

              {/* Features */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {mod.features.map(f => (
                  <span key={f} style={{
                    fontSize: 10, color: '#6b7280',
                    background: '#f9fafb', borderRadius: 6,
                    padding: '2px 6px', border: '1px solid #e5e7eb',
                  }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ModuleRoadmap;
