// CandidateDashboard

import { useEffect, useState, useCallback } from 'react';
import { useNavigate }       from 'react-router-dom';
import { useAuth }           from '../../context/AuthContext';
import { ROUTES }            from '../../constants/routes';
import { API }               from '../../services/authService';
import { API_ENDPOINTS }     from '../../constants/api';
import { getAllJobs }         from '../../services/jobService';
import { getMyApplications } from '../../services/applicationService';
import { getSavedJobIds }    from '../../services/savedJobService';
import Sparkline             from '../../components/charts/Sparkline';
import ProgressRing          from '../../components/charts/ProgressRing';

const C_ACCENT = '#ea580c';
const C_DEEP   = '#c2410c';

// ── Profile completion calculator ──────────────────────
function calcCompletion(profile) {
  if (!profile) return 0;
  const checks = [
    !!profile.name, !!profile.headline, !!profile.bio,
    !!profile.profilePhoto, !!profile.phone,
    !!(profile.skills?.length > 0),
    !!(profile.resume?.url),
    !!profile.linkedIn,
    !!(profile.educationList?.length > 0),
    !!(profile.workHistory?.length > 0),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ── Shared helper components ───────────────────────────
function Avatar({ name = '', size = 32, bg = C_ACCENT, src }) {
  const initial = name.charAt(0).toUpperCase() || '?';
  if (src) return (
    <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38, fontFamily: 'Sora, sans-serif',
      flexShrink: 0,
    }}>{initial}</div>
  );
}

function Pill({ children, color = C_ACCENT }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 8, fontSize: 10.5,
      fontWeight: 700, background: `${color}18`, color,
    }}>{children}</span>
  );
}

function Dot({ color = '#22c55e', size = 7 }) {
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color }} />;
}

export default function CandidateDashboard() {

  const { user, profile, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab,  setActiveTab]  = useState('overview');
  const [stats,      setStats]      = useState({ apps: 0, shortlisted: 0, saved: 0, reviewing: 0 });
  const [recommended,setRecommended]= useState([]);
  const [activity,   setActivity]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  const name       = profile?.name || user?.name || 'Candidate';
  const initial    = name.charAt(0).toUpperCase();
  const photoUrl   = profile?.profilePhoto
    ? `${import.meta.env.VITE_API_URL}${profile.profilePhoto}` : null;
  const completion = calcCompletion(profile);
  const skills     = profile?.skills?.map(s => typeof s === 'string' ? s : s?.name).filter(Boolean) || [];

  const fetchData = useCallback(async () => {
    try {
      const [apps, savedIds, jobs] = await Promise.all([
        getMyApplications(),
        getSavedJobIds(),
        getAllJobs({ limit: 3 }),
      ]);

      const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
      const reviewing   = apps.filter(a => a.status === 'reviewing').length;

      setStats({
        apps:        apps.length,
        shortlisted,
        saved:       savedIds.length,
        reviewing,
      });

      // Build activity from real applications
      const recentActs = apps.slice(0, 4).map(a => ({
        txt:  `You applied to ${a.job?.title || 'a job'}`,
        time: new Date(a.createdAt).toLocaleDateString(),
        type: 'apply',
      }));
      setActivity(recentActs);

      // Recommended jobs
      setRecommended(jobs.data?.slice(0, 3) || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const statCards = [
    { label: 'Applications', value: stats.apps,        sub: `${stats.reviewing} reviewing`, trend: [0,1,2,3,4,5,stats.apps],        icon: '📤' },
    { label: 'Shortlisted',  value: stats.shortlisted, sub: 'candidates',                   trend: [0,0,1,1,2,2,stats.shortlisted],  icon: '⭐' },
    { label: 'Under Review', value: stats.reviewing,   sub: 'awaiting feedback',             trend: [0,1,1,2,2,3,stats.reviewing],    icon: '🎯' },
    { label: 'Saved Jobs',   value: stats.saved,       sub: 'bookmarked',                   trend: [0,1,2,3,4,5,stats.saved],        icon: '🔖' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#fafaf7',
      fontFamily: 'Inter, sans-serif', color: '#0a0a14',
    }}>

      {/* ── Top Nav ── */}
      <header style={{
        height: 64, background: '#fff', borderBottom: '1px solid #ececec',
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 16,
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate(ROUTES.CANDIDATE_DASHBOARD)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: C_ACCENT, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 800,
            fontSize: 14, fontFamily: 'Sora, sans-serif',
          }}>HP</div>
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px' }}>
            HirePortal
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 100, marginLeft: 6,
            background: `${C_ACCENT}15`, color: C_ACCENT, fontSize: 11, fontWeight: 700,
          }}>
            <Dot color={C_ACCENT} size={6} /> Candidate
          </span>
        </div>

        {/* Tab Nav */}
        <nav style={{ display: 'flex', gap: 2, marginLeft: 16 }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'jobs',     label: 'Browse Jobs' },
            { id: 'apps',     label: 'Applications', badge: stats.apps || null },
            { id: 'saved',    label: 'Saved',        badge: stats.saved || null },
          ].map(n => (
            <button key={n.id} onClick={() => {
              setActiveTab(n.id);
              if (n.id === 'jobs')  navigate(ROUTES.PUBLIC_JOBS);
              if (n.id === 'apps')  navigate(ROUTES.CANDIDATE_APPLICATIONS);
              if (n.id === 'saved') navigate(ROUTES.SAVED_JOBS);
            }} style={{
              padding: '6px 13px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === n.id ? '#0a0a14' : 'transparent',
              color: activeTab === n.id ? '#fff' : '#4b5563',
              fontSize: 13, fontWeight: activeTab === n.id ? 600 : 500,
              fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {n.label}
              {n.badge ? (
                <span style={{
                  background: activeTab === n.id ? C_ACCENT : '#fef2f2',
                  color: activeTab === n.id ? '#fff' : C_ACCENT,
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                }}>{n.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            <Avatar name={name} size={34} bg={C_ACCENT} src={photoUrl} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 10, color: '#888' }}>Candidate</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            padding: '7px 14px', borderRadius: 8, background: C_ACCENT,
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter, sans-serif',
          }}>Logout</button>
        </div>
      </header>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px 48px' }}>

        {/* HERO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, marginBottom: 20 }}>

          {/* Hero left */}
          <div style={{
            background: `linear-gradient(125deg, ${C_DEEP} 0%, ${C_ACCENT} 55%, #f59e0b 110%)`,
            borderRadius: 24, padding: '28px 32px', color: '#fff',
            position: 'relative', overflow: 'hidden', minHeight: 220,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200,
              borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }} />
            <div style={{ position: 'absolute', right: -10, top: -10, width: 120, height: 120,
              borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <Avatar name={name} size={60} bg="rgba(255,255,255,0.2)" src={photoUrl} />
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Welcome back,</div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 28,
                    letterSpacing: '-1px', lineHeight: 1.1 }}>{name}</div>
                  {profile?.headline && (
                    <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{profile.headline}</div>
                  )}
                </div>
              </div>

              {skills.length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.65,
                    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Skills</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {skills.slice(0, 8).map(s => (
                      <span key={s} style={{
                        padding: '3px 10px', borderRadius: 100, fontSize: 11,
                        background: 'rgba(255,255,255,0.18)', color: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}>{s}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, position: 'relative', marginTop: 16 }}>
              <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: '#fff', color: C_DEEP, border: 'none', cursor: 'pointer',
              }}>⌕ Browse Jobs →</button>
              <button onClick={() => navigate(ROUTES.PROFILE)} style={{
                padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
              }}>Update Profile</button>
            </div>
          </div>

          {/* Hero right — profile ring */}
          <div style={{
            background: '#0a0a14', color: '#fff', borderRadius: 24,
            padding: '24px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140,
              borderRadius: '50%', background: `radial-gradient(circle, ${C_ACCENT}55, transparent 70%)` }} />

            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 10, color: '#fed7aa', fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Profile Strength</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <ProgressRing value={completion} size={80} stroke={7} color={C_ACCENT} track="rgba(255,255,255,0.08)" />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 20,
                  }}>{completion}%</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                    {completion >= 90 ? 'Almost perfect!' : completion >= 70 ? 'Looking good!' : 'Keep going!'}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                    {completion < 100 ? 'Complete your profile\nto attract recruiters' : 'Profile complete!'}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  ['Name added',       !!profile?.name],
                  ['Headline set',     !!profile?.headline],
                  ['Resume uploaded',  !!profile?.resume?.url],
                  ['Skills added',     !!(profile?.skills?.length > 0)],
                  ['Education added',  !!(profile?.educationList?.length > 0)],
                ].map(([text, done], i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5,
                    color: done ? '#4ade80' : 'rgba(255,255,255,0.45)',
                  }}>
                    <span>{done ? '✓' : '○'}</span>
                    <span style={{ fontWeight: done ? 500 : 400 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigate(ROUTES.PROFILE)} style={{
              marginTop: 14, padding: '10px 14px', borderRadius: 10,
              background: C_ACCENT, color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 12.5, fontWeight: 600, fontFamily: 'Inter, sans-serif',
            }}>Complete profile →</button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 18, padding: '18px 18px 14px',
              border: '1px solid #ececec',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${C_ACCENT}13`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 15,
                }}>{s.icon}</div>
                <Sparkline data={s.trend} color={C_ACCENT} width={60} height={24} />
              </div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 30, fontWeight: 800,
                letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12.5, color: '#0a0a14', fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: C_ACCENT, fontWeight: 600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* BOTTOM — 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 }}>

          {/* Left — Quick actions + Recommended */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Quick actions */}
            <div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700,
                letterSpacing: '-0.3px', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {[
                  { title: 'My Profile',    desc: 'Update skills and resume',  icon: '👤', route: ROUTES.PROFILE },
                  { title: 'Job Listings',  desc: 'Browse open positions',     icon: '💼', route: ROUTES.PUBLIC_JOBS, badge: 'Browse' },
                  { title: 'Saved Jobs',    desc: 'Bookmarked to apply later', icon: '🔖', route: ROUTES.SAVED_JOBS, badge: stats.saved || null },
                  { title: 'Applications', desc: 'Track submitted apps',      icon: '📋', route: ROUTES.CANDIDATE_APPLICATIONS, badge: stats.apps || null },
                ].map((a, i) => (
                  <div key={i} onClick={() => navigate(a.route)} style={{
                    background: '#fff', borderRadius: 16, padding: '18px',
                    border: '1px solid #ececec', cursor: 'pointer',
                    position: 'relative', overflow: 'hidden',
                    transition: 'transform .15s, border-color .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = C_ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#ececec'; }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: C_ACCENT, opacity: 0.7 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: `${C_ACCENT}13`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 16,
                      }}>{a.icon}</div>
                      {a.badge && <Pill color={C_ACCENT}>{a.badge}</Pill>}
                    </div>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: '#666', lineHeight: 1.5, marginBottom: 10 }}>{a.desc}</div>
                    <div style={{ color: C_ACCENT, fontSize: 11.5, fontWeight: 600 }}>Open →</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended jobs */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '20px 22px', border: '1px solid #ececec' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 15, fontWeight: 700 }}>Recommended for you</div>
                  {skills.length > 0 && (
                    <div style={{ fontSize: 11.5, color: '#888', marginTop: 2 }}>
                      Based on your skills · {skills.slice(0,3).join(', ')}
                    </div>
                  )}
                </div>
                <button onClick={() => navigate(ROUTES.PUBLIC_JOBS)} style={{
                  background: 'transparent', color: C_ACCENT, border: 'none',
                  cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                }}>View all →</button>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ height: 60, background: '#f3f3ef', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />
                  ))}
                </div>
              ) : recommended.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#888', fontSize: 13 }}>
                  No jobs available right now
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recommended.map(job => (
                    <div key={job._id} onClick={() => navigate(ROUTES.JOB_DETAILS.replace(':slug', job.slug || job._id))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                        background: '#fafaf7', borderRadius: 12, cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f3f3ef'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fafaf7'}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: C_ACCENT, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff', fontWeight: 700,
                        fontSize: 16, flexShrink: 0,
                      }}>
                        {job.postedBy?.companyName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#666' }}>
                          {job.postedBy?.companyName || '—'} · {job.location} ·
                          <span style={{ color: C_ACCENT, fontWeight: 600 }}> {job.jobType}</span>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); navigate(ROUTES.JOB_DETAILS.replace(':slug', job.slug || job._id)); }}
                        style={{
                          padding: '6px 14px', borderRadius: 8, background: C_ACCENT,
                          color: '#fff', border: 'none', cursor: 'pointer',
                          fontSize: 11.5, fontWeight: 600, flexShrink: 0,
                        }}>Apply</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar — Activity */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1px solid #ececec' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700 }}>Recent Activity</div>
              <Dot color="#22c55e" />
            </div>

            {activity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#888', fontSize: 12 }}>
                No activity yet.<br/>Start applying to jobs!
              </div>
            ) : (
              <div>
                {activity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: C_ACCENT, marginTop: 5,
                      }} />
                      {i < activity.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: '#ececec', margin: '3px 0' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 12 }}>
                      <div style={{ fontSize: 12, lineHeight: 1.45, color: '#1a1a24' }}>{a.txt}</div>
                      <div style={{ fontSize: 10.5, color: '#888', marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}