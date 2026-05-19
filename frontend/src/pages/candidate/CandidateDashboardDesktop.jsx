// CandidateDashboardDesktop.jsx
// Orange theme — reference layout exactly
// Lucide icons — no emojis — real API numbers

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bookmark, FileText, User, ChevronRight,
  MapPin, Building2, CheckCircle, Clock, Award,
  Star, ArrowRight, Briefcase,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../services/applicationService';
import { getSavedJobIds } from '../../services/savedJobService';
import { getAllJobs } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';

const PRIMARY = '#ea580c';
const DEEP    = '#c2410c';
const DARK    = '#0a0a14';
const GRAD    = 'linear-gradient(125deg, #c2410c 0%, #ea580c 50%, #f59e0b 110%)';

const STATUS = {
  applied     : { label:'Applied',     color:'#92400e', bg:'#fef3c7' },
  reviewing   : { label:'Reviewing',   color:'#1e40af', bg:'#dbeafe' },
  shortlisted : { label:'Shortlisted', color:'#5b21b6', bg:'#ede9fe' },
  rejected    : { label:'Rejected',    color:'#991b1b', bg:'#fee2e2' },
  hired       : { label:'Hired',       color:'#065f46', bg:'#d1fae5' },
};

function timeAgo(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date)) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d/30)}mo ago`;
}

function calcPct(p) {
  if (!p) return 0;
  const f = [p.name, p.headline, p.bio, p.photo, p.phone, p.skills?.length, p.resumeUrl, p.linkedin, p.education?.length, p.workHistory?.length];
  return Math.round((f.filter(Boolean).length / f.length) * 100);
}

function Spark({ data = [], color = PRIMARY, w = 64, h = 28 }) {
  if (!data || data.length < 2) return null;
  const mx = Math.max(...data), mn = Math.min(...data), r = mx - mn || 1;
  const pts = data.map((v, i) => ({ x: +((i / (data.length - 1)) * w).toFixed(1), y: +((h - 4) - ((v - mn) / r) * (h - 8)).toFixed(1) }));
  const line = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const gid = `g${color.replace('#', '')}`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill={color} />
    </svg>
  );
}

function Ring({ value = 0, size = 86, stroke = 8 }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const off = circ - (Math.min(100, value) / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={PRIMARY} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.21, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}%</span>
      </div>
    </div>
  );
}

export default function CandidateDashboardDesktop() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [apps, setApps] = useState([]);
  const [saved, setSaved] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return; ref.current = true;
    (async () => {
      try {
        const [a, ids, jr] = await Promise.all([getMyApplications(), getSavedJobIds(), getAllJobs({ limit: 5 })]);
        setApps(Array.isArray(a) ? a : []);
        setSaved(Array.isArray(ids) ? ids.length : 0);
        setJobs(Array.isArray(jr) ? jr : (jr?.jobs || []));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const pct = calcPct(profile);
  const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
  const hired = apps.filter(a => a.status === 'hired').length;

  if (loading) return (
    <DashboardLayout>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 38, height: 38, border: `3px solid #fed7aa`, borderTopColor: PRIMARY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </DashboardLayout>
  );

  const STATS = [
    { label: 'Applications', value: apps.length,  sub: 'jobs applied',   Icon: FileText,  color: PRIMARY,   trend: [2, 3, 4, 5, 6, 9, apps.length] },
    { label: 'Shortlisted',  value: shortlisted,  sub: 'by companies',   Icon: Star,      color: '#8b5cf6', trend: [0, 1, 1, 2, 2, 3, shortlisted] },
    { label: 'Hired',        value: hired,         sub: 'offer received', Icon: Award,     color: '#059669', trend: [0, 0, 0, 1, 1, 1, hired] },
    { label: 'Saved Jobs',   value: saved,         sub: 'bookmarked',     Icon: Bookmark,  color: '#0891b2', trend: [1, 2, 3, 4, 5, 7, saved] },
  ];

  const QUICK = [
    { label: 'My Profile',   desc: 'Update skills and resume',     Icon: User,      route: ROUTES.PROFILE,                color: PRIMARY   },
    { label: 'Browse Jobs',  desc: 'Find new opportunities',       Icon: Briefcase, route: ROUTES.PUBLIC_JOBS,            color: '#8b5cf6' },
    { label: 'Saved Jobs',   desc: `${saved} bookmarked`,          Icon: Bookmark,  route: ROUTES.SAVED_JOBS,             color: '#0891b2' },
    { label: 'Applications', desc: `${apps.length} total`,         Icon: FileText,  route: ROUTES.CANDIDATE_APPLICATIONS, color: '#059669' },
  ];

  const CHECKLIST = [
    { label: 'Resume uploaded',  done: !!profile?.resumeUrl },
    { label: 'Skills tagged',    done: !!profile?.skills?.length },
    { label: 'Education added',  done: !!profile?.education?.length },
    { label: 'Headline written', done: !!profile?.headline },
    { label: 'Photo uploaded',   done: !!profile?.photo },
  ];

  return (
    <DashboardLayout>
      <div style={{ background: '#fafaf9', minHeight: '100vh', fontFamily: 'Inter,system-ui,sans-serif' }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', padding: '28px 32px 48px' }}>

          {/* ══ HERO ══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18, marginBottom: 20 }}>

            {/* Left — gradient */}
            <div style={{ background: GRAD, borderRadius: 24, padding: '28px 32px', color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <svg style={{ position: 'absolute', right: -30, top: -30, width: 280, height: 280, opacity: 0.15 }} viewBox="0 0 280 280">
                <circle cx="140" cy="140" r="130" stroke="#fff" strokeWidth="1" fill="none" />
                <circle cx="140" cy="140" r="90" stroke="#fff" strokeWidth="1" fill="none" />
                <circle cx="140" cy="140" r="50" stroke="#fff" strokeWidth="1" fill="none" />
              </svg>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {profile?.photo
                      ? <img src={profile.photo} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }} />
                      : <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26, color: '#fff', border: '2px solid rgba(255,255,255,0.4)' }}>{(profile?.name || 'U')[0].toUpperCase()}</div>
                    }
                    <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: '#22c55e', border: '2px solid #ea580c' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, opacity: 0.85, margin: '0 0 3px' }}>Welcome back,</p>
                    <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1.05, margin: '0 0 3px', textTransform: 'capitalize' }}>{profile?.name || 'Candidate'}</h1>
                    {profile?.headline && <p style={{ fontSize: 12, opacity: 0.78, margin: 0 }}>{profile.headline}</p>}
                  </div>
                </div>
                {profile?.skills?.length > 0 && (
                  <>
                    <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 8px' }}>Your skills</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {profile.skills.slice(0, 8).map((sk, i) => {
                        const lb = typeof sk === 'string' ? sk : sk?.name || '';
                        return lb ? <span key={i} style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 11, background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.22)', fontWeight: 500 }}>{lb}</span> : null;
                      })}
                    </div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', marginTop: 18 }}>
                <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#fff', color: DEEP, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <Search size={14} /> Browse Jobs
                </button>
                <button onClick={() => navigate(ROUTES.PROFILE)} style={{ padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                  Update Profile
                </button>
              </div>
            </div>

            {/* Right — dark profile card */}
            <div style={{ background: DARK, color: '#fff', borderRadius: 24, padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: `radial-gradient(circle, ${PRIMARY}55, transparent 70%)` }} />
              <div style={{ position: 'relative' }}>
                <p style={{ fontSize: 11, color: '#fed7aa', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 14px' }}>Profile Strength</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                  <Ring value={pct} size={86} stroke={8} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 17, margin: '0 0 4px' }}>{pct < 40 ? 'Just starting!' : pct < 70 ? 'Keep going!' : pct < 90 ? 'Almost done!' : 'Outstanding!'}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 }}>Complete your profile to attract more companies</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {CHECKLIST.map(({ label, done }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {done ? <CheckCircle size={11} color={PRIMARY} /> : <Clock size={10} color="rgba(255,255,255,0.4)" />}
                      </div>
                      <span style={{ fontSize: 12, color: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)', textDecoration: done ? 'line-through' : 'none' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => navigate(ROUTES.PROFILE)} style={{ marginTop: 16, padding: '10px', borderRadius: 10, background: PRIMARY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, width: '100%', position: 'relative' }}>Complete Profile →</button>
            </div>
          </div>

          {/* ══ STATS ══ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            {STATS.map(({ label, value, sub, Icon, color, trend }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 18, padding: '18px 18px 14px', border: '1px solid #ececec' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}13`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={color} />
                  </div>
                  <Spark data={trend} color={color} w={64} h={28} />
                </div>
                <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1, margin: '0 0 5px', color: '#0a0a14' }}>{value}</p>
                <p style={{ fontSize: 12.5, color: '#0a0a14', fontWeight: 500, margin: '0 0 3px' }}>{label}</p>
                <p style={{ fontSize: 11, color, fontWeight: 600, margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* ══ MAIN 2-COL ══ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Quick Actions */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0a0a14', margin: 0, letterSpacing: '-0.3px' }}>Quick Actions</h2>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>Jump straight to what you need</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {QUICK.map(({ label, desc, Icon, route, color }) => (
                    <div key={label} onClick={() => navigate(route)}
                      style={{ background: '#fff', borderRadius: 16, padding: '18px', border: '1px solid #ececec', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'transform .15s, box-shadow .15s, border-color .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#ececec'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, opacity: 0.7 }} />
                      <div style={{ marginBottom: 22, marginTop: 4 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}13`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={19} color={color} />
                        </div>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#0a0a14', margin: '0 0 5px', letterSpacing: '-0.2px' }}>{label}</p>
                      <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.5, margin: '0 0 10px' }}>{desc}</p>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color, fontSize: 12, fontWeight: 600 }}>Open <ArrowRight size={12} /></div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Applications list */}
              <section style={{ background: '#fff', borderRadius: 18, padding: '20px 22px', border: '1px solid #ececec' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0a0a14', margin: '0 0 2px', letterSpacing: '-0.3px' }}>My Applications</h2>
                    <p style={{ fontSize: 11.5, color: '#9ca3af', margin: 0 }}>{apps.length} total</p>
                  </div>
                  <button onClick={() => navigate(ROUTES.CANDIDATE_APPLICATIONS)} style={{ background: 'transparent', color: PRIMARY, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>View all <ChevronRight size={14} /></button>
                </div>
                {apps.length === 0
                  ? <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 14px' }}>No applications yet</p>
                      <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ background: PRIMARY, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Browse Jobs</button>
                    </div>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {apps.slice(0, 6).map((app, idx) => {
                        const s = STATUS[app.status] || STATUS.applied;
                        return (
                          <div key={app._id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px', background: idx % 2 === 0 ? '#fafaf9' : '#fff', borderRadius: 11 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${PRIMARY}13`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: 15, color: PRIMARY }}>
                              {(app.job?.title || 'J')[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 600, fontSize: 13.5, color: '#0a0a14', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job?.title || 'Untitled Job'}</p>
                              <p style={{ fontSize: 11.5, color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Building2 size={11} />{app.job?.postedBy?.companyName || '—'}
                                {app.job?.location && <><MapPin size={11} />{app.job.location}</>}
                              </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                              <span style={{ background: s.bg, color: s.color, fontSize: 10.5, fontWeight: 700, borderRadius: 7, padding: '3px 9px' }}>{s.label}</span>
                              <span style={{ fontSize: 10.5, color: '#9ca3af' }}>{timeAgo(app.createdAt)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </section>
            </div>

            {/* Right sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Activity feed */}
              <section style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1px solid #ececec' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0a0a14', margin: 0 }}>Recent Activity</h3>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px #dcfce7' }} />
                </div>
                {apps.length === 0
                  ? <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No activity yet</p>
                  : <div>
                      {apps.slice(0, 5).map((app, i, arr) => {
                        const s = STATUS[app.status] || STATUS.applied;
                        const c = { applied: '#ea580c', reviewing: '#1e40af', shortlisted: '#8b5cf6', hired: '#059669', rejected: '#dc2626' }[app.status] || PRIMARY;
                        return (
                          <div key={app._id} style={{ display: 'flex', gap: 11 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ width: 9, height: 9, borderRadius: '50%', background: c, marginTop: 5, boxShadow: `0 0 0 3px ${c}22`, flexShrink: 0 }} />
                              {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: '#ececec', marginTop: 3, marginBottom: 3 }} />}
                            </div>
                            <div style={{ flex: 1, paddingBottom: 12 }}>
                              <p style={{ fontSize: 12, color: '#1a1a24', margin: '0 0 2px', lineHeight: 1.4 }}>
                                {app.status === 'applied' ? 'You applied to ' : 'Status updated — '}
                                <strong>{app.job?.title || 'a job'}</strong>
                                {app.status !== 'applied' && <span style={{ color: c }}> {s.label}</span>}
                              </p>
                              <p style={{ fontSize: 10.5, color: '#9ca3af', margin: 0 }}>{timeAgo(app.createdAt)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </section>

              {/* Recommended jobs */}
              <section style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1px solid #ececec', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0a0a14', margin: 0 }}>Recommended Jobs</h3>
                  <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{ background: 'transparent', color: PRIMARY, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>View all →</button>
                </div>
                {jobs.length === 0
                  ? <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No jobs found</p>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {jobs.slice(0, 5).map(job => (
                        <div key={job._id} onClick={() => navigate(`/jobs/${job.slug || job._id}`)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#fafaf9', borderRadius: 11, cursor: 'pointer', transition: 'background .15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f3f3ef'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fafaf9'}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${PRIMARY}13`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: 15, color: PRIMARY }}>
                            {(job.postedBy?.companyName || 'J')[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: 13, color: '#0a0a14', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{job.postedBy?.companyName || '—'}{job.location ? ` · ${job.location}` : ''}</p>
                          </div>
                          <span style={{ background: `${PRIMARY}12`, color: PRIMARY, fontSize: 10, fontWeight: 700, borderRadius: 7, padding: '3px 8px', flexShrink: 0 }}>{job.jobType}</span>
                        </div>
                      ))}
                    </div>
                }
              </section>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}