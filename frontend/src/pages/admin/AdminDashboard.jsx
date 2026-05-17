// AdminDashboard

import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../../context/AuthContext';
import { ROUTES }              from '../../constants/routes';
import { API }                 from '../../services/authService';
import { API_ENDPOINTS }       from '../../constants/api';
import Sparkline               from '../../components/charts/Sparkline';

const A_ACCENT = '#7c3aed';
const A_DEEP   = '#5b21b6';

function Avatar({ name='', size=32, bg=A_ACCENT }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:size*0.38, fontFamily:'Sora,sans-serif', flexShrink:0 }}>{name.charAt(0).toUpperCase()||'?'}</div>;
}
function Pill({ children, color=A_ACCENT }) {
  return <span style={{ display:'inline-flex', padding:'2px 8px', borderRadius:8, fontSize:10.5, fontWeight:700, background:`${color}18`, color }}>{children}</span>;
}
function Dot({ color='#22c55e', size=7 }) {
  return <span style={{ display:'inline-block', width:size, height:size, borderRadius:'50%', background:color }} />;
}

export default function AdminDashboard() {

  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState('overview');
  const [stats,     setStats]       = useState(null);
  const [loading,   setLoading]     = useState(true);

  const name = user?.name || 'Admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.ADMIN_STATS);
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => { await logoutUser(); navigate(ROUTES.LOGIN); };

  const metricCards = stats ? [
    { label:'Total Users',   value: stats.totalUsers,       sub:`${stats.totalCandidates} candidates`, trend:[100,200,350,500,700,900,stats.totalUsers],       icon:'👥', color:A_ACCENT },
    { label:'Companies',     value: stats.totalCompanies,   sub:'registered',                          trend:[10,20,30,50,70,90,stats.totalCompanies],         icon:'🏢', color:'#16a34a' },
    { label:'Active Jobs',   value: stats.totalJobs,        sub:'published',                           trend:[20,40,60,80,100,150,stats.totalJobs],             icon:'💼', color:'#ea580c' },
    { label:'Applications',  value: stats.totalApplications,sub:`${stats.hired||0} hired`,            trend:[200,500,800,1200,1800,2500,stats.totalApplications],icon:'📤',color:'#0891b2' },
  ] : [];

  const services = [
    { name:'Backend API',  status:'Online',      latency:'42ms', color:'#22c55e' },
    { name:'Database',     status:'Online',      latency:'18ms', color:'#22c55e' },
    { name:'File Storage', status:'Online',      latency:'88ms', color:'#22c55e' },
    { name:'Module 5',     status:'In Progress', latency:'—',    color:'#f59e0b' },
  ];

  const module5 = [
    { title:'User Management',    icon:'👥', desc:'View all users, change roles, suspend accounts',    points:['View all candidates','View all companies','Change user roles','Suspend / ban users'], progress:65 },
    { title:'Job Moderation',     icon:'🛡', desc:'Review and approve job postings',                   points:['Review pending jobs','Approve or reject','Flag inappropriate','Company verification'], progress:48 },
    { title:'Platform Analytics', icon:'📊', desc:'Monitor platform health and metrics',               points:['Total users','Jobs posted','Applications count','Growth trends'], progress:72 },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#fafaf7', fontFamily:'Inter,sans-serif', color:'#0a0a14' }}>

      {/* ── Nav ── */}
      <header style={{ height:64, background:'#fff', borderBottom:'1px solid #ececec', display:'flex', alignItems:'center', padding:'0 32px', gap:16, position:'sticky', top:0, zIndex:40 }}>
        <div onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <div style={{ width:34, height:34, borderRadius:10, background:A_ACCENT, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, fontFamily:'Sora,sans-serif' }}>HP</div>
          <span style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:17, letterSpacing:'-0.5px' }}>HirePortal</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:100, marginLeft:6, background:`${A_ACCENT}15`, color:A_ACCENT, fontSize:11, fontWeight:700 }}>🛡 Admin</span>
        </div>

        <nav style={{ display:'flex', gap:2, marginLeft:16 }}>
          {[
            { id:'overview',  label:'Overview' },
            { id:'users',     label:'Users',      badge:'Module 5' },
            { id:'moderation',label:'Moderation', badge:'Module 5' },
            { id:'analytics', label:'Analytics',  badge:'Module 5' },
          ].map(n => (
            <button key={n.id} onClick={() => setActiveTab(n.id)} style={{ padding:'6px 13px', borderRadius:8, border:'none', cursor:'pointer', background: activeTab===n.id ? '#0a0a14' : 'transparent', color: activeTab===n.id ? '#fff' : '#4b5563', fontSize:13, fontWeight: activeTab===n.id ? 600 : 500, fontFamily:'Inter,sans-serif', display:'inline-flex', alignItems:'center', gap:6 }}>
              {n.label}
              {n.badge ? <span style={{ background: activeTab===n.id ? '#f59e0b' : '#fef3c7', color: activeTab===n.id ? '#fff' : '#92400e', fontSize:9.5, fontWeight:700, padding:'1px 6px', borderRadius:8 }}>{n.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Avatar name={name} size={34} bg={A_ACCENT} />
            <div style={{ lineHeight:1.2 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{name}</div>
              <div style={{ fontSize:10, color:'#888' }}>Super Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding:'7px 14px', borderRadius:8, background:A_ACCENT, color:'#fff', border:'none', cursor:'pointer', fontSize:12.5, fontWeight:600 }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'28px 32px 48px' }}>

        {/* HERO */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:18, marginBottom:20 }}>
          <div style={{ background:`linear-gradient(125deg, ${A_DEEP} 0%, ${A_ACCENT} 55%, #ec4899 110%)`, borderRadius:24, padding:'28px 32px', color:'#fff', position:'relative', overflow:'hidden', minHeight:220, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)' }} />
            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <Avatar name={name} size={60} bg="rgba(255,255,255,0.2)" />
                <div>
                  <div style={{ fontSize:12, opacity:0.8 }}>Signed in as,</div>
                  <div style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:26, letterSpacing:'-1px', lineHeight:1.1 }}>{name}</div>
                  <div style={{ fontSize:12, opacity:0.75, marginTop:2 }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:100, fontSize:11.5, fontWeight:600, background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.2)' }}>🛡 SUPER ADMIN</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:100, fontSize:11.5, fontWeight:600, background:'rgba(34,197,94,0.25)', color:'#bbf7d0', border:'1px solid rgba(34,197,94,0.35)' }}>
                  <Dot color="#22c55e" size={6} /> System Online
                </span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:100, fontSize:11.5, fontWeight:600, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)' }}>Week 5 of 6</span>
              </div>
            </div>
          </div>

          {/* Platform Status */}
          <div style={{ background:'#0a0a14', color:'#fff', borderRadius:24, padding:'22px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:-40, right:-40, width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle, ${A_ACCENT}55, transparent 70%)` }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, position:'relative' }}>
              <div style={{ fontSize:10, color:'#ddd6fe', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>Platform Status</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                <Dot color="#22c55e" />
                <span style={{ fontSize:10.5, color:'#4ade80', fontWeight:600 }}>All systems normal</span>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:9, position:'relative' }}>
              {services.map(s => (
                <div key={s.name} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}>
                  <Dot color={s.color} />
                  <span style={{ flex:1, fontSize:12.5, fontWeight:500 }}>{s.name}</span>
                  <span style={{ fontSize:10.5, color:'rgba(255,255,255,0.45)', fontFamily:'monospace' }}>{s.latency}</span>
                  <span style={{ padding:'2px 8px', borderRadius:8, fontSize:10.5, fontWeight:700, background: s.color==='#22c55e' ? 'rgba(34,197,94,0.18)' : 'rgba(245,158,11,0.18)', color:s.color }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dev banner */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, padding:'14px 18px', background:'#fefce8', border:'1px solid #fef08a', borderRadius:14 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'#fde047', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>⚠</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#713f12' }}>Module 5 (Admin Features) is currently under development.</div>
            <div style={{ fontSize:11.5, color:'#854d0e', marginTop:2 }}>User management, job moderation, and analytics will be live soon.</div>
          </div>
        </div>

        {/* PLATFORM METRICS */}
        <div style={{ fontFamily:'Sora,sans-serif', fontSize:15, fontWeight:700, marginBottom:14 }}>Platform Metrics</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {loading ? [1,2,3,4].map(i => (
            <div key={i} style={{ background:'#fff', borderRadius:18, padding:'18px', border:'1px solid #ececec', height:110 }} />
          )) : metricCards.map((s,i) => (
            <div key={i} style={{ background:'#fff', borderRadius:18, padding:'18px 18px 14px', border:'1px solid #ececec' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}13`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{s.icon}</div>
                <Sparkline data={s.trend} color={s.color} width={60} height={24} />
              </div>
              <div style={{ fontFamily:'Sora,sans-serif', fontSize:28, fontWeight:800, letterSpacing:'-1.5px', lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12.5, color:'#0a0a14', fontWeight:500, marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:11, color:s.color, fontWeight:600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* MODULE 5 Cards */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ fontFamily:'Sora,sans-serif', fontSize:15, fontWeight:700 }}>Module 5 — In Progress</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11.5, color:'#666' }}>
            <span>Overall progress</span>
            <div style={{ width:120, height:5, background:'#ececec', borderRadius:3, overflow:'hidden' }}>
              <div style={{ width:'62%', height:'100%', background:`linear-gradient(90deg, ${A_ACCENT}, #ec4899)`, borderRadius:3 }} />
            </div>
            <strong style={{ color:A_ACCENT }}>62%</strong>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {module5.map(m => (
            <div key={m.title} style={{ background:'#fff', borderRadius:18, padding:'22px', border:'1px solid #ececec', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, width:'100%', height:3, background:`linear-gradient(90deg, ${A_ACCENT}, #ec4899)` }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`${A_ACCENT}13`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{m.icon}</div>
                <Pill color={A_ACCENT}>Module 5</Pill>
              </div>
              <div style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:15, marginBottom:5 }}>{m.title}</div>
              <div style={{ fontSize:11.5, color:'#666', lineHeight:1.5, marginBottom:12 }}>{m.desc}</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:5, marginBottom:14 }}>
                {m.points.map(p => (
                  <li key={p} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#4b5563' }}>
                    <Dot color={A_ACCENT} size={5} /> {p}
                  </li>
                ))}
              </ul>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#666', marginBottom:5 }}>
                <span>Progress</span>
                <strong style={{ color:A_ACCENT }}>{m.progress}%</strong>
              </div>
              <div style={{ height:5, background:'#f3f3ef', borderRadius:3, overflow:'hidden' }}>
                <div style={{ width:`${m.progress}%`, height:'100%', background:`linear-gradient(90deg, ${A_ACCENT}, #ec4899)`, borderRadius:3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Signups */}
        {stats?.recentUsers?.length > 0 && (
          <div style={{ background:'#fff', borderRadius:18, padding:'20px 22px', border:'1px solid #ececec' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontFamily:'Sora,sans-serif', fontSize:15, fontWeight:700 }}>Recent Signups</div>
              <Pill color={A_ACCENT}>+{stats.recentUsers.length} recent</Pill>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {stats.recentUsers.map((u,i) => {
                const c = u.role==='candidate' ? '#ea580c' : '#16a34a';
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 0', borderBottom: i < stats.recentUsers.length-1 ? '1px solid #f3f3ef' : 'none' }}>
                    <Avatar name={u.name} size={34} bg={c} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, marginBottom:2 }}>{u.name}</div>
                      <div style={{ fontSize:11, color:'#888', display:'inline-flex', alignItems:'center', gap:6 }}>
                        <span style={{ padding:'1px 6px', borderRadius:5, background:`${c}15`, color:c, fontWeight:600, fontSize:9.5 }}>{u.role}</span>
                        <span>{u.email}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:10.5, color:'#888' }}>{new Date(u.createdAt).toLocaleDateString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}