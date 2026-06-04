import { Shield, LayoutDashboard, Building2, Users, Briefcase, BarChart3, LogOut, MessageSquare } from 'lucide-react';
import { COLORS, GRADIENTS } from '../../../../theme/adminTheme';

const NAV_ITEMS = [
  { key: 'overview',  label: 'Overview',  Icon: LayoutDashboard },
  { key: 'companies', label: 'Companies', Icon: Building2       },
  { key: 'users',     label: 'Users',     Icon: Users           },
  { key: 'jobs',      label: 'Jobs',      Icon: Briefcase       },
  { key: 'analytics', label: 'Analytics', Icon: BarChart3       },
  { key: 'hirebot',   label: 'HireBot',   Icon: MessageSquare   },
];

export default function DesktopAdminNav({ adminName, activeTab, onTab, onLogout }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      height: 64, padding: '0 40px',
      display: 'flex', alignItems: 'center', gap: 32,
      boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginRight: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: GRADIENTS.admin,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(124,58,237,0.4)',
        }}>
          <Shield size={18} color="#fff" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            fontWeight: 900, fontSize: 18, color: COLORS.gray900,
            letterSpacing: '-0.5px',
          }}>
            HirePortal
          </span>
          <span style={{
            background: `${COLORS.primary}12`,
            color: COLORS.primary,
            fontSize: 9, fontWeight: 800,
            borderRadius: 5, padding: '2px 7px',
            letterSpacing: '0.7px',
            border: `1px solid ${COLORS.primary}20`,
          }}>
            ADMIN
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.08)', flexShrink: 0 }} />

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button key={key} onClick={() => onTab(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9, border: 'none',
              cursor: 'pointer', fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              background: isActive ? `${COLORS.primary}10` : 'transparent',
              color: isActive ? COLORS.primary : '#6b7280',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = '#f9fafb';
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
            >
              <Icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
              {/* Active indicator */}
              {isActive && (
                <span style={{
                  position: 'absolute', bottom: -17, left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70%', height: 2,
                  background: `linear-gradient(90deg, ${COLORS.primary}, #a78bfa)`,
                  borderRadius: '2px 2px 0 0',
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

        {/* Admin info */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.gray900, margin: 0, lineHeight: 1.3 }}>
            {adminName}
          </p>
          <p style={{ fontSize: 11, color: COLORS.primary, margin: 0, fontWeight: 600 }}>
            Super Admin
          </p>
        </div>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: GRADIENTS.admin,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 14,
          boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
          border: '2px solid rgba(124,58,237,0.2)',
          flexShrink: 0,
        }}>
          {adminName[0].toUpperCase()}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.08)' }} />

        {/* Logout */}
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 9,
          border: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',
          color: '#6b7280', fontSize: 13,
          fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#fef2f2';
          e.currentTarget.style.color = '#dc2626';
          e.currentTarget.style.borderColor = '#fecaca';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.color = '#6b7280';
          e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)';
        }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </header>
  );
}