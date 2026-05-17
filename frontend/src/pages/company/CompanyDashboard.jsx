// CompanyDashboard

import { useEffect, useState }       from 'react';
import { useNavigate }               from 'react-router-dom';
import { useAuth }                   from '../../context/AuthContext';
import { ROUTES }                    from '../../constants/routes';
import { getCompanyDashboardStats }  from '../../services/jobService';
import { getCompanyApplications }    from '../../services/applicationService';
import { getMyJobs }                 from '../../services/jobService';
import Sparkline                     from '../../components/charts/Sparkline';
import MiniBarChart                  from '../../components/charts/MiniBarChart';

const CO = '#16a34a';
const CO_DEEP = '#15803d';

function Avatar({ name = '', size = 32, bg = CO }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38,
      fontFamily: 'Sora, sans-serif', flexShrink: 0,
    }}>{name.charAt(0).toUpperCase() || '?'}</div>
  );
}
function Pill({ children, color = CO }) {
  return <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:8, fontSize:10.5, fontWeight:700, background:`${color}18`, color }}>{children}</span>;
}
function Dot({ color = '#22c55e', size = 7 }) {
  return <span style={{ display:'inline-block', width:size, height:size, borderRadius:'50%', background:color }} />;
}

export default function CompanyDashboard() {

  const { user, profile, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats,     setStats]     = useState(null);
  const [apps,      setApps]      = useState([]);
  const [topJob,    setTopJob]    = useState(null);
  const [loading,   setLoading]   = useState(true);

  const companyName = profile?.companyName || user?.name || 'Company';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, appsData, jobsData] = await Promise.all([
          getCompanyDashboardStats(),
          getCompanyApplications(),
          getMyJobs(),
        ]);
        setStats(statsData);
        setApps(appsData.slice(0, 4));
        if (jobsData && jobsData.length > 0) {
          setTopJob(jobsData[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = async () => { await logoutUser(); navigate(ROUTES.LOGIN); };

  const statCards = stats ? [
    { label: 'Total Jobs',    value: stats.totalJobs,   sub: `${stats.activeJobs} active`,  trend:[0,0,1,1,2,2,stats.totalJobs],   icon:'💼', color: CO },
    { label: 'Applications', value: stats.totalApps,   sub: `${stats.applied} new`,        trend:[0,1,1,2,2,3,stats.totalApps],   icon:'👥', color:'#ea580c' },
    { label: 'Shortlisted',  value: stats.shortlisted, sub: 'candidates',                  trend:[0,0,0,1,1,1,stats.shortlisted], icon:'⭐', color:'#a855f7' },
    { label: 'Hired',        value: stats.hired,       sub: 'this cycle',                  trend:[0,0,0,0,0,0,stats.hired],       icon:'✓',  color:'#0891b2' },
  ] : [];

  const pipeline = stats ? [
    { stage: 'Applied',     count: stats.applied     || 0, color: CO,        width: 100 },
    { stage: 'Reviewing',   count: stats.reviewing   || 0, color: '#0891b2', width: 70  },
    { stage: 'Shortlisted', count: stats.shortlisted || 0, color: '#ea580c', width: 40  },
    { stage: 'Hired',       count: stats.hired       || 0, color: '#a855f7', width: 15  },
  ] : [];

  const statusColors = {
    applied:     { c: CO,        label: 'New' },
    reviewing:   { c: '#0891b2', label: 'Reviewing' },
    shortlisted: { c: '#ea580c', label: 'Shortlisted' },
    rejected:    { c: '#ef4444', label: 'Rejected' },
    hired:       { c: '#a855f7', label: 'Hired' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: 'Inter, sans-serif', color: '#0a0a14' }}>

      {/* ── Nav ── */}
      <header style={{
        height: 64, background: '#fff', borderBottom: '1px solid #ececec',
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 16,
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div onClick={() => navigate(ROUTES.COMPANY_DASHBOARD)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: CO,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: 'Sora, sans-serif',
          }}>HP</div>
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px' }}>HirePortal</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:100, marginLeft:6, background:`${CO}15`, color:CO, fontSize:11, fontWeight:700 }}>
            <Dot color={CO} size={6}/> Company
          </span>
        </div>

        <nav style={{ display: 'flex', gap: 2, marginLeft: 16 }}>
          {[
            { id: 'overview',  label: 'Overview' },
            { id: 'jobs',      label: 'Job Postings', badge: stats?.totalJobs || null },
            { id: 'applicants',label: 'Applicants',   badge: stats?.totalApps || null },
          ].map(n => (
            <button key={n.id} onClick={() => {
              setActiveTab(n.id);
              if (n.id === 'jobs')       navigate(ROUTES.COMPANY_JOBS);
              if (n.id === 'applicants') navigate(ROUTES.COMPANY_APPLICATIONS);
            }} style={{
              padding: '6px 13px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === n.id ? '#0a0a14' : 'transparent',
              color: activeTab === n.id ? '#fff' : '#4b5563',
              fontSize: 13, fontWeight: activeTab === n.id ? 600 : 500,
              fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {n.label}
              {n.badge ? <span style={{ background: activeTab === n.id ? CO : '#f0fdf4', color: activeTab === n.id ? '#fff' : CO, fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:8 }}>{n.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{
            padding: '7px 16px', borderRadius: 8, background: CO, color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
          }}>+ Post New Job</button>
          <div onClick={() => navigate(ROUTES.PROFILE)} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <Avatar name={companyName} size={34} bg={CO} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{companyName}</div>
              <div style={{ fontSize: 10, color: '#888' }}>Company</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            padding: '7px 14px', borderRadius: 8, background: CO,
            color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
          }}>Logout</button>
        </div>
      </header>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px 48px' }}>

        {/* HERO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 20 }}>
          <div style={{
            background: `linear-gradient(125deg, ${CO_DEEP} 0%, ${CO} 60%, #84cc16 110%)`,
            borderRadius: 24, padding: '28px 32px', color: '#fff',
            position: 'relative', overflow: 'hidden', minHeight: 220,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 14,
                  background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 24, flexShrink: 0,
                }}>{companyName.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Welcome back,</div>
                  <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:26, letterSpacing:'-1px', lineHeight:1.1 }}>{companyName}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {profile?.industry && (
                  <span style={{ padding:'4px 12px', borderRadius:100, fontSize:11.5, background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.2)' }}>
                    🏢 {profile.industry}
                  </span>
                )}
                {user?.isVerified && (
                  <span style={{ padding:'4px 12px', borderRadius:100, fontSize:11.5, background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.2)' }}>
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, position: 'relative' }}>
              <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{
                padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:600,
                background:'#fff', color:CO_DEEP, border:'none', cursor:'pointer',
              }}>+ Post New Job →</button>
              <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{
                padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:500,
                background:'rgba(255,255,255,0.15)', color:'#fff',
                border:'1px solid rgba(255,255,255,0.25)', cursor:'pointer',
              }}>View Applicants</button>
              {stats && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  {[
                    { icon:'💼', label:`${stats.totalJobs} jobs` },
                    { icon:'👥', label:`${stats.totalApps} applicants` },
                  ].map((p,i) => (
                    <span key={i} style={{ padding:'6px 12px', borderRadius:100, fontSize:11.5, fontWeight:600, background:'rgba(255,255,255,0.18)', display:'inline-flex', alignItems:'center', gap:5 }}>
                      {p.icon} {p.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hiring funnel */}
          <div style={{ background:'#0a0a14', color:'#fff', borderRadius:24, padding:'22px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:-40, right:-40, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle, ${CO}55, transparent 70%)` }} />
            <div style={{ fontSize:10, color:'#bbf7d0', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', marginBottom:14, position:'relative' }}>Hiring Funnel</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, position:'relative', marginBottom:14 }}>
              {pipeline.map(p => (
                <div key={p.stage} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ flex:1, position:'relative', height:26 }}>
                    <div style={{
                      width:`${p.width}%`, height:'100%', borderRadius:6,
                      background:`linear-gradient(90deg, ${p.color}, ${p.color}88)`,
                      display:'flex', alignItems:'center', paddingLeft:10,
                      fontSize:11.5, fontWeight:600, color:'#fff',
                    }}>{p.stage}</div>
                  </div>
                  <span style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:15, minWidth:20, textAlign:'right' }}>{p.count}</span>
                </div>
              ))}
            </div>
            {stats && (
              <div style={{ padding:'9px 12px', background:'rgba(22,163,74,0.15)', border:'1px solid rgba(22,163,74,0.3)', borderRadius:10, fontSize:11.5, position:'relative', display:'flex', alignItems:'center', gap:8 }}>
                <Dot color={CO} />
                <span>
                  {stats.totalApps > 0
                    ? `Conversion: ${Math.round((stats.shortlisted/stats.totalApps)*100)}% applied → shortlisted`
                    : 'No applications yet'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {loading ? [1,2,3,4].map(i => (
            <div key={i} style={{ background:'#fff', borderRadius:18, padding:'18px', border:'1px solid #ececec', height:110 }} />
          )) : statCards.map((s,i) => (
            <div key={i} style={{ background:'#fff', borderRadius:18, padding:'18px 18px 14px', border:'1px solid #ececec' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}13`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{s.icon}</div>
                <Sparkline data={s.trend} color={s.color} width={60} height={24} />
              </div>
              <div style={{ fontFamily:'Sora,sans-serif', fontSize:30, fontWeight:800, letterSpacing:'-1.5px', lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12.5, color:'#0a0a14', fontWeight:500, marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:11, color:s.color, fontWeight:600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:18 }}>

          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Quick Actions */}
            <div>
              <div style={{ fontFamily:'Sora,sans-serif', fontSize:15, fontWeight:700, marginBottom:12 }}>Quick Actions</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                {[
                  { title:'Company Profile', desc:'Update company info',        icon:'🏢', route: ROUTES.PROFILE },
                  { title:'Job Postings',    desc:'Manage listings',             icon:'💼', route: ROUTES.COMPANY_JOBS, badge: stats?.totalJobs || null },
                  { title:'Applicants',      desc:'Review candidates',           icon:'👥', route: ROUTES.COMPANY_APPLICATIONS, badge: stats?.totalApps || null },
                ].map((a,i) => (
                  <div key={i} onClick={() => navigate(a.route)} style={{
                    background:'#fff', borderRadius:16, padding:'18px', border:'1px solid #ececec',
                    cursor:'pointer', position:'relative', overflow:'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = CO; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ececec'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ position:'absolute', top:0, left:0, width:'100%', height:3, background:CO, opacity:0.7 }} />
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${CO}13`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{a.icon}</div>
                      {a.badge ? <Pill color={CO}>{a.badge}</Pill> : null}
                    </div>
                    <div style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:14, marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:11.5, color:'#666', lineHeight:1.5, marginBottom:10 }}>{a.desc}</div>
                    <div style={{ color:CO, fontSize:11.5, fontWeight:600 }}>Open →</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div style={{ background:'#fff', borderRadius:18, padding:'20px 22px', border:'1px solid #ececec' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div>
                  <div style={{ fontFamily:'Sora,sans-serif', fontSize:15, fontWeight:700 }}>Recent Applications</div>
                  <div style={{ fontSize:11.5, color:'#888', marginTop:2 }}>{apps.length} awaiting review</div>
                </div>
                <button onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)} style={{ background:'transparent', color:CO, border:'none', cursor:'pointer', fontSize:12.5, fontWeight:600 }}>View all →</button>
              </div>
              {apps.length === 0 ? (
                <div style={{ textAlign:'center', padding:'24px 0', color:'#888', fontSize:13 }}>No applications yet</div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {apps.map(a => {
                    const s = statusColors[a.status] || { c: '#888', label: a.status };
                    return (
                      <div key={a._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 13px', background:'#fafaf7', borderRadius:12, cursor:'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background='#f3f3ef'}
                        onMouseLeave={e => e.currentTarget.style.background='#fafaf7'}>
                        <Avatar name={a.candidate?.name || '?'} size={40} bg={CO} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2 }}>
                            <span style={{ fontFamily:'Sora,sans-serif', fontWeight:600, fontSize:13 }}>{a.candidate?.name || 'Unknown'}</span>
                            <Pill color={s.c}>{s.label}</Pill>
                          </div>
                          <div style={{ fontSize:11.5, color:'#666' }}>Applied for <strong>{a.job?.title}</strong> · {new Date(a.createdAt).toLocaleDateString()}</div>
                        </div>
                        <button style={{ padding:'5px 12px', borderRadius:7, background:CO, color:'#fff', border:'none', cursor:'pointer', fontSize:11.5, fontWeight:600 }}>Review</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right — Top Job */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {topJob && (
              <div style={{ background:'#fff', borderRadius:18, padding:'18px 20px', border:'1px solid #ececec' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <div style={{ fontFamily:'Sora,sans-serif', fontSize:14, fontWeight:700 }}>Top Job Post</div>
                  <Pill color="#ea580c">🔥 HOT</Pill>
                </div>
                <div style={{ fontFamily:'Sora,sans-serif', fontWeight:600, fontSize:14, marginBottom:14 }}>{topJob.title}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                  {[
                    { l:'Applications', v: topJob.applicationsCount || 0 },
                    { l:'Location',     v: topJob.location || '—' },
                    { l:'Type',         v: topJob.jobType || '—' },
                    { l:'Status',       v: topJob.status || '—' },
                  ].map((m,i) => (
                    <div key={i} style={{ padding:'9px 11px', background:'#fafaf7', borderRadius:10 }}>
                      <div style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:16, letterSpacing:'-0.5px', lineHeight:1 }}>{m.v}</div>
                      <div style={{ fontSize:10.5, color:'#888', marginTop:3 }}>{m.l}</div>
                    </div>
                  ))}
                </div>
                <MiniBarChart
                  data={[
                    {label:'M',value:2},{label:'T',value:3},{label:'W',value:topJob.applicationsCount||0},
                    {label:'T',value:2},{label:'F',value:3},{label:'S',value:1,dim:true},{label:'S',value:0,dim:true},
                  ]}
                  color={CO} height={55} width={240}
                />
              </div>
            )}

            {/* Activity */}
            <div style={{ background:'#fff', borderRadius:18, padding:'18px 20px', border:'1px solid #ececec', flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div style={{ fontFamily:'Sora,sans-serif', fontSize:14, fontWeight:700 }}>Activity</div>
                <Dot color="#22c55e" />
              </div>
              {apps.length === 0 ? (
                <div style={{ color:'#888', fontSize:12, textAlign:'center', padding:'20px 0' }}>No recent activity</div>
              ) : apps.map((a,i) => (
                <div key={a._id} style={{ display:'flex', gap:10 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:CO, marginTop:5 }} />
                    {i < apps.length-1 && <div style={{ width:1, flex:1, background:'#ececec', margin:'3px 0' }} />}
                  </div>
                  <div style={{ flex:1, paddingBottom:12 }}>
                    <div style={{ fontSize:12, lineHeight:1.45 }}>{a.candidate?.name} applied for {a.job?.title}</div>
                    <div style={{ fontSize:10.5, color:'#888', marginTop:2 }}>{new Date(a.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}