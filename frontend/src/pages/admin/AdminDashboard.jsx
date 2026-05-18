// AdminDashboard
// Purple theme — #7c3aed / #5b21b6
// Self-contained: inline ProgressRing, Sparkline, MiniBarChart
// Fully responsive: desktop grid layout + mobile stacked + bottom tab bar

import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, BarChart3, Settings,
  LogOut, ChevronRight, Shield, Activity, TrendingUp,
  CheckCircle, Clock, AlertCircle, Lock, Zap, Brain,
  Mail, UserCheck, Building2, FileText, ShieldCheck, XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';

// ─── Brand Colors ─────────────────────────────────────────────
const C = {
  primary  : '#7c3aed',
  dark     : '#5b21b6',
  darker   : '#4c1d95',
  accent   : '#a78bfa',
  light    : '#f5f3ff',
  border   : '#ddd6fe',
  grad     : 'linear-gradient(135deg, #1e0b4b 0%, #2e1065 25%, #4c1d95 55%, #6d28d9 80%, #7c3aed 100%)',
  white    : '#ffffff',
  gray50   : '#f9fafb',
  gray100  : '#f3f4f6',
  gray200  : '#e5e7eb',
  gray300  : '#d1d5db',
  gray400  : '#9ca3af',
  gray500  : '#6b7280',
  gray600  : '#4b5563',
  gray700  : '#374151',
  gray800  : '#1f2937',
  gray900  : '#111827',
};

// ─── Helper: time ago ─────────────────────────────────────────
function timeAgo(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 30)  return `${d}d ago`;
  return `${Math.floor(d/30)}mo ago`;
}

// ─── Inline ProgressRing ──────────────────────────────────────
function ProgressRing({ value = 0, size = 80, stroke = 8, color = C.accent, bg = 'rgba(255,255,255,0.18)', textColor = '#fff', label = '' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 0.7s ease' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:size*0.21, fontWeight:800, color:textColor, lineHeight:1 }}>{value}%</span>
        {label && <span style={{ fontSize:size*0.13, color:textColor, opacity:0.7, lineHeight:1, marginTop:1 }}>{label}</span>}
      </div>
    </div>
  );
}

// ─── Inline Sparkline ─────────────────────────────────────────
function Sparkline({ data = [], color = C.primary, w = 100, h = 38, id = 'ad' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: +((i / (data.length - 1)) * w).toFixed(2),
    y: +((h - 4) - ((v - min) / range) * (h - 8)).toFixed(2),
  }));
  const line = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const gId  = `sg-admin-${id}`;
  return (
    <svg width={w} height={h} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="2.5" fill={color} />
    </svg>
  );
}

// ─── Inline MiniBarChart ──────────────────────────────────────
function MiniBarChart({ data = [], color = C.primary, w = 100, h = 44 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const gap = 3; const bw = (w - (data.length - 1) * gap) / data.length;
  return (
    <svg width={w} height={h} style={{ display:'block' }}>
      {data.map((v, i) => {
        const bh = Math.max(3, (v / max) * (h - 4));
        return <rect key={i} x={i*(bw+gap)} y={h-bh} width={bw} height={bh} rx={3} fill={color} opacity={i===data.length-1 ? 1 : 0.3+(v/max)*0.5} />;
      })}
    </svg>
  );
}

// ─── Mobile Bottom Tab Bar ────────────────────────────────────
const MOB_TABS = [
  { key:'overview',  label:'Home',      Icon:LayoutDashboard },
  { key:'companies', label:'Companies', Icon:Building2       },
  { key:'users',     label:'Users',     Icon:Users           },
  { key:'analytics', label:'Analytics', Icon:BarChart3       },
  { key:'system',    label:'System',    Icon:Settings        },
];

function MTabBar({ active, onTab }) {
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:60, background:'rgba(255,255,255,0.97)', backdropFilter:'blur(14px)', borderTop:`1px solid ${C.gray200}`, display:'flex', paddingBottom:'env(safe-area-inset-bottom)' }}>
      {MOB_TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button key={key} onClick={() => onTab(key)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, padding:'10px 4px 6px', background:'none', border:'none', cursor:'pointer', color: isActive ? C.primary : C.gray400, position:'relative', transition:'color 0.15s' }}>
            {isActive && <span style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:3, background:C.primary, borderRadius:'0 0 3px 3px' }} />}
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize:10, fontWeight: isActive ? 700 : 400, lineHeight:1 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Loading Screen ───────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:C.gray50, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.primary, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:C.gray400, fontSize:14 }}>Loading admin panel…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Module data (Module 5 + future) ─────────────────────────
const MODULES = [
  {
    num: 5, label:'Admin Dashboard', icon:Shield, color:'#7c3aed',
    status:'in_progress', progress:60,
    features:['User management', 'Job moderation', 'Platform analytics', 'Role controls'],
  },
  {
    num: 6, label:'AI Features', icon:Brain, color:'#0891b2',
    status:'locked', progress:0,
    features:['AI job suggestions', 'Resume matching', 'Smart screening', 'Skill gap analysis'],
  },
  {
    num: 7, label:'Email Notifications', icon:Mail, color:'#059669',
    status:'locked', progress:0,
    features:['Application updates', 'Job alerts', 'Weekly digest', 'Status changes'],
  },
];

// ─── System status items ──────────────────────────────────────
const SYSTEM_STATUS = [
  { label:'API Server',       status:'online',      icon:Activity },
  { label:'Database',         status:'online',      icon:CheckCircle },
  { label:'File Storage',     status:'online',      icon:ShieldCheck },
  { label:'Module 5',         status:'progress',    icon:Clock },
  { label:'Module 6 (AI)',    status:'offline',     icon:Lock },
];

// ─── Main Component ───────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, user, logoutUser } = useAuth();
  const isMobile = useIsMobile();

  const [activeTab,    setActiveTab]   = useState('overview');
  const [stats,        setStats]       = useState(null);
  const [loading,      setLoading]     = useState(true);

  // ── Companies state ──────────────────────────────────
  const [companies,    setCompanies]   = useState([]);
  const [verifying,    setVerifying]   = useState(null); // ID of company being verified
  const fetchedRef = useRef(false);

  // ── Fetch stats on mount ─────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const res = await API.get(API_ENDPOINTS.ADMIN_STATS);
        setStats(res.data.data || res.data);
      } catch (err) {
        console.error('AdminDashboard stats error:', err);
        setStats({ totalUsers:0, totalCandidates:0, totalCompanies:0, totalJobs:0, totalApplications:0, hired:0, shortlisted:0, recentUsers:[] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Fetch companies when Companies tab is opened ─────
  const loadCompanies = async () => {
    try {
      const res = await API.get(API_ENDPOINTS.ADMIN_COMPANIES);
      setCompanies(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load companies');
    }
  };

  // ── Toggle verify / unverify ─────────────────────────
  // Calls PATCH /admin/companies/:id/verify
  // Backend flips isVerified and returns updated company
  const handleVerify = async (companyId) => {
    setVerifying(companyId); // show loading state on this button
    try {
      const res = await API.patch(API_ENDPOINTS.ADMIN_VERIFY_COMPANY(companyId));
      const updated = res.data.data;

      // Update only this company in the list — no full reload needed
      setCompanies(prev =>
        prev.map(c => c._id === companyId ? { ...c, isVerified: updated.isVerified } : c)
      );

      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setVerifying(null);
    }
  };

  const handleTab = (key) => {
    setActiveTab(key);
    // Load companies from backend when Companies tab is opened
    if (key === 'companies' && companies.length === 0) {
      loadCompanies();
    }
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate(ROUTES.LOGIN);
  };

  if (loading) return <LoadingScreen />;

  // Sparkline trends (realistic mock for visual interest)
  const userTrend  = [5,8,7,12,11,14, stats?.totalUsers||0];
  const jobTrend   = [2,3,5,4,7,8,   stats?.totalJobs||0];
  const appTrend   = [8,12,10,15,14,18,stats?.totalApplications||0];
  const hireTrend  = [1,1,2,2,3,3,   stats?.hired||0];

  const hireRate   = stats?.totalApplications > 0
    ? Math.round((stats.hired / stats.totalApplications) * 100)
    : 0;

  const adminName  = profile?.name || user?.name || 'Admin';
  const adminEmail = user?.email || profile?.email || 'admin@hireportal.com';

  // ════════════════════════════════════════════════════════════
  // MOBILE LAYOUT
  // ════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div style={{ minHeight:'100vh', background:C.gray50, paddingBottom:72, fontFamily:'system-ui,-apple-system,sans-serif' }}>

        {/* ── Mobile Header ── */}
        <header style={{ background:'#fff', borderBottom:`1px solid ${C.gray200}`, height:56, padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:C.grad, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Shield size={16} color="#fff" />
            </div>
            <span style={{ fontWeight:900, fontSize:17, color:C.gray900, letterSpacing:'-0.3px' }}>HirePortal</span>
          </div>
          <span style={{ background:`${C.primary}14`, color:C.primary, fontSize:10, fontWeight:800, borderRadius:9999, padding:'4px 10px', letterSpacing:'0.4px' }}>
            ADMIN
          </span>
        </header>

        {/* ── Mobile Hero ── */}
        <section style={{ background:C.grad, padding:'20px 16px 24px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            {/* Admin avatar — no click, no profile */}
            <div style={{ width:52, height:52, borderRadius:14, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:22, border:'2px solid rgba(255,255,255,0.35)', flexShrink:0 }}>
              {adminName[0].toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:11, margin:'0 0 2px', fontWeight:500 }}>Super Admin</p>
              <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:'0 0 2px', lineHeight:1.1, letterSpacing:'-0.4px' }}>
                {adminName}
              </h1>
              <p style={{ color:'rgba(255,255,255,0.65)', fontSize:11, margin:0 }}>{adminEmail}</p>
            </div>
          </div>

          {/* System status */}
          <div style={{ background:'rgba(0,0,0,0.22)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:10, margin:'0 0 7px', fontWeight:700, letterSpacing:'0.5px', textTransform:'uppercase' }}>System Status</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {SYSTEM_STATUS.slice(0, 3).map(({ label, status }) => (
                <span key={label} style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.85)', fontSize:10, fontWeight:600, borderRadius:9999, padding:'3px 9px' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background: status==='online' ? '#22c55e' : status==='progress' ? '#f59e0b' : '#ef4444', display:'inline-block', flexShrink:0 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mobile Platform Stats 2×2 ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:'0 0 10px' }}>Platform Overview</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Total Users',    value:stats?.totalUsers||0,        color:C.primary, Icon:Users,     trend:userTrend,  id:'u' },
              { label:'Companies',      value:stats?.totalCompanies||0,    color:'#0891b2', Icon:Building2, trend:[1,1,2,2,3,3,stats?.totalCompanies||0], id:'c' },
              { label:'Jobs Posted',    value:stats?.totalJobs||0,         color:'#8b5cf6', Icon:Briefcase, trend:jobTrend,   id:'j' },
              { label:'Applications',   value:stats?.totalApplications||0, color:'#059669', Icon:FileText,  trend:appTrend,   id:'a' },
            ].map(({ label, value, color, Icon, trend, id }) => (
              <div key={label} style={{ background:'#fff', borderRadius:14, padding:'14px 14px 10px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={17} color={color} />
                  </div>
                  <span style={{ fontSize:26, fontWeight:900, color:C.gray900, lineHeight:1 }}>{value}</span>
                </div>
                <Sparkline data={trend} color={color} w={72} h={28} id={id} />
                <p style={{ fontSize:11, color:C.gray400, margin:'6px 0 0', fontWeight:600 }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mobile Hire Stats ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <div style={{ background:`${C.primary}12`, borderRadius:14, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:11, color:C.gray500, margin:'0 0 4px', fontWeight:600 }}>Platform Hire Rate</p>
                <p style={{ fontSize:28, fontWeight:900, color:C.primary, margin:0, letterSpacing:'-0.5px' }}>{hireRate}%</p>
                <p style={{ fontSize:11, color:C.gray400, margin:'3px 0 0' }}>
                  {stats?.hired||0} hired from {stats?.totalApplications||0} applications
                </p>
              </div>
              <ProgressRing value={hireRate} size={68} stroke={7} color={C.primary} bg={`${C.primary}22`} textColor={C.primary} />
            </div>
          </div>
        </section>

        {/* ── Mobile Module Progress ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:'0 0 10px' }}>Module Progress</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {MODULES.map(({ num, label, icon:Icon, color, status, progress, features }) => (
              <div key={num} style={{ background:'#fff', borderRadius:14, padding:'14px 16px', border:`1px solid ${C.gray100}`, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={18} color={color} />
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:800, color:C.gray900, margin:'0 0 1px' }}>Module {num}</p>
                      <p style={{ fontSize:11, color:C.gray400, margin:0 }}>{label}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize:10, fontWeight:700, borderRadius:7, padding:'3px 8px',
                    background: status==='in_progress' ? '#fef3c7' : status==='online' ? '#d1fae5' : C.gray100,
                    color: status==='in_progress' ? '#92400e' : status==='online' ? '#065f46' : C.gray500,
                  }}>
                    {status==='in_progress' ? 'In Progress' : status==='online' ? 'Done' : 'Locked'}
                  </span>
                </div>
                {status !== 'locked' && (
                  <div>
                    <div style={{ height:5, background:C.gray100, borderRadius:9999, overflow:'hidden', marginBottom:4 }}>
                      <div style={{ width:`${progress}%`, height:'100%', background:color, borderRadius:9999, transition:'width 0.8s ease' }} />
                    </div>
                    <p style={{ fontSize:10, color:C.gray400, margin:0, textAlign:'right' }}>{progress}% complete</p>
                  </div>
                )}
                {status === 'locked' && (
                  <p style={{ fontSize:11, color:C.gray400, margin:0, display:'flex', alignItems:'center', gap:4 }}>
                    <Lock size={10} /> Coming in future sprint
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Mobile Recent Signups ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:'0 0 10px' }}>Recent Signups</p>
          {!stats?.recentUsers?.length ? (
            <div style={{ background:'#fff', borderRadius:14, padding:'20px', textAlign:'center', border:`1px solid ${C.gray100}` }}>
              <p style={{ color:C.gray400, fontSize:13, margin:0 }}>No recent signups</p>
            </div>
          ) : (
            <div style={{ background:'#fff', borderRadius:14, border:`1px solid ${C.gray100}`, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              {stats.recentUsers.slice(0, 5).map((u, idx) => {
                const roleColor = u.role === 'candidate' ? '#ea580c' : u.role === 'company' ? '#1e3a5f' : C.primary;
                return (
                  <div key={u._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderBottom: idx < stats.recentUsers.slice(0,5).length-1 ? `1px solid ${C.gray100}` : 'none' }}>
                    {u.photo
                      ? <img src={u.photo} alt="" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                      : <div style={{ width:32, height:32, borderRadius:'50%', background:`${roleColor}14`, display:'flex', alignItems:'center', justifyContent:'center', color:roleColor, fontWeight:800, fontSize:12, flexShrink:0 }}>
                          {(u.name||'?')[0].toUpperCase()}
                        </div>
                    }
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:700, fontSize:12, color:C.gray900, margin:'0 0 1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name||'—'}</p>
                      <p style={{ fontSize:10, color:C.gray400, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</p>
                    </div>
                    <span style={{ background:`${roleColor}14`, color:roleColor, fontSize:9, fontWeight:800, borderRadius:6, padding:'3px 7px', textTransform:'uppercase', flexShrink:0 }}>
                      {u.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Mobile Logout ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <button onClick={handleLogout} style={{ width:'100%', background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:14, padding:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, color:'#ef4444', fontSize:14, fontWeight:700, cursor:'pointer' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </section>

        <MTabBar active={activeTab} onTab={handleTab} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // ════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>

      {/* ── Desktop Header ── */}
      <header style={{ position:'sticky', top:0, zIndex:50, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.gray200}`, height:64, padding:'0 32px', display:'flex', alignItems:'center', gap:24 }}>

        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, marginRight:16 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:C.grad, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 10px rgba(124,58,237,0.4)' }}>
            <Shield size={19} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight:900, fontSize:19, color:C.gray900, letterSpacing:'-0.4px' }}>HirePortal</span>
            <span style={{ background:`${C.primary}14`, color:C.primary, fontSize:9, fontWeight:800, borderRadius:5, padding:'2px 7px', marginLeft:8, letterSpacing:'0.5px', verticalAlign:'middle' }}>ADMIN</span>
          </div>
        </div>

        <nav style={{ display:'flex', gap:4, flex:1 }}>
          {[
            { key:'overview',   label:'Overview',    Icon:LayoutDashboard },
            { key:'companies',  label:'Companies',   Icon:Building2       },
            { key:'users',      label:'Users',       Icon:Users           },
            { key:'analytics',  label:'Analytics',   Icon:BarChart3       },
          ].map(({ key, label, Icon }) => {
            const isActive = activeTab === key;
            return (
              <button key={key} onClick={() => handleTab(key)} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight: isActive ? 700 : 500, background: isActive ? `${C.primary}14` : 'transparent', color: isActive ? C.primary : C.gray500, transition:'all 0.15s' }}>
                <Icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ display:'flex', alignItems:'center', gap:14, flexShrink:0 }}>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontSize:13, fontWeight:800, color:C.gray900, margin:0, lineHeight:1.2 }}>{adminName}</p>
            <p style={{ fontSize:11, color:C.primary, margin:0, fontWeight:700 }}>Super Admin</p>
          </div>
          <div style={{ width:38, height:38, borderRadius:'50%', background:C.grad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:15 }}>
            {adminName[0].toUpperCase()}
          </div>
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:`1px solid ${C.gray200}`, background:'#fff', color:C.gray600, fontSize:13, fontWeight:600, cursor:'pointer' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* ── Desktop Hero ── */}
      <section style={{ background:C.grad, padding:'44px 32px 52px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:32 }}>

          {/* Left: Admin Identity */}
          <div style={{ display:'flex', alignItems:'center', gap:22 }}>
            <div style={{ width:86, height:86, borderRadius:22, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:34, border:'3px solid rgba(255,255,255,0.3)', flexShrink:0, letterSpacing:'-1px' }}>
              {adminName[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <span style={{ background:'rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.9)', fontSize:11, fontWeight:800, borderRadius:9999, padding:'3px 12px', letterSpacing:'0.5px', border:'1px solid rgba(255,255,255,0.25)' }}>
                  SUPER ADMIN
                </span>
                <span style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(34,197,94,0.25)', color:'#86efac', fontSize:11, fontWeight:700, borderRadius:9999, padding:'3px 10px', border:'1px solid rgba(34,197,94,0.3)' }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }} />
                  System Online
                </span>
              </div>
              <h1 style={{ color:'#fff', fontWeight:900, fontSize:32, margin:'0 0 5px', lineHeight:1.1, letterSpacing:'-0.8px' }}>
                {adminName}
              </h1>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, margin:'0 0 14px' }}>{adminEmail}</p>
              <div style={{ display:'flex', gap:10 }}>
                {[
                  { label:`${stats?.totalUsers||0} Users` },
                  { label:`${stats?.totalJobs||0} Jobs` },
                  { label:`${stats?.totalApplications||0} Applications` },
                ].map(({ label }) => (
                  <span key={label} style={{ background:'rgba(255,255,255,0.16)', color:'rgba(255,255,255,0.92)', fontSize:12, fontWeight:700, borderRadius:9999, padding:'4px 13px', border:'1px solid rgba(255,255,255,0.18)' }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Platform Status Panel */}
          <div style={{ background:'rgba(0,0,0,0.22)', borderRadius:22, padding:'22px 28px', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.1)', flexShrink:0, minWidth:290 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:12, margin:0, fontWeight:700, letterSpacing:'0.3px' }}>Platform Status</p>
              <ProgressRing value={hireRate} size={52} stroke={5} color="#a78bfa" bg="rgba(255,255,255,0.15)" textColor="#fff" label="rate" />
            </div>
            {SYSTEM_STATUS.map(({ label, status, icon:Icon }) => {
              const dotColor = status==='online' ? '#22c55e' : status==='progress' ? '#f59e0b' : '#6b7280';
              const textColor = status==='online' ? '#86efac' : status==='progress' ? '#fde68a' : 'rgba(255,255,255,0.45)';
              const statusLabel = status==='online' ? 'Online' : status==='progress' ? 'In Progress' : 'Locked';
              return (
                <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Icon size={14} color={textColor} />
                    <span style={{ fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:500 }}>{label}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:dotColor, display:'inline-block' }} />
                    <span style={{ fontSize:11, fontWeight:700, color:textColor }}>{statusLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Desktop Stats Row ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'26px 32px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[
            { label:'Total Users',    value:stats?.totalUsers||0,        sub:`${stats?.totalCandidates||0} candidates`,    Icon:Users,     color:C.primary, trend:userTrend, id:'u' },
            { label:'Companies',      value:stats?.totalCompanies||0,    sub:'registered',                                 Icon:Building2, color:'#0891b2', trend:[1,1,2,2,3,3,stats?.totalCompanies||0], id:'c' },
            { label:'Jobs Posted',    value:stats?.totalJobs||0,         sub:'all time',                                   Icon:Briefcase, color:'#8b5cf6', trend:jobTrend,  id:'j' },
            { label:'Applications',   value:stats?.totalApplications||0, sub:`${stats?.hired||0} hired`,                  Icon:FileText,  color:'#059669', trend:appTrend,  id:'a' },
          ].map(({ label, value, sub, Icon, color, trend, id }) => (
            <div key={label} style={{ background:'#fff', borderRadius:18, padding:'22px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <p style={{ fontSize:12, color:C.gray400, margin:'0 0 5px', fontWeight:600 }}>{label}</p>
                  <p style={{ fontSize:36, fontWeight:900, color:C.gray900, margin:0, lineHeight:1, letterSpacing:'-1px' }}>{value}</p>
                  <p style={{ fontSize:11, color:C.gray400, margin:'4px 0 0' }}>{sub}</p>
                </div>
                <div style={{ width:44, height:44, borderRadius:13, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={22} color={color} />
                </div>
              </div>
              <Sparkline data={trend} color={color} w={108} h={38} id={id} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Desktop Main Content ── */}
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'22px 32px 48px', display:'grid', gridTemplateColumns:'1fr 380px', gap:22 }}>

        {/* Left Column */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Platform Overview Analytics */}
          <div style={{ background:'#fff', borderRadius:20, padding:'26px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900, margin:'0 0 20px', letterSpacing:'-0.3px' }}>Platform Analytics</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Hire rate overview */}
              <div style={{ background:C.grad, borderRadius:16, padding:'20px', display:'flex', alignItems:'center', gap:18 }}>
                <ProgressRing value={hireRate} size={76} stroke={7} color="#a78bfa" bg="rgba(255,255,255,0.18)" textColor="#fff" label="hired" />
                <div>
                  <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, margin:'0 0 4px' }}>Platform Hire Rate</p>
                  <p style={{ color:'#fff', fontWeight:900, fontSize:20, margin:'0 0 8px', letterSpacing:'-0.5px' }}>{stats?.hired||0} Hired</p>
                  <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, margin:0 }}>
                    from {stats?.totalApplications||0} applications
                  </p>
                </div>
              </div>

              {/* User breakdown */}
              <div style={{ background:C.light, borderRadius:16, padding:'20px', border:`1px solid ${C.border}` }}>
                <p style={{ fontSize:13, fontWeight:800, color:C.primary, margin:'0 0 14px' }}>User Breakdown</p>
                {[
                  { label:'Candidates', value:stats?.totalCandidates||0, total:stats?.totalUsers||1, color:'#ea580c' },
                  { label:'Companies',  value:stats?.totalCompanies||0,  total:stats?.totalUsers||1, color:'#1e3a5f' },
                ].map(({ label, value, total, color }) => {
                  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                  return (
                    <div key={label} style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontSize:12, color:C.gray600, fontWeight:600 }}>{label}</span>
                        <span style={{ fontSize:12, color:C.gray900, fontWeight:800 }}>{value} <span style={{ color:C.gray400, fontWeight:400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height:7, background:'rgba(0,0,0,0.07)', borderRadius:9999, overflow:'hidden' }}>
                        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:9999, transition:'width 0.8s ease' }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                  <MiniBarChart data={userTrend} color={C.primary} w={180} h={40} />
                  <p style={{ fontSize:10, color:C.gray400, margin:'5px 0 0', fontWeight:500 }}>User signups — 7-day trend</p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Progress */}
          <div style={{ background:'#fff', borderRadius:20, padding:'26px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900, margin:'0 0 18px', letterSpacing:'-0.3px' }}>Module Roadmap</h2>

            {/* Warning banner */}
            <div style={{ background:'#fef3c7', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, marginBottom:16, border:'1px solid #fde68a' }}>
              <AlertCircle size={16} color="#d97706" style={{ flexShrink:0 }} />
              <p style={{ fontSize:13, color:'#92400e', margin:0, fontWeight:500 }}>
                Module 5 (Admin Features) is currently under development. Advanced admin controls coming soon.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {MODULES.map(({ num, label, icon:Icon, color, status, progress, features }) => (
                <div key={num} style={{ borderRadius:16, border:`1px solid ${status==='locked' ? C.gray100 : `${color}30`}`, padding:'18px', background: status==='locked' ? C.gray50 : `${color}06`, position:'relative', overflow:'hidden' }}>
                  {status === 'locked' && (
                    <div style={{ position:'absolute', top:10, right:10 }}>
                      <Lock size={14} color={C.gray300} />
                    </div>
                  )}
                  <div style={{ width:40, height:40, borderRadius:11, background: status==='locked' ? C.gray100 : `${color}15`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                    <Icon size={20} color={status==='locked' ? C.gray400 : color} />
                  </div>
                  <div style={{ marginBottom:4, display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:11, fontWeight:800, color: status==='locked' ? C.gray400 : C.gray900, letterSpacing:'0.2px' }}>MODULE {num}</span>
                    <span style={{
                      fontSize:9, fontWeight:700, borderRadius:5, padding:'2px 6px',
                      background: status==='in_progress' ? '#fef3c7' : status==='online' ? '#d1fae5' : C.gray100,
                      color: status==='in_progress' ? '#92400e' : status==='online' ? '#065f46' : C.gray400,
                    }}>
                      {status==='in_progress' ? 'Active' : status==='online' ? 'Done' : 'Soon'}
                    </span>
                  </div>
                  <p style={{ fontSize:14, fontWeight:800, color: status==='locked' ? C.gray400 : C.gray900, margin:'0 0 10px', lineHeight:1.2 }}>{label}</p>
                  {status !== 'locked' && (
                    <div style={{ marginBottom:10 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontSize:10, color:C.gray400 }}>Progress</span>
                        <span style={{ fontSize:10, color, fontWeight:700 }}>{progress}%</span>
                      </div>
                      <div style={{ height:5, background:C.gray100, borderRadius:9999, overflow:'hidden' }}>
                        <div style={{ width:`${progress}%`, height:'100%', background:color, borderRadius:9999 }} />
                      </div>
                    </div>
                  )}
                  <ul style={{ margin:0, paddingLeft:14 }}>
                    {features.map(f => (
                      <li key={f} style={{ fontSize:11, color: status==='locked' ? C.gray400 : C.gray500, marginBottom:3, lineHeight:1.3 }}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          {/* System Status Card */}
          <div style={{ background:C.grad, borderRadius:22, padding:'24px', boxShadow:'0 6px 28px rgba(124,58,237,0.3)' }}>
            <h3 style={{ color:'#fff', fontWeight:900, fontSize:16, margin:'0 0 16px', letterSpacing:'-0.3px' }}>System Status</h3>
            {SYSTEM_STATUS.map(({ label, status, icon:Icon }) => {
              const dotColor = status==='online' ? '#22c55e' : status==='progress' ? '#f59e0b' : '#6b7280';
              const labelColor = status==='online' ? '#86efac' : status==='progress' ? '#fde68a' : 'rgba(255,255,255,0.4)';
              return (
                <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Icon size={14} color="rgba(255,255,255,0.7)" />
                    <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontWeight:500 }}>{label}</span>
                  </div>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:labelColor }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:dotColor }} />
                    {status==='online' ? 'Online' : status==='progress' ? 'In Progress' : 'Locked'}
                  </span>
                </div>
              );
            })}
            {/* Trend bar */}
            <div style={{ marginTop:16 }}>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:11, margin:'0 0 8px', fontWeight:600 }}>User growth trend</p>
              <MiniBarChart data={userTrend} color="rgba(255,255,255,0.6)" w={220} h={44} />
            </div>
          </div>

          {/* Recent Signups */}
          <div style={{ background:'#fff', borderRadius:20, padding:'22px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}`, flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:C.gray900, margin:0, letterSpacing:'-0.2px' }}>Recent Signups</h3>
              <span style={{ fontSize:11, color:C.gray400, fontWeight:600 }}>Last {stats?.recentUsers?.length||0} users</span>
            </div>

            {!stats?.recentUsers?.length ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <Users size={28} color={C.gray200} style={{ margin:'0 auto 10px' }} />
                <p style={{ color:C.gray400, fontSize:13, margin:0 }}>No recent signups</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {stats.recentUsers.slice(0, 7).map((u, idx) => {
                  const roleColor = u.role === 'candidate' ? '#ea580c' : u.role === 'company' ? '#1e3a5f' : C.primary;
                  return (
                    <div key={u._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 10px', borderRadius:12, background: idx%2===0 ? 'transparent' : C.gray50 }}>
                      {u.photo
                        ? <img src={u.photo} alt="" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                        : <div style={{ width:36, height:36, borderRadius:'50%', background:`${roleColor}14`, display:'flex', alignItems:'center', justifyContent:'center', color:roleColor, fontWeight:800, fontSize:14, flexShrink:0 }}>
                            {(u.name||'?')[0].toUpperCase()}
                          </div>
                      }
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:700, fontSize:13, color:C.gray900, margin:'0 0 1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {u.name || '—'}
                        </p>
                        <p style={{ fontSize:11, color:C.gray400, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {u.email}
                        </p>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3, flexShrink:0 }}>
                        <span style={{ background:`${roleColor}14`, color:roleColor, fontSize:9, fontWeight:800, borderRadius:6, padding:'3px 8px', textTransform:'uppercase' }}>
                          {u.role}
                        </span>
                        <span style={{ fontSize:10, color:C.gray400 }}>{timeAgo(u.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Companies Tab Panel ───────────────────────────────── */}
      {activeTab === 'companies' && (
        <section style={{ maxWidth:1200, margin:'0 auto', padding:'26px 32px 48px' }}>

          {/* Header row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h2 style={{ fontSize:20, fontWeight:800, color:C.gray900, margin:'0 0 4px', letterSpacing:'-0.4px' }}>
                Company Accounts
              </h2>
              <p style={{ fontSize:13, color:C.gray400, margin:0 }}>
                Verify companies to show the blue verified badge on their job posts
              </p>
            </div>
            <span style={{ background:`${C.primary}12`, color:C.primary, fontSize:13, fontWeight:700, borderRadius:10, padding:'6px 14px' }}>
              {companies.length} companies
            </span>
          </div>

          {/* Loading state */}
          {companies.length === 0 && (
            <div style={{ background:'#fff', borderRadius:18, padding:'40px', textAlign:'center', border:`1px solid ${C.gray100}` }}>
              <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.primary, borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
              <p style={{ color:C.gray400, fontSize:14, margin:0 }}>Loading companies...</p>
            </div>
          )}

          {/* Companies list */}
          {companies.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {companies.map(company => (
                <div key={company._id} style={{ background:'#fff', borderRadius:18, padding:'20px 24px', border:`1px solid ${C.gray100}`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:16 }}>

                  {/* Avatar */}
                  <div style={{ width:48, height:48, borderRadius:14, background:`${C.primary}14`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontWeight:900, fontSize:20, flexShrink:0 }}>
                    {(company.companyName || company.name || 'C')[0].toUpperCase()}
                  </div>

                  {/* Company info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <p style={{ fontWeight:800, fontSize:15, color:C.gray900, margin:0 }}>
                        {company.companyName || company.name}
                      </p>
                      {/* Verified badge */}
                      {company.isVerified && (
                        <span style={{ display:'flex', alignItems:'center', gap:4, background:'#dbeafe', color:'#1e40af', fontSize:11, fontWeight:700, borderRadius:9999, padding:'2px 9px' }}>
                          <ShieldCheck size={11} /> Verified
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize:12, color:C.gray400, margin:'0 0 2px' }}>{company.email}</p>
                    <p style={{ fontSize:11, color:C.gray300, margin:0 }}>
                      {company.industry || 'No industry'}{company.companySize ? ` · ${company.companySize} employees` : ''} · Joined {timeAgo(company.createdAt)}
                    </p>
                  </div>

                  {/* Status + Verify button */}
                  <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
                    {/* Current status pill */}
                    <span style={{
                      fontSize:11, fontWeight:700, borderRadius:9999, padding:'4px 12px',
                      background: company.isVerified ? '#d1fae5' : C.gray100,
                      color:      company.isVerified ? '#065f46' : C.gray500,
                    }}>
                      {company.isVerified ? 'Verified' : 'Unverified'}
                    </span>

                    {/* Verify / Unverify button */}
                    <button
                      onClick={() => handleVerify(company._id)}
                      disabled={verifying === company._id}
                      style={{
                        display:'flex', alignItems:'center', gap:6,
                        padding:'9px 18px', borderRadius:11, border:'none',
                        fontSize:13, fontWeight:700, cursor:'pointer',
                        background: company.isVerified ? '#fee2e2' : C.primary,
                        color:      company.isVerified ? '#991b1b' : '#fff',
                        opacity: verifying === company._id ? 0.6 : 1,
                        transition:'all 0.15s',
                      }}
                    >
                      {verifying === company._id ? (
                        <>
                          <span style={{ width:14, height:14, border:`2px solid rgba(255,255,255,0.4)`, borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                          Saving...
                        </>
                      ) : company.isVerified ? (
                        <><XCircle size={14} /> Unverify</>
                      ) : (
                        <><ShieldCheck size={14} /> Verify</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </div>
  );
}