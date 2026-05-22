import { Shield, LayoutDashboard, Building2, Users, Briefcase, BarChart3, LogOut } from 'lucide-react';
import { COLORS, GRADIENTS } from '../../../../theme/adminTheme';



const NAV_ITEMS = [
  { key: 'overview',  label: 'Overview',   Icon: LayoutDashboard },
  { key: 'companies', label: 'Companies',  Icon: Building2       },
  { key: 'users',     label: 'Users',      Icon: Users           },
  { key: 'jobs',      label: 'Jobs',       Icon: Briefcase       },
  { key: 'analytics', label: 'Analytics',  Icon: BarChart3       },
];

export default function DesktopAdminNav({ adminName, activeTab, onTab, onLogout }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${COLORS.gray200}`,
      height: 64, padding: '0 32px',
      display: 'flex', alignItems: 'center', gap: 24,
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginRight: 16 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: GRADIENTS.admin,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(124,58,237,0.4)',
        }}>
          <Shield size={19} color="#fff" />
        </div>
        <div>
          <span style={{ fontWeight: 900, fontSize: 19, color: COLORS.gray900, letterSpacing: '-0.4px' }}>
            HirePortal
          </span>
          <span style={{
            background: `${COLORS.primary}22`, color: COLORS.primary,
            fontSize: 9, fontWeight: 800, borderRadius: 5,
            padding: '2px 7px', marginLeft: 8, letterSpacing: '0.5px',
            verticalAlign: 'middle',
          }}>
            ADMIN
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button key={key} onClick={() => onTab(key)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 10, border: 'none',
              cursor: 'pointer', fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              background: isActive ? `${COLORS.primary}22`: 'transparent',
              color: isActive ? COLORS.primary : COLORS.gray500,
              transition: 'all 0.15s',
            }}>
              <Icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Admin info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: COLORS.gray900, margin: 0 }}>{adminName}</p>
          <p style={{ fontSize: 11, color: COLORS.primary, margin: 0, fontWeight: 700 }}>Super Admin</p>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: GRADIENTS.admin,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: COLORS.white, fontWeight: 900, fontSize: 15,
        }}>
          {adminName[0].toUpperCase()}
        </div>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 10,
          border: `1px solid ${COLORS.gray200}`, background: COLORS.white,
          color: COLORS.gray600, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <LogOut size={14} /> Logout
        </button>
      </div>

    </header>
  );
}