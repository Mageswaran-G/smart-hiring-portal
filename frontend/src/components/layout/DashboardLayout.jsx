import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Bookmark, FileText,
  User, Users, PlusCircle, Building2, TrendingUp, Sparkles,
  Shield, LogOut, Menu, X, MessageSquare,
, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import SafeAvatar from '../ui/SafeAvatar';
import NotificationBell from '../notifications/NotificationBell';
import { useTheme } from '../../context/ThemeContext';


const COLORS = {
  candidate: { primary:'#ea580c', light:'#fff7ed', badge:'#ffd7b0', text:'#ea580c' },
  company:   { primary:'#1e3a5f', light:'#eff6ff', badge:'#bfdbfe', text:'#1e3a5f' },
  admin:     { primary:'#7c3aed', light:'#f5f3ff', badge:'#ddd6fe', text:'#7c3aed' },
};

const NAV_LINKS = {
  candidate: [
    { label:'Dashboard',    Icon:LayoutDashboard, path:ROUTES.CANDIDATE_DASHBOARD    },
    { label:'Browse Jobs',  Icon:Briefcase,       path:ROUTES.PUBLIC_JOBS            },
    { label:'Saved Jobs',   Icon:Bookmark,        path:ROUTES.SAVED_JOBS             },
    { label:'AI Match',     Icon:Sparkles,        path:ROUTES.RECOMMENDATIONS        },
    { label:'Applications', Icon:FileText,        path:ROUTES.CANDIDATE_APPLICATIONS },
    { label:'Interviews',   Icon:Calendar,       path:ROUTES.CANDIDATE_INTERVIEWS   },
    { label:'My Profile',   Icon:User,            path:ROUTES.PROFILE                },
  ],
  company: [
    { label:'Dashboard',  Icon:LayoutDashboard, path:ROUTES.COMPANY_DASHBOARD   },
    {
      label:'My Jobs', Icon:Briefcase, path:ROUTES.COMPANY_JOBS,
      activeWhen: (pathname) => pathname === ROUTES.COMPANY_JOBS || /^\/company\/jobs\/[^/]+\/edit$/.test(pathname),
    },
    { label:'Applicants',  Icon:Users,      path:ROUTES.COMPANY_APPLICATIONS },
    { label:'Interviews',  Icon:Calendar,   path:ROUTES.COMPANY_INTERVIEWS   },
    { label:'Post a Job', Icon:PlusCircle, path:ROUTES.COMPANY_JOB_CREATE  },
    { label:'My Profile', Icon:Building2,  path:ROUTES.PROFILE             },
  ],
  admin: [
    { label:'Dashboard', Icon:LayoutDashboard, path:ROUTES.ADMIN_DASHBOARD },
    { label:'Companies', Icon:Building2,       path:'/admin/companies'      },
    { label:'Users',     Icon:Users,           path:'/admin/users'          },
    { label:'Jobs',      Icon:Briefcase,       path:'/admin/jobs'           },
    { label:'Analytics', Icon:TrendingUp,      path:'/admin/analytics'      },
    { label:'HireBot',   Icon:MessageSquare,  path:ROUTES.ADMIN_CHAT         },
  ],
};

export default function DashboardLayout({ children }) {
  const { user, profile, logoutUser } = useAuth();
  useTheme(); // ThemeContext kept for future dark mode implementation
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const role   = user?.role || 'candidate';
  const colors = COLORS[role] || COLORS.candidate;
  const links  = NAV_LINKS[role] || NAV_LINKS.candidate;
  const name      = profile?.name || user?.name || 'User';
  const photo     = profile?.photo || null;
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate(ROUTES.LOGIN);
  };

  const isActive = (link) =>
    link.activeWhen?.(location.pathname) || location.pathname === link.path;

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:'system-ui,-apple-system,sans-serif', overflowX:'hidden', maxWidth:'100vw' }}>

      {/* ── Top Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 60,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center',
        padding: '0 28px', gap: 16,
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
      }} className="main-header">

        {/* Logo */}
        <Link to={links[0].path} style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0, marginRight:8 }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background: colors.primary,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: `0 2px 8px ${colors.primary}40`,
          }}>
            <Shield size={17} color="#fff" />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontWeight:900, fontSize:17, color:'#111827', letterSpacing:'-0.4px' }}>
              HirePortal
            </span>
            <span style={{
              background: `${colors.primary}12`,
              color: colors.primary,
              fontSize: 9, fontWeight: 800,
              borderRadius: 5, padding: '2px 6px',
              letterSpacing: '0.6px',
              border: `1px solid ${colors.primary}20`,
            }}>
              {roleLabel.toUpperCase()}
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div style={{ width:1, height:22, background:'rgba(0,0,0,0.08)', flexShrink:0 }} className="desktop-nav" />

        {/* Desktop Nav */}
        <nav style={{ display:'flex', gap:1, alignItems:'center' }} className="desktop-nav">
          {links.map(({ label, Icon, path, activeWhen }) => {
            const active = isActive({ path, activeWhen });
            return (
              <Link key={path} to={path} style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'7px 9px', borderRadius:9,
                textDecoration:'none', fontSize:13,
                fontWeight: active ? 700 : 500,
                color: active ? colors.primary : '#6b7280',
                background: active ? `${colors.primary}10` : 'transparent',
                transition:'all 0.15s ease',
                position: 'relative',
              }}>
                <Icon size={14} strokeWidth={active ? 2.5 : 1.8} />
                {label}
                {active && (
                  <span style={{
                    position:'absolute', bottom:-19, left:'50%',
                    transform:'translateX(-50%)',
                    width:'70%', height:2,
                    background:`linear-gradient(90deg, ${colors.primary}, ${colors.primary}80)`,
                    borderRadius:'2px 2px 0 0',
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="nav-spacer" style={{ flex:1 }} />

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }} className="header-right">

          {/* Notification Bell */}
          <NotificationBell />

          {/* User info — desktop */}
          <div style={{ textAlign:'right' }} className="desktop-userinfo">
            <p style={{ fontSize:13, fontWeight:700, color:'#111827', margin:0, lineHeight:1.3 }}>{name}</p>
            <p style={{ fontSize:11, fontWeight:600, color:colors.primary, margin:0 }}>{roleLabel}</p>
          </div>

          {/* Avatar */}
          <SafeAvatar
            src={photo} name={name}
            style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', border:`2px solid ${colors.primary}30`, flexShrink:0 }}
            fallbackStyle={{
              width:34, height:34, borderRadius:'50%',
              background: colors.primary,
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:800, fontSize:13, flexShrink:0,
              boxShadow: `0 2px 6px ${colors.primary}30`,
            }}
          />

          {/* Theme Toggle — hidden until full dark mode is implemented */}
          {/* TODO: Uncomment when all 85+ components are converted to CSS variables */}

          {/* Divider — desktop */}
          <div style={{ width:1, height:22, background:'rgba(0,0,0,0.08)' }} className="desktop-nav" />

          {/* Logout — desktop */}
          <button onClick={handleLogout} className="desktop-logout" style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'7px 14px', borderRadius:9,
            border:'1px solid rgba(0,0,0,0.08)',
            background:'#fff', color:'#6b7280',
            fontSize:13, fontWeight:600, cursor:'pointer',
            transition:'all 0.15s ease',
            boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.color='#dc2626'; e.currentTarget.style.borderColor='#fecaca'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#6b7280'; e.currentTarget.style.borderColor='rgba(0,0,0,0.08)'; }}
          >
            <LogOut size={14} /> Logout
          </button>

          {/* Hamburger — mobile */}
          <button onClick={() => setMenuOpen(v => !v)} className="mobile-menu-btn" style={{
            display:'none', padding:6, border:'none',
            background:'transparent', cursor:'pointer',
          }}>
            {menuOpen ? <X size={22} color="#374151" /> : <Menu size={22} color="#374151" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Dropdown ── */}
      {menuOpen && (
        <div style={{
          position:'fixed', top:60, left:0, right:0,
          background:'rgba(255,255,255,0.98)',
          backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(0,0,0,0.06)',
          zIndex:49, padding:'12px 16px 20px',
          boxShadow:'0 8px 32px rgba(0,0,0,0.12)',
        }}>
          {/* User row */}
          <div style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'12px 14px',
            background:'#f9fafb', borderRadius:14,
            marginBottom:12,
            border:'1px solid rgba(0,0,0,0.06)',
          }}>
            <SafeAvatar
              src={photo} name={name}
              style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover', border:`2px solid ${colors.primary}30` }}
              fallbackStyle={{ width:40, height:40, borderRadius:'50%', background:colors.primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16 }}
            />
            <div style={{ flex:1 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#111827', margin:0 }}>{name}</p>
              <p style={{ fontSize:11, fontWeight:600, color:colors.primary, margin:0 }}>{roleLabel}</p>
            </div>
            {/* Online dot */}
            <div style={{ display:'flex', alignItems:'center', gap:4, background:'#f0fdf4', padding:'4px 8px', borderRadius:8, border:'1px solid #bbf7d0' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', display:'inline-block' }} />
              <span style={{ fontSize:10, color:'#16a34a', fontWeight:600 }}>Online</span>
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:12 }}>
            {links.map(({ label, Icon, path, activeWhen }) => {
              const active = isActive({ path, activeWhen });
              return (
                <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'11px 14px', borderRadius:10,
                  textDecoration:'none', fontSize:14,
                  fontWeight: active ? 700 : 500,
                  color: active ? colors.primary : '#374151',
                  background: active ? `${colors.primary}10` : 'transparent',
                  transition:'all 0.15s ease',
                }}>
                  <div style={{
                    width:32, height:32, borderRadius:9,
                    background: active ? `${colors.primary}15` : '#f3f4f6',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0,
                  }}>
                    <Icon size={16} strokeWidth={active ? 2.5 : 1.8} color={active ? colors.primary : '#6b7280'} />
                  </div>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button onClick={handleLogout} style={{
            width:'100%', display:'flex', alignItems:'center',
            justifyContent:'center', gap:8, padding:'12px',
            borderRadius:12, border:'1px solid #fecaca',
            background:'#fef2f2', color:'#dc2626',
            fontSize:14, fontWeight:700, cursor:'pointer',
          }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}

      {/* Page Content */}
      <main style={{ padding:"24px 16px", overflowX:"hidden" }}>{children}</main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-spacer { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .main-header { padding: 0 16px !important; justify-content: space-between !important; gap: 0 !important; } main { padding: 16px !important; } section { padding: 16px 14px !important; }
          .desktop-logout { display: none !important; }
          .desktop-userinfo { display: none !important; }
          .header-right { gap: 8px !important; }
        }
      `}</style>
    </div>
  );
}