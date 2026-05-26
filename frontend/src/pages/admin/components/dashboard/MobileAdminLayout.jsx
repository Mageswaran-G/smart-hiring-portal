import { Shield, Users, Building2, Briefcase, FileText, Lock, LogOut, LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import SafeAvatar from '../../../../components/ui/SafeAvatar';
import { ProgressRing, Sparkline } from '../../../../components/ui/charts';
import { COLORS, GRADIENTS } from '../../../../theme/adminTheme';
import ActionCenter from '../../../../components/admin/ActionCenter';

const SYSTEM_STATUS = [
  { label: 'API Server',    status: 'online'   },
  { label: 'Database',      status: 'online'   },
  { label: 'File Storage',  status: 'online'   },
  { label: 'Module 5',      status: 'progress' },
  { label: 'Module 6 (AI)', status: 'offline'  },
];

const MODULES = [
  { num: 5, label: 'Admin Dashboard', color: COLORS.primary, status: 'done', progress: 100, Icon: Shield   },
  { num: 6, label: 'AI Features', color: COLORS.primary, status: 'in_progress', progress: 15, Icon: BarChart3 },
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
    { label: 'Total Users',  value: stats?.totalUsers || 0,        color: COLORS.primary, bg: '#f5f3ff', Icon: Users,     trendPct: '+12%', id: 'u' },
    { label: 'Companies',    value: stats?.totalCompanies || 0,    color: '#0891b2',      bg: '#eff6ff', Icon: Building2, trendPct: '+5%',  id: 'c' },
    { label: 'Jobs Posted',  value: stats?.totalJobs || 0,         color: '#8b5cf6',      bg: '#faf5ff', Icon: Briefcase, trendPct: '+8%',  id: 'j' },
    { label: 'Applications', value: stats?.totalApplications || 0, color: '#059669',      bg: '#f0fdf4', Icon: FileText,  trendPct: '+18%', id: 'a' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: 72, fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Mobile Header */}
      <header style={{
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        height: 56, padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 40,
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: GRADIENTS.admin,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(124,58,237,0.35)',
          }}>
            <Shield size={15} color="#fff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 900, fontSize: 16, color: COLORS.gray900, letterSpacing: '-0.4px' }}>
              HirePortal
            </span>
            <span style={{
              background: `${COLORS.primary}12`,
              color: COLORS.primary,
              fontSize: 9, fontWeight: 800,
              borderRadius: 5, padding: '2px 6px',
              letterSpacing: '0.6px',
              border: `1px solid ${COLORS.primary}20`,
            }}>
              ADMIN
            </span>
          </div>
        </div>
        {/* Right side — online + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0fdf4', padding: '4px 10px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px rgba(74,222,128,0.7)' }} />
            <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 600 }}>Online</span>
          </div>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: GRADIENTS.admin,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 12,
            boxShadow: '0 2px 6px rgba(124,58,237,0.3)',
          }}>
            {adminName[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Mobile Hero */}
      <section style={{ background: GRADIENTS.admin, padding: '24px 18px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(167,139,250,0.1)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{
            width: 58, height: 58, borderRadius: 18,
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 24,
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            flexShrink: 0, position: 'relative',
          }}>
            {adminName[0].toUpperCase()}
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 12, height: 12, borderRadius: '50%',
              background: '#4ade80',
              border: '2px solid #2e1065',
              boxShadow: '0 0 6px rgba(74,222,128,0.7)',
            }} />
          </div>

          <div>
            {/* Badge */}
            <span style={{
              background: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 9, fontWeight: 800,
              borderRadius: 5, padding: '2px 8px',
              letterSpacing: '0.8px', textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'inline-block', marginBottom: 5,
            }}>
              Super Admin
            </span>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 2px', letterSpacing: '-0.5px' }}>
              {adminName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: 0 }}>
              {adminEmail}
            </p>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Users', value: stats?.totalUsers || 0 },
            { label: 'Jobs', value: stats?.totalJobs || 0 },
            { label: 'Apps', value: stats?.totalApplications || 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{
              flex: 1,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '8px 10px', textAlign: 'center',
            }}>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 18, lineHeight: 1 }}>{value}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* System status pills */}
        <div style={{
          background: 'rgba(0,0,0,0.18)',
          borderRadius: 14, padding: '12px 16px',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative', zIndex: 1,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, margin: '0 0 8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            System Status
          </p>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {SYSTEM_STATUS.slice(0, 3).map(({ label, status }) => (
              <span key={label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 10, fontWeight: 600,
                borderRadius: 8, padding: '4px 10px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 6px rgba(74,222,128,0.6)',
                  display: 'inline-block',
                }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats 2x2 Grid */}
      <section style={{ padding: '14px 14px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray700, margin: '0 0 10px' }}>Platform Overview</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {STAT_CARDS.map(({ label, value, color, bg, Icon, trendPct, id }) => (
            <div key={label} style={{ background: COLORS.white, borderRadius: 18, padding: "16px 14px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
              {/* Top row — icon + trend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#f0fdf4', color: '#16a34a', fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 7 }}>
                  ↗ {trendPct}
                </div>
              </div>
              {/* Value */}
              <div style={{ fontSize: 28, fontWeight: 900, color: '#111827', letterSpacing: '-1px', lineHeight: 1, marginBottom: 4 }}>
                {value}
              </div>
              {/* Label */}
              <p style={{ fontSize: 11, color: '#374151', margin: 0, fontWeight: 700 }}>{label}</p>
              {/* Bottom accent */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}40, ${color}15)`, borderRadius: '0 0 18px 18px' }} />
            </div>
          ))}
        </div>
      </section>

      {/* Hire Rate */}
      <section style={{ padding: '14px 14px 0' }}>
        <div style={{ background: `${COLORS.primary}12`, borderRadius: 14, padding: 16, border: '1px solid #ddd6fe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 4px', fontWeight: 600 }}>Platform Hire Rate</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: COLORS.primary, margin: 0 }}>{hireRate}%</p>
              <p style={{ fontSize: 11, color: COLORS.gray400, margin: '3px 0 0' }}>
                {stats?.hired || 0} hired from {stats?.totalApplications || 0} applications
              </p>
            </div>
            <ProgressRing value={hireRate} color={COLORS.primary} bg={`${COLORS.primary}22`} textColor={COLORS.primary} />
          </div>
        </div>
      </section>

      {/* Action Center */}
      <section style={{ padding: '14px 14px 0' }}>
        <ActionCenter />
      </section>

      {/* Recent Signups */}
      <section style={{ padding: '14px 14px 0' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray700, margin: '0 0 10px' }}>Recent Signups</p>
        {!stats?.recentUsers?.length ? (
          <div style={{ background: COLORS.white, borderRadius: 14, padding: 20, textAlign: 'center', border: `1px solid ${COLORS.gray100}` }}>
            <p style={{ color: COLORS.gray400, fontSize: 13, margin: 0 }}>No recent signups</p>
          </div>
        ) : (
          <div style={{ background: COLORS.white, borderRadius: 14, border: `1px solid ${COLORS.gray100}`, overflow: 'hidden' }}>
            {stats.recentUsers.slice(0, 5).map((u, idx) => {
              const roleColor = u.role === 'candidate' ? '#ea580c' : u.role === 'company' ? '#1e3a5f' : COLORS.primary;
              return (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: idx < 4 ? `1px solid ${COLORS.gray100}` : 'none' }}>
                  <SafeAvatar
                    src={u.photo} name={u.name}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    fallbackStyle={{ width: 32, height: 32, borderRadius: '50%', background: `${roleColor}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColor, fontWeight: 800, fontSize: 12, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 12, color: COLORS.gray900, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name || '—'}</p>
                    <p style={{ fontSize: 10, color: COLORS.gray400, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
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
        <button onClick={onLogout} style={{ width: '100%', background: COLORS.white, border: `1px solid ${COLORS.gray200}`, borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: COLORS.danger, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </section>

      {/* Bottom Tab Bar */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)', borderTop: `1px solid ${COLORS.gray200}`, display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {MOB_TABS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button key={key} onClick={() => onTab(key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '10px 4px 6px', background: 'none', border: 'none', cursor: 'pointer', color: isActive ? COLORS.primary : COLORS.gray400, position: 'relative', transition: 'color 0.15s' }}>
              {isActive && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 3, background: COLORS.primary, borderRadius: '0 0 3px 3px' }} />}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, lineHeight: 1 }}>{label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}