import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  LayoutDashboard, Briefcase, Users, PlusCircle, User,
  LogOut, ChevronRight, Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';
import useCompanyDashboardData from '../../hooks/useCompanyDashboardData';
import { C } from './components/dashboard/dashboardTheme';
import { timeAgo } from './components/dashboard/dashboardUtils';
import CompanyAvatar from './components/dashboard/CompanyAvatar';
import LoadingScreen from './components/dashboard/LoadingScreen';
import MobileTabBar from './components/dashboard/MobileTabBar';
import Sparkline from './components/dashboard/Sparkline';
import StatusDropdown from './components/dashboard/StatusDropdown';
import CompanyHero from './components/dashboard/CompanyHero';
import CompanyStatsGrid from './components/dashboard/CompanyStatsGrid';
import CompanyQuickActions from './components/dashboard/CompanyQuickActions';
import RecentApplicantsTable from './components/dashboard/RecentApplicantsTable';
import TopPerformingJobCard from './components/dashboard/TopPerformingJobCard';
import RecentActivityCard from './components/dashboard/RecentActivityCard';
import ApplicantAvatar from './components/dashboard/ApplicantAvatar';

// ─── Main Component ──────────────────────────────────────────
export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { profile, logoutUser } = useAuth();
  const isMobile = useIsMobile();

  const [activeTab,    setActiveTab]    = useState('overview');
  const {
    loading,
    stats,
    jobs,
    applications,
    dashboardNow,
    hireRate,
    topJob,
    recentActivity,
    statCards,
    handleStatusUpdate,
  } = useCompanyDashboardData();

  const handleTab = (key) => {
    if (key === 'jobs')    { navigate(ROUTES.COMPANY_JOBS);         return; }
    if (key === 'post')    { navigate(ROUTES.COMPANY_JOB_CREATE);   return; }
    if (key === 'apps')    { navigate(ROUTES.COMPANY_APPLICATIONS); return; }
    if (key === 'profile') { navigate(ROUTES.PROFILE);              return; }
    setActiveTab(key);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    }
    navigate(ROUTES.LOGIN);
  };

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
              {statCards.map(({ label, value, color, Icon, trend, id }) => (
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
              {applications.slice(0, 5).map(app => (
                  <div key={app._id} style={{ background:'#fff', borderRadius:14, padding:'13px 14px', border:`1px solid ${C.gray100}`, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
                        <ApplicantAvatar candidate={app.candidate} />
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
              ))}
            </div>
          )}
        </section>

        {/* ── Mobile Logout ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <button onClick={handleLogout} style={{ width:'100%', background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:14, padding:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, color:'#ef4444', fontSize:14, fontWeight:700, cursor:'pointer' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </section>

        <MobileTabBar active={activeTab} onTab={handleTab} jobCount={jobs.length} appCount={applications.length} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // ════════════════════════════════════════════════════════════
  return (
    <DashboardLayout>
      <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>
        <div style={{ background:'#fff', borderBottom:`1px solid ${C.gray200}`, padding:'0 32px', display:'flex', alignItems:'center', gap:4 }}>
          {[
            { key:'overview', label:'Overview', Icon:LayoutDashboard },
            { key:'jobs', label:'My Jobs', Icon:Briefcase },
            { key:'apps', label:'Applicants', Icon:Users },
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

        <CompanyHero profile={profile} stats={stats} hireRate={hireRate} navigate={navigate} />
        <CompanyStatsGrid statCards={statCards} />

        <main style={{ maxWidth:1200, margin:'0 auto', padding:'22px 32px 48px', display:'grid', gridTemplateColumns:'1fr 380px', gap:22 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <CompanyQuickActions jobsCount={jobs.length} applicationsCount={applications.length} navigate={navigate} />
            <RecentApplicantsTable applications={applications} onStatusUpdate={handleStatusUpdate} navigate={navigate} />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <TopPerformingJobCard topJob={topJob} dashboardNow={dashboardNow} navigate={navigate} />
            <RecentActivityCard recentActivity={recentActivity} />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
