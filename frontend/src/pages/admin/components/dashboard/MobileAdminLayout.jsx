import { Shield, Users, Building2, Briefcase, FileText, Lock, LogOut, LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import SafeAvatar from '../../../../components/ui/SafeAvatar';
import ProgressRing from '../../../../components/charts/ProgressRing';
import Sparkline from '../../../../components/charts/Sparkline';

const grad = 'linear-gradient(135deg, #1e0b4b 0%, #2e1065 25%, #4c1d95 55%, #6d28d9 80%, #7c3aed 100%)';

const SYSTEM_STATUS = [
  { label: 'API Server',    status: 'online'   },
  { label: 'Database',      status: 'online'   },
  { label: 'File Storage',  status: 'online'   },
  { label: 'Module 5',      status: 'progress' },
  { label: 'Module 6 (AI)', status: 'offline'  },
];

const MODULES = [
  { num: 5, label: 'Admin Dashboard', color: '#7c3aed', status: 'in_progress', progress: 60, Icon: Shield   },
  { num: 6, label: 'AI Features',     color: '#0891b2', status: 'locked',      progress: 0,  Icon: BarChart3 },
  { num: 7, label: 'Email Notifications', color: '#059669', status: 'locked',  progress: 0,  Icon: Settings  },
];

const MOB_TABS = [
  { key: 'overview',  label: 'Home',      Icon: LayoutDashboard },
  { key: 'companies', label: 'Companies', Icon: Building2       },
  { key: 'users',     label: 'Users',     Icon: Users           },
  { key: 'jobs',      label: 'Jobs',      Icon: Briefcase       },
  { key: 'analytics', label: 'Analytics', Icon: BarChart3       },
  { key: 'system',    label: 'System',    Icon: Settings        },
];

export default function MobileAdminLayout({ adminName, adminEmail, stats, hireRate, activeTab, onTab, onLogout }) {
  const userTrend = [5, 8, 7, 12, 11, 14, stats?.totalUsers || 0];
  const jobTrend  = [2, 3, 5, 4,  7,  8,  stats?.totalJobs  || 0];
  const appTrend  = [8, 12, 10, 15, 14, 18, stats?.totalApplications || 0];

  const STAT_CARDS = [
    { label: 'Total Users',  value: stats?.totalUsers || 0,        color: '#7c3aed', Icon: Users,     trend: userTrend, id: 'u' },
    { label: 'Companies',    value: stats?.totalCompanies || 0,    color: '#0891b2', Icon: Building2, trend: [1,1,2,2,3,3,stats?.totalCompanies||0], id: 'c' },
    { label: 'Jobs Posted',  value: stats?.totalJobs || 0,         color: '#8b5cf6', Icon: Briefcase, trend: jobTrend,  id: 'j' },
    { label: 'Applications', value: stats?.totalApplications || 0, color: '#059669', Icon: FileText,  trend: appTrend,  id: 'a' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 72, fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Mobile Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', height: 56, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 17, color: '#111827' }}>HirePortal</span>
        </div>
        <span style={{ background: '#7c3aed22', color: '#7c3aed', fontSize: 10, fontWeight: 800, borderRadius: 9999, padding: '4px 10px' }}>
          ADMIN
        </span>
      </header>

      {/* Mobile Hero */}
      <section style={{ background: grad, padding: '28px 20px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 26, border: '2px solid rgba(255,255,255,0.38)', flexShrink: 0 }}>
            {adminName[0].toUpperCase()}
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, margin: '0 0 3px', fontWeight: 500 }}>Super Admin</p>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 0 3px' }}>{adminName}</h1>
            <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12, margin: 0 }}>{adminEmail}</p>
          </div>
        </div>

        {/* System status pills */}
        <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 16, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.11)' }}>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 10, margin: '0 0 9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>System Status</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SYSTEM_STATUS.slice(0, 3).map(({ label, status }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.88)', fontSize: 10, fontWeight: 600, borderRadius: 9999, padding: '4px 11px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: status === 'online' ? '#22c55e' : status === 'progress' ? '#f59e0b' : '#ef4444', display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats 2x2 Grid */}
      <section style={{ padding: '14px 14px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 10px' }}>Platform Overview</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {STAT_CARDS.map(({ label, value, color, Icon, trend, id }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 14, padding: '14px 14px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color={color} />
                </div>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#111827' }}>{value}</span>
              </div>
              <Sparkline data={trend} color={color} id={id} />
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0', fontWeight: 600 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hire Rate */}
      <section style={{ padding: '14px 14px 0' }}>
        <div style={{ background: '#7c3aed12', borderRadius: 14, padding: 16, border: '1px solid #ddd6fe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 4px', fontWeight: 600 }}>Platform Hire Rate</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#7c3aed', margin: 0 }}>{hireRate}%</p>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>
                {stats?.hired || 0} hired from {stats?.totalApplications || 0} applications
              </p>
            </div>
            <ProgressRing value={hireRate} color="#7c3aed" bg="#7c3aed22" textColor="#7c3aed" />
          </div>
        </div>
      </section>

      {/* Recent Signups */}
      <section style={{ padding: '14px 14px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 10px' }}>Recent Signups</p>
        {!stats?.recentUsers?.length ? (
          <div style={{ background: '#fff', borderRadius: 14, padding: 20, textAlign: 'center', border: '1px solid #f3f4f6' }}>
            <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>No recent signups</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6', overflow: 'hidden' }}>
            {stats.recentUsers.slice(0, 5).map((u, idx) => {
              const roleColor = u.role === 'candidate' ? '#ea580c' : u.role === 'company' ? '#1e3a5f' : '#7c3aed';
              return (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: idx < 4 ? '1px solid #f3f4f6' : 'none' }}>
                  <SafeAvatar
                    src={u.photo} name={u.name}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    fallbackStyle={{ width: 32, height: 32, borderRadius: '50%', background: `${roleColor}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColor, fontWeight: 800, fontSize: 12, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 12, color: '#111827', margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name || '—'}</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  </div>
                  <span style={{ background: `${roleColor}14`, color: roleColor, fontSize: 9, fontWeight: 800, borderRadius: 6, padding: '3px 7px', textTransform: 'uppercase', flexShrink: 0 }}>
                    {u.role}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Logout */}
      <section style={{ padding: '14px 14px 0' }}>
        <button onClick={onLogout} style={{ width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </section>

      {/* Bottom Tab Bar */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)', borderTop: '1px solid #e5e7eb', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {MOB_TABS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button key={key} onClick={() => onTab(key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '10px 4px 6px', background: 'none', border: 'none', cursor: 'pointer', color: isActive ? '#7c3aed' : '#9ca3af', position: 'relative', transition: 'color 0.15s' }}>
              {isActive && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 3, background: '#7c3aed', borderRadius: '0 0 3px 3px' }} />}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, lineHeight: 1 }}>{label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}