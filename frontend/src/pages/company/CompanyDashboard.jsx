// CompanyDashboard
// Navy theme — #1e3a5f / #152d4a
// Self-contained: inline ProgressRing, Sparkline, MiniBarChart
// Fully responsive: desktop grid layout + mobile stacked + bottom tab bar

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard, Briefcase, Users, PlusCircle, User,
  LogOut, ChevronRight, Building2, MapPin, CheckCircle,
  Star, ArrowRight, TrendingUp, Eye, FileText, Clock,
  BarChart3, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCompanyDashboardStats, getMyJobs } from '../../services/jobService';
import { getCompanyApplications, updateApplicationStatus } from '../../services/applicationService';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';

// ─── Brand Colors ────────────────────────────────────────────
const C = {
  primary  : '#1e3a5f',
  mid      : '#1e40af',
  dark     : '#152d4a',
  accent   : '#3b82f6',
  light    : '#eff6ff',
  border   : '#bfdbfe',
  grad     : 'linear-gradient(135deg, #0a1628 0%, #152d4a 30%, #1e3a5f 60%, #1e40af 100%)',
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

// ─── Application status config ───────────────────────────────
const STATUS = {
  applied     : { label:'Applied',     color:'#92400e', bg:'#fef3c7' },
  reviewing   : { label:'Reviewing',   color:'#1e40af', bg:'#dbeafe' },
  shortlisted : { label:'Shortlisted', color:'#5b21b6', bg:'#ede9fe' },
  rejected    : { label:'Rejected',    color:'#991b1b', bg:'#fee2e2' },
  hired       : { label:'Hired',       color:'#065f46', bg:'#d1fae5' },
};

const STATUS_OPTIONS = ['reviewing','shortlisted','hired','rejected'];

// ─── Helper: time ago ────────────────────────────────────────
function timeAgo(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 30)  return `${d}d ago`;
  return `${Math.floor(d/30)}mo ago`;
}

// ─── Inline ProgressRing ─────────────────────────────────────
function ProgressRing({ value = 0, size = 80, stroke = 8, color = C.accent, bg = 'rgba(255,255,255,0.18)', textColor = '#fff' }) {
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
        <span style={{ fontSize:size*0.13, color:textColor, opacity:0.7, lineHeight:1, marginTop:1 }}>hired</span>
      </div>
    </div>
  );
}

// ─── Inline Sparkline ────────────────────────────────────────
function Sparkline({ data = [], color = C.accent, w = 100, h = 38, id = 'co' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: +((i / (data.length - 1)) * w).toFixed(2),
    y: +((h - 4) - ((v - min) / range) * (h - 8)).toFixed(2),
  }));
  const line = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const gId  = `sg-comp-${id}`;
  return (
    <svg width={w} height={h} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="2.5" fill={color} />
    </svg>
  );
}

// ─── Inline Mini Bar Chart ───────────────────────────────────
function MiniBarChart({ data = [], color = C.accent, w = 100, h = 44 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const gap = 3;
  const bw  = (w - (data.length - 1) * gap) / data.length;
  return (
    <svg width={w} height={h} style={{ display:'block' }}>
      {data.map((v, i) => {
        const bh = Math.max(3, (v / max) * (h - 4));
        return (
          <rect key={i} x={i*(bw+gap)} y={h-bh} width={bw} height={bh}
            rx={3} fill={color} opacity={i===data.length-1 ? 1 : 0.3+(v/max)*0.5} />
        );
      })}
    </svg>
  );
}

// ─── Mobile Bottom Tab Bar ───────────────────────────────────
const MOB_TABS = [
  { key:'overview', label:'Home',     Icon:LayoutDashboard },
  { key:'jobs',     label:'My Jobs',  Icon:Briefcase },
  { key:'post',     label:'Post Job', Icon:PlusCircle },
  { key:'apps',     label:'Applicants', Icon:Users },
  { key:'profile',  label:'Profile',  Icon:User },
];

function MTabBar({ active, onTab, jobCount, appCount }) {
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:60, background:'rgba(255,255,255,0.97)', backdropFilter:'blur(14px)', borderTop:`1px solid ${C.gray200}`, display:'flex', paddingBottom:'env(safe-area-inset-bottom)' }}>
      {MOB_TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        const badge = key==='jobs' ? jobCount : key==='apps' ? appCount : 0;
        return (
          <button key={key} onClick={() => onTab(key)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, padding:'10px 4px 6px', background:'none', border:'none', cursor:'pointer', color: isActive ? C.primary : C.gray400, position:'relative', transition:'color 0.15s' }}>
            {isActive && <span style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:3, background:C.primary, borderRadius:'0 0 3px 3px' }} />}
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

// ─── Loading Screen ──────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:C.gray50, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTopColor:C.primary, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ color:C.gray400, fontSize:14 }}>Loading dashboard…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Avatar Helper ───────────────────────────────────────────
function CompanyAvatar({ profile, size = 60, border = '3px solid rgba(255,255,255,0.4)' }) {
  if (profile?.photo) {
    return <img src={profile.photo} alt="" style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border, flexShrink:0 }} />;
  }
  const letter = (profile?.companyName || profile?.name || 'C')[0].toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:16, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:size*0.38, border, flexShrink:0, letterSpacing:'-1px' }}>
      {letter}
    </div>
  );
}

// ─── Status Dropdown ─────────────────────────────────────────
function StatusDropdown({ appId, current, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const s = STATUS[current] || STATUS.applied;

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === current) return;
    setLoading(true);
    try {
      await updateApplicationStatus(appId, newStatus);
      onUpdate(appId, newStatus);
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select value={current} onChange={handleChange} disabled={loading}
      style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700, border:'none', borderRadius:8, padding:'4px 8px', cursor:'pointer', outline:'none', opacity: loading ? 0.6 : 1 }}>
      <option value="applied">Applied</option>
      {STATUS_OPTIONS.map(st => (
        <option key={st} value={st}>{STATUS[st].label}</option>
      ))}
    </select>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { profile, logoutUser } = useAuth();
  const isMobile = useIsMobile();

  const [activeTab,    setActiveTab]    = useState('overview');
  const [stats,        setStats]        = useState({ total:0, applications:0, shortlisted:0, hired:0, activeCount:0, reviewing:0 });
  const [applications, setApplications] = useState([]);
  const [jobs,         setJobs]         = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsData, appsData, jobsData] = await Promise.all([
          getCompanyDashboardStats(),
          getCompanyApplications(),
          getMyJobs(),
        ]);

        // Backend returns: totalJobs, activeJobs, totalApps, shortlisted, hired
        // Dashboard reads: total,     activeCount, applications, shortlisted, hired
        // Map them correctly here so hero and stats show real numbers
        const raw = statsData || {};
        setStats({
          total:        raw.totalJobs   || 0,
          activeCount:  raw.activeJobs  || 0,
          applications: raw.totalApps   || 0,
          reviewing:    raw.reviewing   || 0, 
          shortlisted:  raw.shortlisted || 0,
          hired:        raw.hired       || 0,
        });
        setApplications(Array.isArray(appsData) ? appsData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error('CompanyDashboard load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleTab = (key) => {
    if (key === 'jobs')    { navigate(ROUTES.COMPANY_JOBS);         return; }
    if (key === 'post')    { navigate(ROUTES.COMPANY_JOB_CREATE);   return; }
    if (key === 'apps')    { navigate(ROUTES.COMPANY_APPLICATIONS); return; }
    if (key === 'profile') { navigate(ROUTES.PROFILE);              return; }
    setActiveTab(key);
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate(ROUTES.LOGIN);
  };

  const handleStatusUpdate = (appId, newStatus) => {
    setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
  };

  // Derived
  const hireRate = stats.applications > 0 ? Math.round((stats.hired / stats.applications) * 100) : 0;
  // Top performing job = job with most applications
  const topJob = jobs.length > 0
    ? jobs.reduce((best, job) =>
        (job.applicationsCount || 0) > (best.applicationsCount || 0) ? job : best,
        jobs[0]
      )
    : null;
  // Recent activity from real applications
  const recentActivity = applications.slice(0, 5).map(app => ({
    text: `${app.candidate?.name || 'Someone'} applied for ${app.job?.title || 'a job'}`,
    time: timeAgo(app.createdAt),
    color: STATUS[app.status]?.color || '#9ca3af',
    status: app.status,
  }));  
  const appTrend  = [3, 5, 4, 8, 7, 9, stats.applications || 0];
  const jobTrend  = [1, 1, 2, 2, 3, 3, stats.total || 0];
  const shortTrend = [0, 1, 1, 2, 3, 3, stats.shortlisted || 0];
  const hireTrend  = [0, 0, 0, 1, 1, 1, stats.hired || 0];

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
              <Building2 size={16} color="#fff" />
            </div>
            <span style={{ fontWeight:900, fontSize:17, color:C.gray900, letterSpacing:'-0.3px' }}>HirePortal</span>
          </div>
          <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:8, padding:'7px 13px', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
            <PlusCircle size={14} /> Post Job
          </button>
        </header>

        {/* ── Mobile Hero ── */}
        <section style={{ background:C.grad, padding:'28px 16px 36px', borderRadius:'0 0 32px 32px', position:'relative', overflow:'hidden' }}>
          {/* dot texture */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize:'20px 20px', pointerEvents:'none' }} />
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <CompanyAvatar profile={profile} size={60} />
              <div style={{ minWidth:0 }}>
                <p style={{ color:'rgba(255,255,255,0.72)', fontSize:11, margin:'0 0 2px', fontWeight:500 }}>Welcome back,</p>
                <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:'0 0 3px', lineHeight:1.1, letterSpacing:'-0.4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {profile?.companyName || profile?.name || 'Company'}
                </h1>
                {profile?.email && (
                  <p style={{ color:'rgba(255,255,255,0.65)', fontSize:11, margin:'2px 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {profile.email}
                  </p>
                )}
                {profile?.industry && (
                  <span style={{ background:'rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.9)', fontSize:10, fontWeight:700, borderRadius:9999, padding:'2px 9px' }}>
                    {profile.industry}
                  </span>
                )}
              </div>
            </div>

            {/* Quick stat pills */}
            <div style={{ display:'flex', gap:8 }}>
              {[
                { label:`${stats.total||0} Jobs`,     bg:'rgba(255,255,255,0.2)' },
                { label:`${stats.applications||0} Applications`, bg:'rgba(255,255,255,0.14)' },
                { label:`${stats.hired||0} Hired`,    bg:'rgba(59,130,246,0.35)' },
              ].map(({ label, bg }) => (
                <span key={label} style={{ background:bg, color:'#fff', fontSize:11, fontWeight:700, borderRadius:9999, padding:'4px 11px', border:'1px solid rgba(255,255,255,0.18)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mobile Stats 2×2 ── */}
        <section style={{ padding:'20px 14px 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Total Jobs',    value:stats.total||0,        color:C.primary, Icon:Briefcase, trend:jobTrend,  id:'j' },
              { label:'Applications',  value:stats.applications||0, color:'#8b5cf6', Icon:FileText,  trend:appTrend,  id:'a' },
              { label:'Shortlisted',   value:stats.shortlisted||0,  color:'#0891b2', Icon:Star,      trend:shortTrend,id:'sh' },
              { label:'Hired',         value:stats.hired||0,        color:'#059669', Icon:CheckCircle,trend:hireTrend, id:'h' },
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

        {/* ── Mobile Quick Actions ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:'0 0 10px' }}>Quick Actions</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { label:'Post New Job',      desc:'Create a job listing',       Icon:PlusCircle, route:ROUTES.COMPANY_JOB_CREATE,   color:C.primary },
              { label:'Manage Jobs',       desc:`${jobs.length} total jobs`,   Icon:Briefcase,  route:ROUTES.COMPANY_JOBS,         color:'#8b5cf6' },
              { label:'View Applicants',   desc:`${applications.length} applicants`, Icon:Users, route:ROUTES.COMPANY_APPLICATIONS, color:'#0891b2' },
              { label:'Company Profile',   desc:'Update company info',         Icon:User,       route:ROUTES.PROFILE,              color:'#059669' },
            ].map(({ label, desc, Icon, route, color }) => (
              <button key={label} onClick={() => navigate(route)} style={{ background:'#fff', border:`1px solid ${C.gray100}`, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, cursor:'pointer', textAlign:'left', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                
                <div style={{ width:42, height:42, borderRadius:12, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={20} color={color} />
                </div>

                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.gray900, margin:'0 0 1px' }}>{label}</p>
                  <p style={{ fontSize:11, color:C.gray400, margin:0 }}>{desc}</p>
                </div>
                <ChevronRight size={16} color={C.gray300} style={{ marginLeft:'auto' }} />
              </button>
            ))}
          </div>
        </section>

        {/* ── Mobile Recent Applicants ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:0 }}>Recent Applicants</p>
            <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ display:'flex', alignItems:'center', gap:2, background:'none', border:'none', color:C.accent, fontSize:12, fontWeight:700, cursor:'pointer' }}>
              View all <ChevronRight size={12} />
            </button>
          </div>

          {applications.length === 0 ? (
            <div style={{ background:'#fff', borderRadius:14, padding:'24px 16px', textAlign:'center', border:`1px solid ${C.gray100}` }}>
              <Users size={28} color={C.gray200} style={{ margin:'0 auto 10px' }} />
              <p style={{ color:C.gray500, fontSize:13, margin:'0 0 12px' }}>No applicants yet.<br/>Post a job to get started!</p>
              <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:9, padding:'9px 18px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                Post a Job
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {applications.slice(0, 5).map(app => {
                const s = STATUS[app.status] || STATUS.applied;
                return (
                  <div key={app._id} style={{ background:'#fff', borderRadius:14, padding:'13px 14px', border:`1px solid ${C.gray100}`, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
                        {app.candidate?.photo
                          ? <img src={app.candidate.photo} alt="" style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                          : <div style={{ width:34, height:34, borderRadius:'50%', background:`${C.primary}14`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontWeight:800, fontSize:13, flexShrink:0 }}>
                              {(app.candidate?.name||'?')[0].toUpperCase()}
                            </div>
                        }
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontWeight:700, fontSize:13, color:C.gray900, margin:'0 0 1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {app.candidate?.name || 'Candidate'}
                          </p>
                          <p style={{ fontSize:11, color:C.gray400, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {app.job?.title || 'Job'}
                          </p>
                        </div>
                      </div>
                      <StatusDropdown appId={app._id} current={app.status} onUpdate={handleStatusUpdate} />
                    </div>
                    <p style={{ fontSize:10, color:C.gray300, margin:'7px 0 0' }}>{timeAgo(app.createdAt)}</p>
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

        <MTabBar active={activeTab} onTab={handleTab} jobCount={jobs.length} appCount={applications.length} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // DashboardLayout (top nav) already provides: logo, links, user, logout
  // This header only shows: tab switcher + Post New Job button
  // ════════════════════════════════════════════════════════════
  return (
    <DashboardLayout>
    <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>

      {/* ── Tab bar + Post New Job ── */}
      <div style={{ background:'#fff', borderBottom:`1px solid ${C.gray200}`, padding:'0 32px', display:'flex', alignItems:'center', gap:4 }}>
        {[
          { key:'overview', label:'Overview',   Icon:LayoutDashboard },
          { key:'jobs',     label:'My Jobs',    Icon:Briefcase },
          { key:'apps',     label:'Applicants', Icon:Users },
        ].map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          const badge = key==='jobs' ? jobs.length : key==='apps' ? applications.length : 0;
          return (
            <button key={key} onClick={() => handleTab(key)} style={{ display:'flex', alignItems:'center', gap:6, padding:'14px 14px', border:'none', borderBottom: isActive ? `2px solid ${C.primary}` : '2px solid transparent', cursor:'pointer', fontSize:13, fontWeight: isActive ? 700 : 500, background:'transparent', color: isActive ? C.primary : C.gray500, transition:'all 0.15s', marginBottom:'-1px' }}>
              <Icon size={14} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
              {badge > 0 && <span style={{ background:C.primary, color:'#fff', fontSize:10, fontWeight:700, borderRadius:9999, minWidth:17, height:17, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px' }}>{badge}</span>}
            </button>
          );
        })}
        <div style={{ flex:1 }} />
        <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ display:'flex', alignItems:'center', gap:7, background:C.primary, color:'#fff', border:'none', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
          <PlusCircle size={14} /> Post New Job
        </button>
      </div>

      {/* ── Desktop Hero ── */}
      <section style={{ padding:'24px 32px 0'}}>
        
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 360px', gap:18 }}>

          <div style={{
            background: C.grad,
            borderRadius: 24,
            padding: '28px 32px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 240,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* dot pattern inside card now */}
            <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }} />
            <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
              <CompanyAvatar profile={profile} size={64} border="1.5px solid rgba(255,255,255,0.3)" />
              <div>
                <p style={{ fontSize:13, opacity:0.85, margin:'0 0 2px' }}>Welcome back,</p>
                <h1 style={{ fontWeight:900, fontSize:28, margin:'0 0 3px', lineHeight:1.05, letterSpacing:'-0.8px', color:'#fff' }}>
                  {profile?.companyName || profile?.name || 'Company'}
                </h1>
                {profile?.email && (
                  <p style={{ fontSize:12, opacity:0.75, margin:0 }}>{profile.email}</p>
                )}
              </div>
            </div>
            {/* Industry / Location / Verified pills */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {profile?.industry && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:9999, fontSize:11.5, background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff' }}>
                  {profile.industry}
                </span>
              )}
              {profile?.isVerified && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:9999, fontSize:11.5, background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff' }}>
                  ✓ Verified
                </span>
              )}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, position:'relative' }}>
            <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{
              padding:'11px 22px', borderRadius:10, fontSize:13, fontWeight:600,
              background:'#fff', color:C.dark, border:'none', cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap:7
            }}>+ Post New Job →</button>
            <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{
              padding:'11px 18px', borderRadius:10, fontSize:13, fontWeight:500,
              background:'rgba(255,255,255,0.15)', color:'#fff',
              border:'1px solid rgba(255,255,255,0.25)', cursor:'pointer'
            }}>View Applicants</button>
            <div style={{ flex:1 }} />
            {/* stat pills at far right */}
            <div style={{ display:'flex', gap:6 }}>
              {[
                { label:`${stats.total||0} jobs`, bg:'rgba(255,255,255,0.18)' },
                { label:`${stats.applications||0} applicants`, bg:'rgba(255,255,255,0.18)' },
                { label:`${stats.shortlisted||0} shortlisted`, bg:'rgba(59,130,246,0.5)' },
              ].map(({ label, bg }) => (
                <span key={label} style={{ padding:'7px 12px', borderRadius:9999, fontSize:11.5, fontWeight:600, background:bg, color:'#fff', border:'1px solid rgba(255,255,255,0.2)' }}>
                  {label}
                </span>
              ))}
            </div>
            
          </div>
          </div>        
          {/* Hiring Funnel Panel */}
          <div style={{ background:'#0a0a14', borderRadius:18, padding:'18px 22px', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.14)', flexShrink:0, minWidth:260 }}>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:11, margin:'0 0 12px', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>
              Hiring Funnel
            </p>
            {[
              { stage:'Applied',     count: stats.applications||0, pct:100,    color: C.accent },
              { stage:'Reviewing',   count: stats.reviewing||0,    pct: stats.applications>0 ? Math.round((stats.reviewing/(stats.applications||1))*100) : 0, color:'#0891b2' },
              { stage:'Shortlisted', count: stats.shortlisted||0,  pct: stats.applications>0 ? Math.round((stats.shortlisted/(stats.applications||1))*100) : 0, color:'#ea580c' },
              { stage:'Hired',       count: stats.hired||0,        pct: hireRate, color:'#a855f7' },
            ].map((p, i) => (
              <div key={p.stage} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:7 }}>
                <div style={{ flex:1, height:28, position:'relative' }}>
                  <div style={{
                    width: `${p.pct}%`,
                    height: '100%',
                    borderRadius: 6,
                    background: `linear-gradient(90deg, ${p.color}, ${p.color}88)`,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#fff',
                    minWidth: 60,
                    transition: 'width 0.8s ease'
                  }}>{p.stage}</div>
                </div>
                <span style={{ fontWeight:700, fontSize:15, minWidth:20, textAlign:'right', color:'#fff' }}>
                  {p.count}
                </span>
                
              </div>
            ))}
            {stats.applications > 0 && (
                  <div style={{ padding:'8px 12px', background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.3)', borderRadius:10, fontSize:11.5, color:'rgba(255,255,255,0.85)', marginTop:10 }}>
                    Conversion: <strong style={{ color:'#93c5fd' }}>{hireRate}%</strong> applied → hired
                  </div>
                )}
          </div>
        </div>
        
      </section>

      {/* ── Desktop Stats Row ── */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'26px 32px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[
            { label:'Total Jobs',   value:stats.total||0,        sub:'jobs posted',     Icon:Briefcase,  color:C.primary, trend:jobTrend,  id:'j' },
            { label:'Applications', value:stats.applications||0, sub:'received',        Icon:FileText,   color:'#8b5cf6', trend:appTrend,  id:'a' },
            { label:'Shortlisted',  value:stats.shortlisted||0,  sub:'candidates',      Icon:Star,       color:'#0891b2', trend:shortTrend,id:'sh' },
            { label:'Hired',        value:stats.hired||0,        sub:'this cycle',      Icon:CheckCircle,color:'#059669', trend:hireTrend, id:'h' },
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

        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Quick Actions */}
          <div style={{ background:'#fff', borderRadius:20, padding:'26px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
            <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900, margin:'0 0 18px', letterSpacing:'-0.3px' }}>Quick Actions</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {[
                { label:'Post New Job',   desc:'Create listing',               Icon:PlusCircle, route:ROUTES.COMPANY_JOB_CREATE,   color:C.primary },
                { label:'Job Postings',   desc:`${jobs.length} posted`,        Icon:Briefcase,  route:ROUTES.COMPANY_JOBS,         color:'#8b5cf6' },
                { label:'Applicants',     desc:`${applications.length} total`, Icon:Users,      route:ROUTES.COMPANY_APPLICATIONS, color:'#0891b2' },
              ].map(({ label, desc, Icon, route, color }) => (
                
                <button key={label} onClick={() => navigate(route)} style={{ background:`${color}08`, border:`1px solid ${color}22`, borderRadius:16,
                  position:'relative',  overflow:'hidden', padding:'18px 14px', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:10, cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 4px 16px ${color}22`; e.currentTarget.style.borderColor=`${color}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=`${color}22`; }}>
                  {/* Top color stripe */}
                  <div style={{ position:'absolute', top:0, left:0, width:'100%', height:3, background:color, opacity:0.8 }} />
                  <div style={{ width:42, height:42, borderRadius:12, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={20} color={color} />
                  </div>

                  <div>
                    <p style={{ fontSize:13, fontWeight:800, color:C.gray900, margin:'0 0 2px' }}>{label}</p>
                    <p style={{ fontSize:11, color:C.gray400, margin:0 }}>{desc}</p>
                  </div>
                   <div style={{ display:'inline-flex', alignItems:'center', gap:5, color:color, fontSize:12, fontWeight:600 }}>
                    Open →
                  </div>
                </button>
              ))}
            </div>
            
          </div>

          {/* Recent Applicants Table */}
          <div style={{ background:'#fff', borderRadius:20, padding:'26px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}`, flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900, margin:0, letterSpacing:'-0.3px' }}>Recent Applicants</h2>
              <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ display:'flex', alignItems:'center', gap:4, color:C.accent, fontSize:13, fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
                Manage all <ChevronRight size={14} />
              </button>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ width:60, height:60, borderRadius:16, background:C.light, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <Users size={28} color={C.border} />
                </div>
                <p style={{ color:C.gray500, fontSize:15, margin:'0 0 5px', fontWeight:600 }}>No applicants yet</p>
                <p style={{ color:C.gray400, fontSize:13, margin:'0 0 18px' }}>Post a job to start receiving applications</p>
                <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'11px 22px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  Post a Job
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'2.5fr 2fr 1.5fr 1.5fr', gap:12, padding:'0 12px 10px', borderBottom:`1px solid ${C.gray100}` }}>
                  {['Candidate','Applied For','Status','Date'].map(h => (
                    <span key={h} style={{ fontSize:11, fontWeight:700, color:C.gray400, letterSpacing:'0.4px', textTransform:'uppercase' }}>{h}</span>
                  ))}
                </div>
                {applications.slice(0, 8).map((app, idx) => (
                  <div key={app._id} style={{ display:'grid', gridTemplateColumns:'2.5fr 2fr 1.5fr 1.5fr', gap:12, padding:'13px 12px', borderRadius:12, background: idx%2===0 ? 'transparent' : C.gray50, alignItems:'center' }}>
                    {/* Candidate */}
                    <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                      {app.candidate?.photo
                        ? <img src={app.candidate.photo} alt="" style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`1.5px solid ${C.gray200}` }} />
                        : <div style={{ width:34, height:34, borderRadius:'50%', background:`${C.primary}14`, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, fontWeight:800, fontSize:13, flexShrink:0 }}>
                            {(app.candidate?.name||'?')[0].toUpperCase()}
                          </div>
                      }
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontWeight:700, fontSize:13, color:C.gray900, margin:'0 0 1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {app.candidate?.name || 'Candidate'}
                        </p>
                        <p style={{ fontSize:11, color:C.gray400, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {app.candidate?.email}
                        </p>
                      </div>
                    </div>
                    {/* Job */}
                    <p style={{ fontSize:12, color:C.gray600, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:500 }}>
                      {app.job?.title || '—'}
                    </p>
                    {/* Status Dropdown */}
                    <StatusDropdown appId={app._id} current={app.status} onUpdate={handleStatusUpdate} />
                    {/* Date */}
                    <span style={{ fontSize:11, color:C.gray400 }}>{timeAgo(app.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          {/* ── Top Performing Job ── */}
          {topJob ? (
            <div style={{ background:'#fff', borderRadius:20, padding:'22px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <h3 style={{ fontSize:15, fontWeight:800, color:C.gray900, margin:0 }}>Top Performing Job</h3>
                <span style={{ background:'#fef3c7', color:'#92400e', fontSize:10, fontWeight:700, borderRadius:7, padding:'3px 9px' }}>
                   HOT
                </span>
              </div>
              <p style={{ fontSize:14, fontWeight:700, color:C.gray900, margin:'0 0 14px', letterSpacing:'-0.2px' }}>
                {topJob.title}
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                {[
                  { label:'Applicants', value: topJob.applicationsCount || 0 },
                  { label:'Openings',   value: topJob.openings || 1 },
                  { label:'Days live',  value: Math.floor((Date.now() - new Date(topJob.createdAt).getTime()) / 86400000) },
                  { label:'Status',     value: topJob.isActive ? 'Active' : 'Closed' },
                ].map((m, i) => (
                  <div key={i} style={{ padding:'10px 12px', background:C.gray50, borderRadius:10 }}>
                    <p style={{ fontSize:18, fontWeight:900, color:C.gray900, margin:'0 0 2px', letterSpacing:'-0.5px' }}>{m.value}</p>
                    <p style={{ fontSize:10, color:C.gray400, margin:0 }}>{m.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'10px', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                View Applicants →
              </button>
            </div>
          ) : (
            <div style={{ background:'#fff', borderRadius:20, padding:'22px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}`, textAlign:'center' }}>
              <p style={{ color:C.gray400, fontSize:13, margin:'0 0 12px' }}>No jobs posted yet</p>
              <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:9, padding:'9px 18px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Post First Job</button>
            </div>
          )}

          {/* ── Recent Activity ── */}
          <div style={{ background:'#fff', borderRadius:20, padding:'22px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontSize:15, fontWeight:800, color:C.gray900, margin:0 }}>Recent Activity</h3>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 0 3px #22c55e33' }} />
            </div>
            {recentActivity.length === 0 ? (
              <p style={{ color:C.gray400, fontSize:13, textAlign:'center', padding:'16px 0' }}>No activity yet</p>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} style={{ display:'flex', gap:11 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:9, height:9, borderRadius:'50%', background:a.color, marginTop:5, flexShrink:0, boxShadow:`0 0 0 3px ${a.color}33` }} />
                    {i < recentActivity.length - 1 && (
                      <div style={{ width:1, flex:1, background:C.gray100, margin:'3px 0' }} />
                    )}
                  </div>
                  <div style={{ flex:1, paddingBottom:12 }}>
                    <p style={{ fontSize:12, color:C.gray800, margin:'0 0 2px', lineHeight:1.45 }}>{a.text}</p>
                    <p style={{ fontSize:10, color:C.gray400, margin:0 }}>{a.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
    </DashboardLayout>
  );
}