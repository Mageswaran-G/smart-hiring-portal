import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Briefcase, Users, PlusCircle, User,
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
import AIAnalyticsCard from './components/dashboard/AIAnalyticsCard';

// ─── Main Component ──────────────────────────────────────────
export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { profile, logoutUser } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  
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
        <header style={{
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          height: 56, padding: '0 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: C.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(30,58,95,0.4)' }}>
              <Building2 size={15} color="#fff" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 900, fontSize: 16, color: C.gray900, letterSpacing: '-0.3px' }}>HirePortal</span>
              <span style={{ background: `${C.primary}12`, color: C.primary, fontSize: 9, fontWeight: 800, borderRadius: 5, padding: '2px 6px', letterSpacing: '0.5px', border: `1px solid ${C.primary}20` }}>COMPANY</span>
            </div>
          </div>
          <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{
            background: C.primary, color: '#fff', border: 'none', borderRadius: 9,
            padding: '7px 13px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 2px 6px rgba(30,58,95,0.35)',
          }}>
            <PlusCircle size={13} /> Post Job
          </button>
        </header>

        {/* ── Mobile Hero ── */}
        <section style={{
          background: C.grad,
          padding: '24px 16px 32px',
          position: 'relative', overflow: 'hidden',
          borderRadius: '0 0 28px 28px',
          boxShadow: '0 8px 24px rgba(14,30,64,0.3)',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(59,130,246,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: 40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
          {/* Dot grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            {/* Avatar + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <CompanyAvatar profile={profile} size={58} border="2px solid rgba(255,255,255,0.25)" />
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#4ade80', border: '2px solid #0a1628', boxShadow: '0 0 5px rgba(74,222,128,0.7)' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: '0 0 2px', fontWeight: 500 }}>Welcome back,</p>
                <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 2px', lineHeight: 1.1, letterSpacing: '-0.4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.companyName || profile?.name || 'Company'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.email}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
              {profile?.industry && (
                <span style={{ padding: '3px 10px', borderRadius: 7, fontSize: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  {profile.industry}
                </span>
              )}
              {profile?.isVerified && (
                <span style={{ padding: '3px 10px', borderRadius: 7, fontSize: 10, background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', fontWeight: 700 }}>
                  ✓ Verified
                </span>
              )}
            </div>

            {/* Quick stat pills */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'Jobs',         value: stats.total        || 0 },
                { label: 'Applications', value: stats.applications || 0 },
                { label: 'Hired',        value: stats.hired        || 0 },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '6px 12px', textAlign: 'center', flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: 18, lineHeight: 1 }}>{value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mobile Stats 2×2 ── */}
        <section style={{ padding: '16px 14px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {statCards.map(({ label, value, color, Icon, trend, trendPct, id }) => (
              <div key={label} style={{
                background: '#fff', borderRadius: 16, padding: '14px 14px 12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.06)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={color} />
                  </div>
                  <div style={{
                    background: trendPct?.startsWith('-') ? '#fef2f2' : '#f0fdf4',
                    color: trendPct?.startsWith('-') ? '#dc2626' : '#16a34a',
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 7,
                  }}>
                    {trendPct?.startsWith('-') ? '↘' : '↗'} {trendPct || '0%'}
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: C.gray900, letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 3 }}>{value}</div>
                <p style={{ fontSize: 11, color: C.gray500, margin: 0, fontWeight: 600 }}>{label}</p>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}40, ${color}10)`, borderRadius: '0 0 16px 16px' }} />
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

        {/* ── Mobile AI Analytics ── */}
        <section style={{ padding:'14px 14px 0' }}>
          <AIAnalyticsCard />
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
        

        <CompanyHero profile={profile} stats={stats} hireRate={hireRate} navigate={navigate} />
        <CompanyStatsGrid statCards={statCards} />

        <main style={{ maxWidth:1200, margin:'0 auto', padding:'22px 32px 48px', display:'grid', gridTemplateColumns:'1fr 380px', gap:22 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <CompanyQuickActions jobsCount={jobs.length} applicationsCount={applications.length} navigate={navigate} />
            <RecentApplicantsTable applications={applications} onStatusUpdate={handleStatusUpdate} navigate={navigate} />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <TopPerformingJobCard topJob={topJob} dashboardNow={dashboardNow} navigate={navigate} />
            <AIAnalyticsCard />
            <RecentActivityCard recentActivity={recentActivity} />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
