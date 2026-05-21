import { Building2, Briefcase, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const C = {
  gray900: '#111827',
  gray400: '#9ca3af',
};

export default function AdminActionCenter({ stats }) {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Unverified Companies',
      desc: 'Companies waiting for verification',
      icon: Building2,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      border: '#fde68a',
      bg: '#fffbeb',
      badgeBg: '#f59e0b',
      count: stats?.unverifiedCompanies || 0,
      route: '/admin/companies',
    },
    {
      label: 'Expired Jobs Active',
      desc: 'Jobs past deadline still showing',
      icon: Briefcase,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      border: '#fecaca',
      bg: '#fff5f5',
      badgeBg: '#dc2626',
      count: stats?.expiredJobs || 0,
      route: '/admin/jobs',
    },
    {
      label: 'Suspended Users',
      desc: 'Accounts currently suspended',
      icon: Users,
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
      border: '#e9d5ff',
      bg: '#f5f3ff',
      badgeBg: '#7c3aed',
      count: stats?.suspendedUsers || 0,
      route: '/admin/users',
    },
  ];

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '26px',
      boxShadow: '0 1px 5px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.gray900, margin: 0 }}>
          Action Center
        </h2>
        <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 12,
          fontWeight: 700, borderRadius: 8, padding: '4px 12px' }}>
          Needs Attention
        </span>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(({ label, desc, icon: Icon, iconBg, iconColor,
          border, bg, badgeBg, count, route }) => (
          <div key={label} onClick={() => navigate(route)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', borderRadius: 14,
            border: `1px solid ${border}`, background: bg,
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10,
                background: iconBg, display: 'flex', alignItems: 'center',
                justifyContent: 'center' }}>
                <Icon size={18} color={iconColor} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: C.gray900, margin: 0 }}>
                  {label}
                </p>
                <p style={{ fontSize: 12, color: C.gray400, margin: '2px 0 0' }}>
                  {desc}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: badgeBg, color: '#fff', fontWeight: 800,
                fontSize: 16, borderRadius: 9999, minWidth: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 8px'
              }}>
                {count}
              </span>
              <ChevronRight size={16} color={C.gray400} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}