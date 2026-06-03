//  Desktop layout for CandidateDashboard
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Bookmark, FileText, User,
  ChevronRight, MapPin, Search, Award,
  Star, CheckCircle, Clock, ArrowRight,
} from 'lucide-react';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import SafeAvatar from '../../../../components/ui/SafeAvatar';
import CandidateAIWidget from '../../../../components/ai/CandidateAIWidget';
import { ROUTES } from '../../../../constants/routes';
import { C, STATUS_CONFIG as STATUS, timeAgo } from './constants';
import ProgressRing from './ProgressRing';
import Sparkline from './Sparkline';

// Avatar helper
function Avatar({ profile, size = 44, border = '2px solid rgba(255,255,255,0.4)' }) {
  const navigate = useNavigate();
  return (
    <SafeAvatar
      onClick={() => navigate(ROUTES.PROFILE)} src={profile?.photo}
      name={profile?.name || 'U'} alt="avatar"
      style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border, flexShrink:0 }}
      fallbackStyle={{ width:size, height:size, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:size*0.38, border, flexShrink:0 }}
    />
  );
}

export default function DesktopDashboard({
  profile, applications, savedCount,
  shortlisted, hired, completion, jobs,
  appTrend, savedTrend, shortTrend, hiredTrend,
}) {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>

        {/* Hero */}
        <section style={{ background:'linear-gradient(135deg, #7c1d06 0%, #c2410c 35%, #ea580c 65%, #f97316 85%, #fbbf24 100%)', padding:'64px 56px 76px', position:'relative', overflow:'hidden', borderRadius:24, margin:'0 16px' }}>
          <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-60, left:60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.2) 0%, transparent 40%)', pointerEvents:'none' }} />
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:52 }}>

            {/* Left: Avatar + Identity */}
            <div style={{ display:'flex', alignItems:'center', gap:28 }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <Avatar profile={profile} size={100} border="3px solid rgba(255,255,255,0.55)" />
                {profile?.openToWork && (
                  <span style={{ position:'absolute', bottom:2, right:2, background:'#22c55e', color:'#fff', fontSize:9, fontWeight:800, borderRadius:9999, padding:'3px 7px', border:'2px solid #fff', letterSpacing:'0.3px' }}>OPEN</span>
                )}
              </div>
              <div>
                <p style={{ color:'rgba(255,255,255,0.72)', fontSize:14, margin:'0 0 8px', fontWeight:500 }}>Good to see you,</p>
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
              <div style={{ background:'rgba(0,0,0,0.22)', borderRadius:28, padding:'28px 34px', display:'flex', alignItems:'center', gap:26, backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.13)' }}>
                <ProgressRing value={completion} size={96} stroke={9} />
                <div>
                  <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, margin:'0 0 6px', fontWeight:500 }}>Profile Strength</p>
                  <p style={{ color:'#fff', fontWeight:800, fontSize:18, margin:'0 0 18px', letterSpacing:'-0.3px' }}>
                    {completion < 40 ? 'Build your profile' : completion < 70 ? 'Keep going!' : completion < 90 ? 'Almost done!' : 'Outstanding!'}
                  </p>
                  <button onClick={() => navigate(ROUTES.PROFILE)} style={{ background:'rgba(255,255,255,0.92)', color:'#c2410c', border:'none', borderRadius:12, padding:'11px 22px', fontWeight:800, fontSize:13, cursor:'pointer' }}>
                    Complete Profile →
                    </button>
                </div>
              </div>
              <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ background:'#fff', color:C.primary, border:'none', borderRadius:18, padding:'18px 32px', fontWeight:900, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', gap:11, boxShadow:'0 8px 28px rgba(0,0,0,0.2)', letterSpacing:'-0.3px', flexShrink:0 }}>
                <Search size={20} /> Browse Jobs <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section style={{ maxWidth:1200, margin:'0 auto', padding:'26px 32px 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[
              { label:'Total Applied',  value:applications.length, sub:'jobs applied',   Icon:FileText, color:C.primary, trend:appTrend,   id:'a'  },
              { label:'Jobs Saved',     value:savedCount,           sub:'bookmarked',     Icon:Bookmark, color:'#8b5cf6', trend:savedTrend, id:'s'  },
              { label:'Shortlisted',    value:shortlisted,          sub:'by companies',   Icon:Star,     color:'#0891b2', trend:shortTrend, id:'sh' },
              { label:'Hired',          value:hired,                sub:'offer received', Icon:Award,    color:'#059669', trend:hiredTrend, id:'h'  },
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

        {/* Main Content */}
        <main style={{ maxWidth:1200, margin:'0 auto', padding:'22px 32px 48px', display:'grid', gridTemplateColumns:'1fr 360px', gap:22 }}>

          {/* Left Column */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Quick Actions */}
            <div style={{ background:'#fff', borderRadius:20, padding:'26px', boxShadow:'0 1px 5px rgba(0,0,0,0.06)', border:`1px solid ${C.gray100}` }}>
              <h2 style={{ fontSize:17, fontWeight:800, color:C.gray900, margin:'0 0 18px', letterSpacing:'-0.3px' }}>Quick Actions</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                {[
                  { label:'Browse Jobs',  desc:'Find new roles',               Icon:Search,   route:ROUTES.PUBLIC_JOBS,            color:C.primary },
                  { label:'Saved Jobs',   desc:`${savedCount} saved`,          Icon:Bookmark, route:ROUTES.SAVED_JOBS,             color:'#8b5cf6' },
                  { label:'Applications', desc:`${applications.length} total`, Icon:FileText, route:ROUTES.CANDIDATE_APPLICATIONS, color:'#0891b2' },
                  { label:'My Profile',   desc:`${completion}% complete`,      Icon:User,     route:ROUTES.PROFILE,                color:'#059669' },
                ].map(({ label, desc, Icon, route, color }) => (
                  <button key={label} onClick={() => navigate(route)}
                    style={{ background:`${color}08`, border:`1px solid ${color}22`, borderRadius:16, padding:'18px 14px', display:'flex', flexDirection:'column', alignItems:'flex-start', gap:10, cursor:'pointer', textAlign:'left', transition:'box-shadow 0.15s, border-color 0.15s' }}
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
                            {app.job?.postedBy?.companyName || '\u2014'}
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

          {/* Right Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

            {/* Profile Strength Card */}
            <div style={{ background:C.grad, borderRadius:22, padding:'24px', boxShadow:'0 6px 28px rgba(194,65,12,0.28)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <h3 style={{ color:'#fff', fontWeight:900, fontSize:16, margin:0, letterSpacing:'-0.3px' }}>Profile Strength</h3>
                <ProgressRing value={completion} size={64} stroke={6} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { label:'Photo uploaded',  done:!!profile?.photo,             points:10 },
                  { label:'Headline added',  done:!!profile?.headline,          points:10 },
                  { label:'Skills listed',   done:!!profile?.skills?.length,    points:15 },
                  { label:'Resume uploaded', done:!!profile?.resumeUrl,         points:20 },
                  { label:'Bio written',     done:!!profile?.bio,               points:10 },
                  { label:'Education added', done:!!profile?.education?.length, points:10 },
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
                        {job.postedBy?.companyName || '\u2014'}{job.location && ` \u00b7 ${job.location}`}
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