//  Mobile layout for CandidateDashboard
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Bookmark, FileText, User,
  LogOut, ChevronRight, MapPin, Building2, Search, Award, Star,
} from 'lucide-react';
import SafeAvatar from '../../../../components/ui/SafeAvatar';
import CandidateAIWidget from '../../../../components/ai/CandidateAIWidget';
import { ROUTES } from '../../../../constants/routes';
import { C, STATUS_CONFIG as STATUS, timeAgo } from './constants';
import ProgressRing from './ProgressRing';
import Sparkline from './Sparkline';

// ── Mobile Bottom Tab Bar ──
const MOB_TABS = [
  { key:'overview', label:'Home',    Icon: LayoutDashboard },
  { key:'jobs',     label:'Jobs',    Icon: Briefcase },
  { key:'saved',    label:'Saved',   Icon: Bookmark },
  { key:'apps',     label:'Applied', Icon: FileText },
  { key:'profile',  label:'Profile', Icon: User },
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

// ── Avatar helper ──
function Avatar({ profile, size = 44, border = '2px solid rgba(255,255,255,0.4)', onClick }) {
  return (
    <SafeAvatar
      onClick={onClick} src={profile?.photo}
      name={profile?.name || 'U'} alt="avatar"
      style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', border, flexShrink:0 }}
      fallbackStyle={{ width:size, height:size, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:size*0.38, border, flexShrink:0 }}
    />
  );
}

export default function MobileDashboard({
  profile, activeTab, applications, savedCount,
  shortlisted, hired, completion,
  appTrend, savedTrend, shortTrend, hiredTrend,
  handleTab, handleLogout,
}) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight:'100vh', background:C.gray50, paddingBottom:72, fontFamily:'system-ui,-apple-system,sans-serif' }}>

      {/* Header */}
      <header style={{ background:'#fff', borderBottom:`1px solid ${C.gray200}`, height:56, padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:C.grad, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Briefcase size={16} color="#fff" />
          </div>
          <span style={{ fontWeight:900, fontSize:17, color:C.gray900, letterSpacing:'-0.3px' }}>HirePortal</span>
          <span style={{ background:`${C.primary}15`, color:C.primary, fontSize:9, fontWeight:800, borderRadius:5, padding:'2px 6px', letterSpacing:'0.5px', border:`1px solid ${C.primary}25` }}>CANDIDATE</span>
        </div>
        <Avatar profile={profile} size={34} border={`2px solid ${C.primary}`} onClick={() => navigate(ROUTES.PROFILE)} />
      </header>

      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #7c1d06 0%, #c2410c 35%, #ea580c 65%, #f97316 85%, #fbbf24 100%)', padding:'28px 20px 36px', position:'relative', overflow:'hidden', borderRadius:20, margin:'12px 12px 0' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-30, left:20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
          <Avatar profile={profile} size={62} border="3px solid rgba(255,255,255,0.5)" onClick={() => navigate(ROUTES.PROFILE)} />
          <div style={{ minWidth:0 }}>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:12, margin:'0 0 3px', fontWeight:500 }}>Welcome back</p>
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
        <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:18, padding:'16px 18px', display:'flex', alignItems:'center', gap:16, border:'1px solid rgba(255,255,255,0.13)' }}>
          <ProgressRing value={completion} size={70} stroke={7} />
          <div style={{ flex:1 }}>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:11, margin:'0 0 4px' }}>Profile Strength</p>
            <p style={{ color:'#fff', fontWeight:700, fontSize:13, margin:'0 0 10px', lineHeight:1.3 }}>
              {completion < 40 ? 'Just starting!' : completion < 70 ? 'Good progress!' : completion < 90 ? 'Almost complete!' : 'Excellent profile!'}
            </p>
            <button onClick={() => navigate(ROUTES.PROFILE)} style={{ background:'rgba(255,255,255,0.9)', border:'none', borderRadius:9, color:'#c2410c', fontSize:11, fontWeight:700, padding:'6px 14px', cursor:'pointer' }}>
                Complete Profile
                </button>
          </div>
        </div>
      </section>

      {/* Stats 2x2 */}
      <section style={{ padding:'14px 14px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { label:'Applied',     value:applications.length, color:C.primary, Icon:FileText, trend:appTrend,   id:'a'  },
            { label:'Saved',       value:savedCount,           color:'#8b5cf6', Icon:Bookmark, trend:savedTrend, id:'s'  },
            { label:'Shortlisted', value:shortlisted,          color:'#0891b2', Icon:Star,     trend:shortTrend, id:'sh' },
            { label:'Hired',       value:hired,                color:'#059669', Icon:Award,    trend:hiredTrend, id:'h'  },
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

      {/* Quick Actions */}
      <section style={{ padding:'14px 14px 0' }}>
        <p style={{ fontSize:13, fontWeight:700, color:C.gray700, margin:'0 0 10px' }}>Quick Actions</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { label:'Browse Jobs',  Icon:Search,   route:ROUTES.PUBLIC_JOBS,            color:C.primary },
            { label:'My Profile',   Icon:User,     route:ROUTES.PROFILE,                color:'#8b5cf6' },
            { label:'Saved Jobs',   Icon:Bookmark, route:ROUTES.SAVED_JOBS,             color:'#0891b2' },
            { label:'Applications', Icon:FileText, route:ROUTES.CANDIDATE_APPLICATIONS, color:'#059669' },
          ].map(({ label, Icon, route, color }) => (
            <button key={label} onClick={() => navigate(route)} style={{ background:'#fff', border:`1px solid ${C.gray100}`, borderRadius:14, padding:'14px 12px', display:'flex', alignItems:'center', gap:10, cursor:'pointer', textAlign:'left' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:`${color}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={18} color={color} />
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:C.gray800, lineHeight:1.3 }}>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Applications */}
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
                <div key={app._id} style={{ background:'#fff', borderRadius:14, padding:'13px 14px', border:`1px solid ${C.gray100}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:700, fontSize:13, color:C.gray900, margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {app.job?.title || 'Untitled Job'}
                      </p>
                      <p style={{ fontSize:11, color:C.gray400, margin:0, display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
                        <span style={{ display:'flex', alignItems:'center', gap:3 }}>
                          <Building2 size={10} />{app.job?.postedBy?.companyName || '\u2014'}
                        </span>
                        {app.job?.location && (
                          <span style={{ display:'flex', alignItems:'center', gap:3 }}>
                            <MapPin size={10} />{app.job.location}
                          </span>
                        )}
                      </p>
                    </div>
                    <span style={{ background:s.bg, color:s.color, fontSize:10, fontWeight:700, borderRadius:7, padding:'4px 8px', flexShrink:0 }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize:10, color:C.gray300, margin:'7px 0 0', fontWeight:500 }}>{timeAgo(app.createdAt)}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* AI Widget */}
      <section style={{ padding:'14px 14px 0' }}>
        <CandidateAIWidget profile={profile} />
      </section>

      {/* Logout */}
      <section style={{ padding:'14px 14px 0' }}>
        <button onClick={handleLogout} style={{ width:'100%', background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:14, padding:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, color:'#ef4444', fontSize:14, fontWeight:700, cursor:'pointer' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </section>

      <MTabBar active={activeTab} onTab={handleTab} savedCount={savedCount} appCount={applications.length} />
    </div>
  );
}