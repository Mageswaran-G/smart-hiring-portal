// DashboardLayout.jsx
// TOP navigation bar — no left sidebar
// Shows: Logo | Nav links | User avatar | Logout
// Auto-detects role from AuthContext (no need to pass role prop from pages)

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Bookmark, FileText,
  User, Users, PlusCircle, Building2, BarChart3,
  Shield, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

// ─── Colors per role ─────────────────────────────────────────
const COLORS = {
  candidate : { primary:'#ea580c', light:'#fff7ed', badge:'#ffd7b0', text:'#ea580c' },
  company   : { primary:'#1e3a5f', light:'#eff6ff', badge:'#bfdbfe', text:'#1e3a5f' },
  admin     : { primary:'#7c3aed', light:'#f5f3ff', badge:'#ddd6fe', text:'#7c3aed' },
};

// ─── Nav links per role ──────────────────────────────────────
const NAV_LINKS = {
  candidate: [
    { label:'Dashboard',    Icon:LayoutDashboard, path:ROUTES.CANDIDATE_DASHBOARD    },
    { label:'Browse Jobs',  Icon:Briefcase,        path:ROUTES.PUBLIC_JOBS            },
    { label:'Saved Jobs',   Icon:Bookmark,         path:ROUTES.SAVED_JOBS             },
    { label:'Applications', Icon:FileText,          path:ROUTES.CANDIDATE_APPLICATIONS },
    { label:'My Profile',   Icon:User,             path:ROUTES.PROFILE                },
  ],
  company: [
    { label:'Dashboard',   Icon:LayoutDashboard, path:ROUTES.COMPANY_DASHBOARD   },
    { label:'My Jobs',     Icon:Briefcase,        path:ROUTES.COMPANY_JOBS        },
    { label:'Applicants',  Icon:Users,            path:ROUTES.COMPANY_APPLICATIONS },
    { label:'Post a Job',  Icon:PlusCircle,       path:ROUTES.COMPANY_JOB_CREATE  },
    { label:'My Profile',  Icon:Building2,        path:ROUTES.PROFILE             },
  ],
  admin: [
    { label:'Dashboard',  Icon:LayoutDashboard, path:ROUTES.ADMIN_DASHBOARD },
    { label:'Companies',  Icon:Building2,        path:ROUTES.ADMIN_DASHBOARD },
    { label:'Users',      Icon:Users,            path:ROUTES.ADMIN_DASHBOARD },
    { label:'Analytics',  Icon:BarChart3,        path:ROUTES.ADMIN_DASHBOARD },
  ],
};

export default function DashboardLayout({ children }) {
  const { user, profile, logoutUser } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-detect role — no prop needed from pages
  const role   = user?.role || 'candidate';
  const colors = COLORS[role]   || COLORS.candidate;
  const links  = NAV_LINKS[role] || NAV_LINKS.candidate;

  const name      = profile?.name || user?.name || 'User';
  const photo     = profile?.photo || null;
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:'system-ui,-apple-system,sans-serif' }}>

      {/* ══════════════════════════════════════════════════════
          TOP NAVIGATION BAR — desktop
          Shows: Logo | Nav links | User avatar | Role | Logout
          ══════════════════════════════════════════════════════ */}
      <header style={{
        position : 'sticky',
        top      : 0,
        zIndex   : 50,
        height   : 60,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e7eb',
        display  : 'flex',
        alignItems: 'center',
        padding  : '0 24px',
        gap      : 16,
      }}>

        {/* Logo */}
        <Link
          to={links[0].path}
          style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0, marginRight:8 }}
        >
          <div style={{ width:34, height:34, borderRadius:10, background:colors.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Shield size={18} color="#fff" />
          </div>
          <span style={{ fontWeight:900, fontSize:17, color:'#111827', letterSpacing:'-0.4px' }}>
            HirePortal
          </span>
        </Link>

        {/* ── Desktop Nav links ── */}
        <nav style={{ display:'flex', gap:2, flex:1, alignItems:'center' }} className="desktop-nav">
          {links.map(({ label, Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                style={{
                  display    : 'flex',
                  alignItems : 'center',
                  gap        : 6,
                  padding    : '6px 12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize   : 13,
                  fontWeight : active ? 700 : 500,
                  color      : active ? colors.primary : '#6b7280',
                  background : active ? `${colors.primary}12` : 'transparent',
                  transition : 'all 0.15s',
                }}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: User + Role + Logout ── */}
        <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>

          {/* User info */}
          <div style={{ textAlign:'right' }}>
            <p style={{ fontSize:13, fontWeight:700, color:'#111827', margin:0, lineHeight:1.2 }}>{name}</p>
            <p style={{ fontSize:11, fontWeight:600, color:colors.primary, margin:0 }}>{roleLabel}</p>
          </div>

          {/* Avatar */}
          {photo
            ? <img src={photo} alt="" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:`2px solid ${colors.badge}`, flexShrink:0 }} />
            : <div style={{ width:36, height:36, borderRadius:'50%', background:colors.primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0 }}>
                {name[0].toUpperCase()}
              </div>
          }

          {/* Logout — desktop */}
          <button
            onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:9, border:'1px solid #e5e7eb', background:'#fff', color:'#6b7280', fontSize:13, fontWeight:600, cursor:'pointer' }}
          >
            <LogOut size={14} /> Logout
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="mobile-menu-btn"
            style={{ display:'none', padding:6, border:'none', background:'transparent', cursor:'pointer' }}
          >
            {menuOpen ? <X size={22} color="#374151" /> : <Menu size={22} color="#374151" />}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          MOBILE DROPDOWN MENU
          Opens when hamburger is tapped on small screens
          ══════════════════════════════════════════════════════ */}
      {menuOpen && (
        <div style={{
          position : 'fixed',
          top      : 60,
          left     : 0,
          right    : 0,
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          zIndex   : 49,
          padding  : '12px 16px 20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
          {/* User row */}
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'#f9fafb', borderRadius:12, marginBottom:12 }}>
            {photo
              ? <img src={photo} alt="" style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', border:`2px solid ${colors.badge}` }} />
              : <div style={{ width:40, height:40, borderRadius:'50%', background:colors.primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16 }}>{name[0].toUpperCase()}</div>
            }
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:'#111827', margin:0 }}>{name}</p>
              <p style={{ fontSize:11, fontWeight:600, color:colors.primary, margin:0 }}>{roleLabel}</p>
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {links.map(({ label, Icon, path }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display    : 'flex',
                    alignItems : 'center',
                    gap        : 10,
                    padding    : '11px 14px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize   : 14,
                    fontWeight : active ? 700 : 500,
                    color      : active ? colors.primary : '#374151',
                    background : active ? `${colors.primary}12` : 'transparent',
                  }}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 1.8} color={active ? colors.primary : '#6b7280'} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{ width:'100%', marginTop:12, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', borderRadius:10, border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontSize:14, fontWeight:700, cursor:'pointer' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          PAGE CONTENT
          ══════════════════════════════════════════════════════ */}
      <main>
        {children}
      </main>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

    </div>
  );
}