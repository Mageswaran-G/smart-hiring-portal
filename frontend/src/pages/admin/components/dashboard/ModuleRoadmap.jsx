import { Shield, Brain, Mail, Lock, CheckCircle } from 'lucide-react';

const MODULES = [
  {
    num: 5, status: 'done', title: 'Admin Dashboard',
    icon: Shield, color: '#7c3aed', progress: 100, locked: false,
    features: ['User management', 'Job moderation', 'Platform analytics', 'Role controls'],
  },
  {
    num: 6, status: 'In Progress', title: 'AI Features',
    icon: Brain, color: '#7c3aed', progress: 5, locked: false,
    features: ['AI job suggestions', 'Resume matching', 'Smart screening', 'Skill gap analysis'],
  },
  {
    num: 7, status: "done", title: "Email Notifications",
    icon: Mail, color: '#7c3aed', progress: 100, locked: false,
    features: ['Application updates', 'Job alerts', 'Weekly digest', 'Status changes'],
  },
];

const ModuleRoadmap = () => (
  <div style={{
    background: '#fff',
    borderRadius: 20,
    padding: '26px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.06)',
  }}>
    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 16px', letterSpacing: '-0.3px' }}>
      Module Roadmap
    </h2>

    {/* Success banner — Module 5 complete */}
    <div style={{
      background: '#f0fdf4', border: '1px solid #bbf7d0',
      borderRadius: 10, padding: '10px 14px', marginBottom: 18,
      fontSize: 12, color: '#16a34a', display: 'flex', gap: 8, alignItems: 'center',
    }}>
      <CheckCircle size={14} color="#16a34a" />
      ✅ Modules 5 & 7 complete! Module 6 — AI Features is next on roadmap.
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {MODULES.map((mod) => {
        const Icon = mod.icon;
        const isDone = mod.status === 'done';
        return (
          <div key={mod.num} style={{
            border: `1px solid ${isDone ? '#ddd6fe' : '#e5e7eb'}`,
            borderRadius: 14,
            padding: '14px 16px',
            opacity: mod.locked ? 0.6 : 1,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            background: isDone ? '#faf8ff' : '#fff',
            transition: 'all 0.2s ease',
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
                <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: 0.5 }}>
                  MODULE {mod.num}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px',
                  borderRadius: 20,
                  color: isDone ? '#7c3aed' : '#9ca3af',
                  background: isDone ? '#ede9fe' : '#f3f4f6',
                }}>
                  {mod.status}
                </span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                {mod.title}
              </div>

              {!mod.locked && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: '#6b7280' }}>Progress</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed' }}>{mod.progress}%</span>
                  </div>
                  <div style={{ background: '#e5e7eb', borderRadius: 4, height: 5 }}>
                    <div style={{
                      width: `${mod.progress}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                      borderRadius: 4, height: 5,
                      boxShadow: '0 0 6px rgba(124,58,237,0.4)',
                    }} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {mod.features.map(f => (
                  <span key={f} style={{
                    fontSize: 10, color: isDone ? '#7c3aed' : '#6b7280',
                    background: isDone ? '#f5f3ff' : '#f9fafb',
                    borderRadius: 6, padding: '2px 7px',
                    border: `1px solid ${isDone ? '#ddd6fe' : '#e5e7eb'}`,
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
