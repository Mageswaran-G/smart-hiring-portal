import { Briefcase, LayoutDashboard, PlusCircle, User, Users } from 'lucide-react';
import { C } from './dashboardTheme';

const MOBILE_TABS = [
  { key: 'overview', label: 'Home', Icon: LayoutDashboard },
  { key: 'jobs', label: 'My Jobs', Icon: Briefcase },
  { key: 'post', label: 'Post Job', Icon: PlusCircle },
  { key: 'apps', label: 'Applicants', Icon: Users },
  { key: 'profile', label: 'Profile', Icon: User },
];

export default function MobileTabBar({ active, onTab, jobCount, appCount }) {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(14px)', borderTop: `1px solid ${C.gray200}`, display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {MOBILE_TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        const badge = key === 'jobs' ? jobCount : key === 'apps' ? appCount : 0;
        return (
          <button key={key} onClick={() => onTab(key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '10px 4px 6px', background: 'none', border: 'none', cursor: 'pointer', color: isActive ? C.primary : C.gray400, position: 'relative', transition: 'color 0.15s' }}>
            {isActive && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 3, background: C.primary, borderRadius: '0 0 3px 3px' }} />}
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {badge > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -7, background: C.primary, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 9999, minWidth: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, lineHeight: 1 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
