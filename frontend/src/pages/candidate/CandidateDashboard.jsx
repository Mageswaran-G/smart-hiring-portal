// CandidateDashboard
// Orange theme — #ea580c / #c2410c
// Self-contained: includes inline ProgressRing + Sparkline (no external chart imports needed)
// Fully responsive: desktop grid layout + mobile stacked layout with bottom tab bar

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard, Briefcase, Bookmark, FileText, User,
  LogOut, ChevronRight, MapPin, Building2, Search, Award,
  Star, CheckCircle, ArrowRight, Clock, XCircle, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../services/applicationService';
import { getSavedJobIds } from '../../services/savedJobService';
import { getAllJobs } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';
import SafeAvatar from '../../components/ui/SafeAvatar';
import { calcProfileStrength } from '../../utils/profileStrength';
import CandidateAIWidget from '../../components/ai/CandidateAIWidget';

// ─── Brand Colors ────────────────────────────────────────────
const C = {
  primary : '#ea580c',
  dark    : '#c2410c',
  light   : '#fff7ed',
  border  : '#fed7aa',
  grad    : 'linear-gradient(135deg, #9a3412 0%, #c2410c 30%, #ea580c 65%, #f97316 100%)',
  white   : '#ffffff',
  gray50  : '#f9fafb',
  gray100 : '#f3f4f6',
  gray200 : '#e5e7eb',
  gray300 : '#d1d5db',
  gray400 : '#9ca3af',
  gray500 : '#6b7280',
  gray600 : '#4b5563',
  gray700 : '#374151',
  gray800 : '#1f2937',
  gray900 : '#111827',
};

// ─── Application status config ───────────────────────────────
const STATUS = {
  applied     : { label: 'Applied',      color: '#92400e', bg: '#fef3c7' },
  reviewing   : { label: 'Reviewing',    color: '#1e40af', bg: '#dbeafe' },
  shortlisted : { label: 'Shortlisted',  color: '#5b21b6', bg: '#ede9fe' },
  rejected    : { label: 'Rejected',     color: '#991b1b', bg: '#fee2e2' },
  hired       : { label: 'Hired',        color: '#065f46', bg: '#d1fae5' },
};

// ─── Helper: time ago ────────────────────────────────────────
function timeAgo(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 30)  return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

// ─── Helper: profile completion ──────────────────────────────
function calcCompletion(profile) {
  if (!profile) return 0;
  const fields = [
    profile.name, profile.headline, profile.bio, profile.photo,
    profile.phone, profile.skills?.length, profile.resumeUrl,
    profile.linkedin, profile.education?.length, profile.workHistory?.length,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

// ─── Inline ProgressRing ─────────────────────────────────────
function ProgressRing({ value = 0, size = 80, stroke = 8, color = C.primary, bg = 'rgba(255,255,255,0.22)', textColor = '#fff' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize: size * 0.21, fontWeight: 800, color: textColor, lineHeight: 1 }}>{value}%</span>
        <span style={{ fontSize: size * 0.13, color: textColor, opacity: 0.7, lineHeight: 1, marginTop: 1 }}>done</span>
      </div>
    </div>
  );
}

// ─── Inline Sparkline ────────────────────────────────────────
function Sparkline({ data = [], color = C.primary, w = 90, h = 36, id = 'c' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: +((i / (data.length - 1)) * w).toFixed(2),
    y: +((h - 4) - ((v - min) / range) * (h - 8)).toFixed(2),
  }));
  const line = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const gId  = `sg-cand-${id}`;
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

// ─── Mobile Bottom Tab Bar (defined OUTSIDE main component) ──
const MOB_TABS = [
  { key:'overview', label:'Home',     Icon: LayoutDashboard },
  { key:'jobs',     label:'Jobs',     Icon: Briefcase },
  { key:'saved',    label:'Saved',    Icon: Bookmark },
  { key:'apps',     label:'Applied',  Icon: FileText },
  { key:'profile',  label:'Profile',  Icon: User },
];

function MTabBar({ active, onTab, savedCount, appCount }) {
  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:60,
      background:'rgba(255,255,255,0.97)', backdropFilter:'blur(14px)',
      borderTop:`1px solid ${C.gray200}`,
      display:'flex', paddingBottom:'env(safe-area-inset-bottom)',
    }}>
      {MOB_TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        const badge = key === 'saved' ? savedCount : key === 'apps' ? appCount : 0;
        return (
          <button key={key} onClick={() => onTab(key)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:2, padding:'10px 4px 6px',
            background:'none', border:'none', cursor:'pointer',
            color: isActive ? C.primary : C.gray400,
            position:'relative', transition:'color 0.15s',
          }}>
            {isActive && (
              <span style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:3, background:C.primary, borderRadius:'0 0 3px 3px' }} />
            )}
            <div style={{ position:'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {badge > 0 && (
                <span style={{ position:'absolute', top:-5, right:-7, background:C.primary, color:'#fff', fontSize:9, fontWeight:700, borderRadius:9999, minWidth:14, height:14, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px' }}>
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            <span style={{ fontSize:10, fontWeight: isActive ? 700 : 400, lineHeight:1 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Loading Spinner ─────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:C.gray50, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.primary, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:C.gray400, fontSize:14 }}>Loading dashboard…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Avatar helper ───────────────────────────────────────────
function Avatar({ profile, size = 44, border = '2px solid rgba(255,255,255,0.4)' }) {
  return (
    <SafeAvatar
      onClick={() => navigate(ROUTES.PROFILE)} src={profile?.photo}
      name={profile?.name || 'U'}
      alt="avatar"
      style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border, flexShrink:0 }}
      fallbackStyle={{ width:size, height:size, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:size*0.38, border, flexShrink:0 }}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function CandidateDashboard() {
  const navigate   = useNavigate();
  const { profile, logoutUser } = useAuth();
  const isMobile   = useIsMobile();

  const [activeTab,     setActiveTab]     = useState('overview');
  const [applications,  setApplications]  = useState([]);
  const [savedCount,    setSavedCount]    = useState(0);
  const [jobs,          setJobs]          = useState([]);
  const [loading,       setLoading]       = useState(true);

  const fetchedRef = useRef(false);   // ← prevents double-fetch in development

  // ── Fetch all data on mount ──
  useEffect(() => {
    if (fetchedRef.current) return;   // ← skip if already fetched
    fetchedRef.current = true;
    (async () => {
      try {
        const [apps, savedIds, jobsRes] = await Promise.all([
          getMyApplications(),
          getSavedJobIds(),
          getAllJobs({ limit: 4 }),
        ]);
        setApplications(Array.isArray(apps) ? apps : []);
        setSavedCount(Array.isArray(savedIds) ? savedIds.length : 0);
        const jArr = Array.isArray(jobsRes) ? jobsRes : (jobsRes?.jobs || jobsRes?.data || []);
        setJobs(jArr);
      } catch (err) {
        console.error('CandidateDashboard load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Tab navigation handler ──
  const handleTab = (key) => {
    if (key === 'jobs')    { navigate(ROUTES.PUBLIC_JOBS);            return; }
    if (key === 'saved')   { navigate(ROUTES.SAVED_JOBS);             return; }
    if (key === 'apps')    { navigate(ROUTES.CANDIDATE_APPLICATIONS); return; }
    if (key === 'profile') { navigate(ROUTES.PROFILE);                return; }
    setActiveTab(key);
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate(ROUTES.LOGIN);
  };

  // ── Derived stats ──
  const completion = calcProfileStrength(profile);
  const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
  const hired       = applications.filter(a => a.status === 'hired').length;

  // 7-point sparkline trend (last is actual value)
  const appTrend    = [2, 3, 2, 5, 4, 5, applications.length];
  const savedTrend  = [1, 2, 2, 3, 3, 4, savedCount];
  const shortTrend  = [0, 0, 1, 1, 1, 2, shortlisted];
  const hiredTrend  = [0, 0, 0, 0, 0, 0, hired];

  if (loading) return <LoadingScreen />;

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
              <Briefcase size={16} color="#fff" />
            </div>
            <span style={{ fontWeight:900, fontSize:17, color:C.gray900, letterSpacing:'-0.3px' }}>HirePortal</span><span style={{ background:`${C.primary}15`, color:C.primary, fontSize:9, fontWeight:800, borderRadius:5, padding:'2px 6px', letterSpacing:'0.5px', border:`1px solid ${C.primary}25` }}>CANDIDATE</span>
          </div>
          <SafeAvatar
            onClick={() => navigate(ROUTES.PROFILE)} src={profile?.photo}
            name={profile?.name || 'U'}
            style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.primary}`, cursor:'pointer' }}
            fallbackStyle={{ width:34, height:34, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}
          />
        </header>

        {/* ── Mobile Hero ── */}
        <section style={{ background:'linear-gradient(135deg, #7c1d06 0%, #c2410c 35%, #ea580c 65%, #f97316 85%, #fbbf24 100%)', padding:'28px 20px 36px', position:'relative', overflow:'hidden', borderRadius:20, margin:'12px 12px 0' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} /><div style={{ position:'absolute', bottom:-30, left:20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} /><div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
            <Avatar profile={profile} size={62} border="3px solid rgba(255,255,255,0.5)" />
            <div style={{ minWidth:0 }}>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:12, margin:'0 0 3px', fontWeight:500, letterSpacing:'0.1px' }}>Welcome back</p>
              <h1 style={{ color:'#fff', fontWeight:900, fontSize:22, margin:'0 0 4px', lineHeight:1.08, letterSpacing:'-0.5px' }}>
                {profile?.name || 'Candidate'}
              </h1>
              {profile?.headline && (
                <p style={{ color:'rgba(255,255,255,0.82)', fontSize:12, margin:0, lineHeight:1.35, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:210 }}>
                  {profile.headline}
                </p>
              )}
            </div>
          </div>

          {/* Profile completion card */}
          <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:18, padding:'16px 18px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.13)', boxShadow:'0 4px 16px rgba(0,0,0,0.12)' }}>
            <ProgressRing value={completion} size={70} stroke={7} />
            <div style={{ flex:1 }}>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:11, margin:'0 0 4px', letterSpacing:'0.1px' }}>Profile Strength</p>
              <p style={{ color:'#fff', fontWeight:700, fontSize:13, margin:'0 0 10px', lineHeight:1.3 }}>
                {completion < 40 ? 'Just starting — add more!' : completion < 70 ? 'Good progress!' : completion < 90 ? 'Almost complete!' : 'Excellent profile!'}
              </p>
              <button onClick={() => navigate(ROUTES.PROFILE)} style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:9, color:'#fff', fontSize:11, fontWeight:700, padding:'6px 14px', cursor:'pointer' }}>
                Complete Profile
              </button>
            </div>
          </div>
        </section>

        {/* ── Mobile Stats 2×2 ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Applied',     value:applications.length, color:C.primary,  icon:FileText, trend:appTrend,   id:'a' },
              { label:'Saved',       value:savedCount,           color:'#8b5cf6',  icon:Bookmark, trend:savedTrend, id:'s' },
              { label:'Shortlisted', value:shortlisted,          color:'#0891b2',  icon:Star,     trend:shortTrend, id:'sh' },
              { label:'Hired',       value:hired,                color:'#059669',  icon:Award,    trend:hiredTrend, id:'h' },
            ].map(({ label, value, color, icon:Icon, trend, id }) => (
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

        {/* ── Mobile Quick Actions 2×2 ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:'0 0 10px' }}>Quick Actions</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Browse Jobs',   icon:Search,   route:ROUTES.PUBLIC_JOBS,            color:C.primary  },
              { label:'My Profile',    icon:User,      route:ROUTES.PROFILE,                color:'#8b5cf6'  },
              { label:'Saved Jobs',    icon:Bookmark,  route:ROUTES.SAVED_JOBS,             color:'#0891b2'  },
              { label:'Applications',  icon:FileText,  route:ROUTES.CANDIDATE_APPLICATIONS, color:'#059669'  },
            ].map(({ label, icon:Icon, route, color }) => (
              <button key={label} onClick={() => navigate(route)} style={{ background:'#fff', border:`1px solid ${C.gray100}`, borderRadius:14, padding:'14px 12px', display:'flex', alignItems:'center', gap:10, cursor:'pointer', textAlign:'left', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ width:38, height:38, borderRadius:11, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={18} color={color} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:C.gray800, lineHeight:1.3 }}>{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Mobile Recent Applications ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:0 }}>Recent Applications</p>
            <button onClick={() => navigate(ROUTES.CANDIDATE_APPLICATIONS)} style={{ display:'flex', alignItems:'center', gap:2, background:'none', border:'none', color:C.primary, fontSize:12, fontWeight:700, cursor:'pointer' }}>
              View all <ChevronRight size={12} />
            </button>
          </div>

          {applications.length === 0 ? (
            <div style={{ background:'#fff', borderRadius:14, padding:'24px 16px', textAlign:'center', border:`1px solid ${C.gray100}` }}>
              <div style={{ width:48, height:48, borderRadius:12, background:C.light, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
                <FileText size={22} color={C.border} />
              </div>
              <p style={{ color:C.gray500, fontSize:13, margin:'0 0 12px', lineHeight:1.4 }}>No applications yet.<br/>Start applying to jobs!</p>
              <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:9, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                Browse Jobs
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {applications.slice(0, 5).map(app => {
                const s = STATUS[app.status] || STATUS.applied;
                return (
                  <div key={app._id} style={{ background:'#fff', borderRadius:14, padding:'13px 14px', border:`1px solid ${C.gray100}`, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:700, fontSize:13, color:C.gray900, margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {app.job?.title || 'Untitled Job'}
                        </p>
                        <p style={{ fontSize:11, color:C.gray400, margin:0, display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
                          <span style={{ display:'flex', alignItems:'center', gap:3 }}>
                            <Building2 size={10} />
                            {app.job?.postedBy?.companyName || '—'}
                          </span>
                          {app.job?.location && (
                            <span style={{ display:'flex', alignItems:'center', gap:3 }}>
                              <MapPin size={10} />
                              {app.job.location}
                            </span>
                          )}
                        </p>
                      </div>
                      <span style={{ background:s.bg, color:s.color, fontSize:10, fontWeight:700, borderRadius:7, padding:'4px 8px', flexShrink:0 }}>
                        {s.label}
                      </span>
                    </div>
                    <p style={{ fontSize:10, color:C.gray300, margin:'7px 0 0', fontWeight:500 }}>{timeAgo(app.createdAt)}</p>
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

        {/* ── Mobile Bottom Tab Bar ── */}
        <MTabBar active={activeTab} onTab={handleTab} savedCount={savedCount} appCount={applications.length} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT — wrapped in DashboardLayout for sidebar nav
  // Sidebar provides: logo, user info, nav links, logout
  // Header here provides: quick tab navigation only
  // ════════════════════════════════════════════════════════════
  return (
    <DashboardLayout>
    <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>

      {/* ── Desktop Hero ── */}
      <section style={{ background:'linear-gradient(135deg, #7c1d06 0%, #c2410c 35%, #ea580c 65%, #f97316 85%, #fbbf24 100%)', padding:'64px 56px 76px', position:'relative', overflow:'hidden', borderRadius:24, margin:'0 16px' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} /><div style={{ position:'absolute', bottom:-60, left:60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} /><div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.2) 0%, transparent 40%), radial-gradient(ellipse at 60% 80%, rgba(255,255,255,0.08) 0%, transparent 40%)', pointerEvents:'none' }} /><div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:52 }}>

          {/* Left: Avatar + Identity */}
          <div style={{ display:'flex', alignItems:'center', gap:28 }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <Avatar profile={profile} size={100} border="3px solid rgba(255,255,255,0.55)" />
              {profile?.openToWork && (
                <span style={{ position:'absolute', bottom:2, right:2, background:'#22c55e', color:'#fff', fontSize:9, fontWeight:800, borderRadius:9999, padding:'3px 7px', border:'2px solid #fff', letterSpacing:'0.3px' }}>OPEN</span>
              )}
            </div>
            <div>
              <p style={{ color:'rgba(255,255,255,0.72)', fontSize:14, margin:'0 0 8px', fontWeight:500, letterSpacing:'0.1px' }}>Good to see you,</p>
              <h1 style={{ color:'#fff', fontWeight:900, fontSize:36, margin:'0 0 8px', lineHeight:1.08, letterSpacing:'-1px' }}>
                {profile?.name || 'Candidate'}
              </h1>
              {profile?.headline && (
                <p style={{ color:'rgba(255,255,255,0.85)', fontSize:16, margin:'0 0 16px', lineHeight:1.45 }}>
                  {profile.headline}
                </p>
              )}
              {profile?.skills?.length > 0 && (
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {profile.skills.slice(0, 5).map((sk, i) => {
                    const label = typeof sk === 'string' ? sk : (sk?.name || sk?.skill || '');
                    if (!label) return null;
                    return (
                      <span key={i} style={{ background:'rgba(255,255,255,0.18)', color:'#fff', fontSize:12, fontWeight:600, borderRadius:9999, padding:'5px 13px', border:'1px solid rgba(255,255,255,0.22)' }}>{label}</span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Completion + Browse CTA */}
          <div style={{ display:'flex', alignItems:'center', gap:32, flexShrink:0 }}>
            {/* Profile Completion Panel */}
            <div style={{ background:'rgba(0,0,0,0.22)', borderRadius:28, padding:'28px 34px', display:'flex', alignItems:'center', gap:26, backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.13)', boxShadow:'0 8px 32px rgba(0,0,0,0.18)' }}>
              <ProgressRing value={completion} size={96} stroke={9} />
              <div>
                <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, margin:'0 0 6px', fontWeight:500, letterSpacing:'0.2px' }}>Profile Strength</p>
                <p style={{ color:'#fff', fontWeight:800, fontSize:18, margin:'0 0 18px', letterSpacing:'-0.3px' }}>
                  {completion < 40 ? 'Build your profile' : completion < 70 ? 'Keep going!' : completion < 90 ? 'Almost done!' : 'Outstanding!'}
                </p>
                <button onClick={() => navigate(ROUTES.PROFILE)} style={{ background:'rgba(255,255,255,0.9)', color:C.dark, border:'none', borderRadius:12, padding:'11px 22px', fontWeight:800, fontSize:13, cursor:'pointer', letterSpacing:'-0.1px' }}>
                  Complete Profile →
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ background:'#fff', color:C.primary, border:'none', borderRadius:18, padding:'18px 32px', fontWeight:900, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', gap:11, boxShadow:'0 8px 28px rgba(0,0,0,0.2)', letterSpacing:'-0.3px', flexShrink:0 }}>
              <Search size={20} />
              Browse Jobs
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Desktop Stats Row ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'26px 32px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[
            { label:'Total Applied',  value:applications.length, sub:'jobs applied',   Icon:FileText, color:C.primary,  trend:appTrend,   id:'a' },
            { label:'Jobs Saved',     value:savedCount,           sub:'bookmarked',     Icon:Bookmark, color:'#8b5cf6',  trend:savedTrend, id:'s' },
            { label:'Shortlisted',    value:shortlisted,          sub:'by companies',   Icon:Star,     color:'#0891b2',  trend:shortTrend, id:'sh' },
            { label:'Hired',          value:hired,                sub:'offer received', Icon:Award,    color:'#059669',  trend:hiredTrend, id:'h' },
          ].map(({ label, value, sub, Icon, color, trend, id }) => (
            <div key={label} style={{ background:'#fff', borderRadius:18, padding:'22px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <p style={{ fontSize:12, color:C.gray400, margin:'0 0 5px', fontWeight:600, letterSpacing:'0.2px' }}>{label}</p>
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
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'22px 32px 48px', display:'grid', gridTemplateColumns:'1fr 360px', gap:22 }}>

        {/* ── Left Column ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Quick Actions */}
          <div style={{ background:'#fff', borderRadius:20, padding:'26px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900, margin:'0 0 18px', letterSpacing:'-0.3px' }}>Quick Actions</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {[
                { label:'Browse Jobs',   desc:`Find new roles`,          Icon:Search,   route:ROUTES.PUBLIC_JOBS,            color:C.primary  },
                { label:'Saved Jobs',    desc:`${savedCount} saved`,     Icon:Bookmark, route:ROUTES.SAVED_JOBS,             color:'#8b5cf6'  },
                { label:'Applications',  desc:`${applications.length} total`, Icon:FileText, route:ROUTES.CANDIDATE_APPLICATIONS, color:'#0891b2'  },
                { label:'My Profile',    desc:`${completion}% complete`, Icon:User,     route:ROUTES.PROFILE,                color:'#059669'  },
              ].map(({ label, desc, Icon, route, color }) => (
                <button key={label} onClick={() => navigate(route)} style={{ background:`${color}08`, border:`1px solid ${color}22`, borderRadius:16, padding:'18px 14px', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:10, cursor:'pointer', textAlign:'left', transition:'box-shadow 0.15s, border-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 4px 16px ${color}22`; e.currentTarget.style.borderColor=`${color}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=`${color}22`; }}
                >
                  <div style={{ width:42, height:42, borderRadius:12, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:800, color:C.gray900, margin:'0 0 2px' }}>{label}</p>
                    <p style={{ fontSize:11, color:C.gray400, margin:0 }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div style={{ background:'#fff', borderRadius:20, padding:'26px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}`, flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900, margin:0, letterSpacing:'-0.3px' }}>Recent Applications</h2>
              <button onClick={() => navigate(ROUTES.CANDIDATE_APPLICATIONS)} style={{ display:'flex', alignItems:'center', gap:4, color:C.primary, fontSize:13, fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
                View all <ChevronRight size={14} />
              </button>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ width:60, height:60, borderRadius:16, background:C.light, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <FileText size={28} color={C.border} />
                </div>
                <p style={{ color:C.gray500, fontSize:15, margin:'0 0 5px', fontWeight:600 }}>No applications yet</p>
                <p style={{ color:C.gray400, fontSize:13, margin:'0 0 18px' }}>Apply to jobs and track your progress here</p>
                <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'11px 22px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div>
                {/* Table header */}
                <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr 1.5fr 1fr', gap:12, padding:'0 12px 10px', borderBottom:`1px solid ${C.gray100}` }}>
                  {['Job Title','Company','Status','Applied'].map(h => (
                    <span key={h} style={{ fontSize:11, fontWeight:700, color:C.gray400, letterSpacing:'0.4px', textTransform:'uppercase' }}>{h}</span>
                  ))}
                </div>
                {applications.slice(0, 7).map((app, idx) => {
                  const s = STATUS[app.status] || STATUS.applied;
                  return (
                    <div key={app._id} style={{ display:'grid', gridTemplateColumns:'3fr 2fr 1.5fr 1fr', gap:12, padding:'13px 12px', borderRadius:12, background: idx%2===0 ? 'transparent' : C.gray50, alignItems:'center' }}>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontWeight:700, fontSize:13, color:C.gray900, margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.job?.title || 'Untitled'}</p>
                        {app.job?.location && <p style={{ fontSize:11, color:C.gray400, margin:0, display:'flex', alignItems:'center', gap:3 }}><MapPin size={10} />{app.job.location}</p>}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:`${C.primary}14`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, fontSize:11, color:C.primary }}>
                          {(app.job?.postedBy?.companyName||'J')[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize:12, color:C.gray600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {app.job?.postedBy?.companyName || '—'}
                        </span>
                      </div>
                      <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700, borderRadius:8, padding:'4px 10px', display:'inline-block' }}>{s.label}</span>
                      <span style={{ fontSize:11, color:C.gray400 }}>{timeAgo(app.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          {/* Profile Strength Card */}
          <div style={{ background:C.grad, borderRadius:22, padding:'24px', boxShadow:'0 6px 28px rgba(194,65,12,0.28)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ color:'#fff', fontWeight:900, fontSize:16, margin:0, letterSpacing:'-0.3px' }}>Profile Strength</h3>
              <ProgressRing value={completion} size={64} stroke={6} />
            </div>
            {/* Checklist */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { label:'Photo uploaded',    done:!!profile?.photo,             points: 10 },
                { label:'Headline added',    done:!!profile?.headline,          points: 10 },
                { label:'Skills listed',     done:!!profile?.skills?.length,    points: 15 },
                { label:'Resume uploaded',   done:!!profile?.resumeUrl,         points: 20 },
                { label:'Bio written',       done:!!profile?.bio,               points: 10 },
                { label:'Education added',   done:!!profile?.education?.length, points: 10 },
              ].map(({ label, done, points }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {done ? <CheckCircle size={11} color={C.primary} /> : <Clock size={10} color="rgba(255,255,255,0.5)" />}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flex:1 }}>
                    <span style={{ fontSize:12, color: done ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)', textDecoration: done ? 'line-through' : 'none', fontWeight: done ? 400 : 500 }}>
                      {label}
                    </span>
                    {!done && (
                      <span style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.7)', background:'rgba(255,255,255,0.15)', padding:'1px 6px', borderRadius:6 }}>
                        +{points}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate(ROUTES.PROFILE)} style={{ marginTop:18, width:'100%', background:'rgba(255,255,255,0.16)', border:'1px solid rgba(255,255,255,0.28)', borderRadius:12, color:'#fff', fontWeight:800, fontSize:13, padding:'11px', cursor:'pointer' }}>
              Improve Profile →
            </button>
          </div>
              {/* AI Insights Widget */}
              <CandidateAIWidget profile={profile} />
          {/* Recommended Jobs */}
          <div style={{ background:'#fff', borderRadius:20, padding:'22px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}`, flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:C.gray900, margin:0, letterSpacing:'-0.2px' }}>Recommended Jobs</h3>
              <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ color:C.primary, fontSize:12, fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>See all</button>
            </div>
            {jobs.length === 0 ? (
              <p style={{ color:C.gray400, fontSize:13, textAlign:'center', padding:'20px 0' }}>No jobs found</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {jobs.slice(0, 5).map(job => (
                  <div key={job._id} onClick={() => navigate(`/jobs/${job.slug || job._id}`)}
                    style={{ padding:'13px 14px', borderRadius:14, border:`1px solid ${C.gray100}`, cursor:'pointer', transition:'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.light; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=C.gray100; e.currentTarget.style.background='transparent'; }}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                      <p style={{ fontWeight:700, fontSize:13, color:C.gray900, margin:'0 0 2px', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {job.title}
                      </p>
                      <span style={{ background:`${C.primary}12`, color:C.primary, fontSize:10, fontWeight:700, borderRadius:7, padding:'3px 8px', flexShrink:0 }}>
                        {job.jobType}
                      </span>
                    </div>
                    <p style={{ fontSize:11, color:C.gray400, margin:'2px 0 0' }}>
                      {job.postedBy?.companyName || '—'}
                      {job.location && ` · ${job.location}`}
                    </p>
                    {job.postedBy?.isVerified && (
                      <p style={{ fontSize:10, color:'#2563eb', fontWeight:700, margin:'4px 0 0', display:'flex', alignItems:'center', gap:3 }}>
                        <CheckCircle size={10} /> Verified Company
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
}