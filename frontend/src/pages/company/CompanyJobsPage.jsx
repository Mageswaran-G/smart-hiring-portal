// CompanyJobsPage.jsx — Premium redesign
// Navy theme — #1e3a5f
// Full mobile + desktop support

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Briefcase, MapPin, Users, Pencil, Trash2,
  LayoutGrid, List, Clock, CheckCircle, FileText,
  XCircle, ChevronRight, Building2, PlusCircle, Sparkles,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getMyJobs, updateJobStatus, deleteJob } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { generateInterviewQuestions } from '../../services/ai/generationService';

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary : '#1e3a5f',
  accent  : '#3b82f6',
  light   : '#eff6ff',
  border  : '#bfdbfe',
  green   : '#059669',
  amber   : '#d97706',
  red     : '#dc2626',
  gray    : '#6b7280',
  gray50  : '#f9fafb',
  gray100 : '#f3f4f6',
  gray200 : '#e5e7eb',
  gray900 : '#111827',
  grad    : 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 60%, #1d4ed8 100%)',
};

// ─── Status config ────────────────────────────────────────────
const STATUS = {
  published : { label:'Published', color:C.green,  bg:'#d1fae5', border:'#6ee7b7', dot:C.green  },
  draft     : { label:'Draft',     color:C.amber,  bg:'#fef3c7', border:'#fde68a', dot:'#f59e0b'},
  closed    : { label:'Closed',    color:C.gray,   bg:C.gray100, border:C.gray200, dot:'#9ca3af'},
};

// ─── Helpers ──────────────────────────────────────────────────
function daysLeft(deadline) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline) - new Date()) / 86400000);
}
function formatDeadline(deadline) {
  if (!deadline) return 'No deadline';
  return new Date(deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

// ─── Sparkline ────────────────────────────────────────────────
function Sparkline({ data = [], color = C.primary, w = 60, h = 24 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: +((i / (data.length - 1)) * w).toFixed(1),
    y: +((h - 2) - ((v - min) / range) * (h - 4)).toFixed(1),
  }));
  const line = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  return (
    <svg width={w} height={h} style={{ display:'block' }}>
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, sub, color, Icon, trend }) {
  return (
    <div style={{ background:'#fff', borderRadius:16, padding:'16px 18px', border:`1px solid ${C.gray200}`, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={17} color={color} />
        </div>
        <Sparkline data={trend} color={color} />
      </div>
      <p style={{ fontWeight:800, fontSize:26, color:C.gray900, margin:'0 0 2px', lineHeight:1, letterSpacing:'-0.8px' }}>
        {value.toLocaleString()}
      </p>
      <p style={{ fontSize:12, color:C.gray900, fontWeight:600, margin:'0 0 1px' }}>{label}</p>
      <p style={{ fontSize:11, color:C.gray, margin:0 }}>{sub}</p>
    </div>
  );
}

// ─── Desktop Job Card ─────────────────────────────────────────
function JobCard({ job, onToggle, onDelete, onEdit, onViewApplicants, view, onGenerateQuestions }) {
  

  const st    = STATUS[job.status?.toLowerCase()] || STATUS.draft;
  const dl    = daysLeft(job.deadline);
  const isList = view === 'list';

  return (
    <div
      style={{
        background:'#fff', borderRadius:18, border:`1px solid ${C.gray200}`,
        overflow:'hidden', position:'relative',
        display: isList ? 'grid' : 'flex',
        gridTemplateColumns: isList ? '2fr 1fr 1fr 200px' : undefined,
        flexDirection: isList ? undefined : 'column',
        gap: isList ? 20 : 0,
        alignItems: isList ? 'center' : 'stretch',
        padding: isList ? '16px 24px' : 0,
        transition:'box-shadow 0.15s, transform 0.15s, border-color 0.15s',
        boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 28px ${C.primary}18`; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor=C.gray200; e.currentTarget.style.transform='translateY(0)'; }}
    >
      {/* Top accent bar — grid view only */}
      {!isList && (
        <div style={{ height:3, background: job.status === 'published' ? `linear-gradient(90deg, ${C.primary}, ${C.accent})` : job.status === 'draft' ? C.amber : C.gray }} />
      )}

      {/* Card body */}
      <div style={{ padding: isList ? 0 : '18px 20px', flex: isList ? undefined : 1, display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: isList ? 4 : 12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:9999, background:st.bg, border:`1px solid ${st.border}`, marginBottom:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:st.dot, display:'inline-block' }} />
              <span style={{ fontSize:10.5, fontWeight:700, color:st.color }}>{st.label}</span>
            </div>
            <h3 style={{ fontWeight:800, fontSize: isList ? 15 : 17, color:C.gray900, margin:0, lineHeight:1.2, letterSpacing:'-0.3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace: isList ? 'nowrap' : 'normal' }}>
              {job.title}
            </h3>
          </div>
          {!isList && (
            <button onClick={() => onDelete(job._id)} style={{ background:'transparent', border:'none', cursor:'pointer', color:C.gray, padding:'4px', borderRadius:6, flexShrink:0 }}>
              <XCircle size={16} />
            </button>
          )}
        </div>

        {/* Meta — grid view */}
        {!isList && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
            {[
              { Icon:MapPin,    val:job.location },
              { Icon:Briefcase, val:`${job.jobType} · ${job.workMode}` },
              { Icon:Users,     val:`${job.openings} opening${job.openings !== 1 ? 's' : ''}` },
              { Icon:FileText,  val:`${job.applicationsCount || 0} applied`, color:C.accent },
            ].map(({ Icon, val, color }, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <Icon size={13} color={color || C.gray} style={{ flexShrink:0 }} />
                <span style={{ fontSize:12, color: color || '#4b5563', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Applicant panel — grid view */}
        {!isList && (
          <div style={{ background:C.gray50, borderRadius:11, padding:'12px 14px', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
              <div>
                <p style={{ fontSize:10, color:C.gray, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', margin:'0 0 2px' }}>Applicants</p>
                <p style={{ fontWeight:800, fontSize:20, color:C.gray900, margin:0, letterSpacing:'-0.5px', lineHeight:1 }}>{job.applicationsCount || 0}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:10, color:C.gray, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', margin:'0 0 2px' }}>Deadline</p>
                <p style={{ fontSize:12, fontWeight:600, color:C.gray900, margin:0 }}>{formatDeadline(job.deadline)}</p>
              </div>
            </div>
            {dl !== null && (
              <p style={{ fontSize:11, color: dl < 0 ? C.red : dl <= 3 ? C.amber : C.gray, display:'flex', alignItems:'center', gap:4, margin:0 }}>
                <Clock size={11} />
                {dl < 0 ? `Expired ${Math.abs(dl)}d ago` : dl === 0 ? 'Expires today' : `${dl} days left`}
              </p>
            )}
          </div>
        )}

        {/* Skills — grid view */}
        {!isList && job.skillsRequired?.length > 0 && (
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
            {job.skillsRequired.slice(0, 3).map(s => (
              <span key={s} style={{ fontSize:10.5, padding:'2px 8px', borderRadius:5, background:C.gray50, color:'#4b5563', border:`1px solid ${C.gray200}` }}>{s}</span>
            ))}
            {job.skillsRequired.length > 3 && (
              <span style={{ fontSize:10.5, padding:'2px 8px', borderRadius:5, background:C.gray50, color:C.gray, border:`1px solid ${C.gray200}` }}>+{job.skillsRequired.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* List view columns */}
      {isList && (
        <>
          <div>
            <p style={{ fontSize:9.5, color:C.gray, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', margin:'0 0 3px' }}>Type / Mode</p>
            <p style={{ fontSize:13, fontWeight:600, color:C.gray900, margin:'0 0 2px' }}>{job.jobType} · {job.workMode}</p>
            <p style={{ fontSize:11, color:C.gray, display:'flex', alignItems:'center', gap:4, margin:0 }}><MapPin size={10} /> {job.location}</p>
          </div>
          <div>
            <p style={{ fontSize:9.5, color:C.gray, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', margin:'0 0 3px' }}>Applicants</p>
            <p style={{ fontWeight:800, fontSize:20, color:C.accent, margin:'0 0 2px', letterSpacing:'-0.5px', lineHeight:1 }}>{job.applicationsCount || 0}</p>
            <p style={{ fontSize:10.5, color:C.gray, margin:0 }}>{job.openings} opening{job.openings !== 1 ? 's' : ''}</p>
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ padding: isList ? 0 : '0 20px 16px', display:'flex', alignItems:'center', gap:10, marginTop: isList ? 0 : 'auto' }}>
        <button
          onClick={() => onToggle(job._id, !job.isActive)}
          style={{ width:38, height:22, borderRadius:11, padding:2, border:'none', cursor:'pointer', background: job.isActive ? C.green : C.gray200, position:'relative', transition:'background 0.2s', flexShrink:0 }}
        >
          <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', transform: job.isActive ? 'translateX(16px)' : 'translateX(0)', transition:'transform 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
        </button>
        <span style={{ fontSize:11.5, color: job.isActive ? C.green : C.gray, fontWeight:600 }}>
          {job.isActive ? 'Active' : 'Paused'}
        </span>
        <div style={{ flex:1 }} />
        <button onClick={() => onViewApplicants()} title="View applicants" style={{ width:32, height:32, borderRadius:8, background:'transparent', border:`1px solid ${C.gray200}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#4b5563' }}>
          <Users size={14} />
        </button>
        <button
          onClick={() => onGenerateQuestions(job._id)}
          title="Generate interview questions"
          style={{ width:32, height:32, borderRadius:8, background:'transparent', border:`1px solid ${C.gray200}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#7c3aed' }}
        >
          <Sparkles size={14} />
        </button>
        {isList && (
          <button onClick={() => onDelete(job._id)} title="Delete" style={{ width:32, height:32, borderRadius:8, background:'#fef2f2', border:'1px solid #fecaca', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.red }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>

    </div>
  );
}

// ─── Mobile Job Card ──────────────────────────────────────────
function MobileJobCard({ job, onToggle, onDelete, onEdit, onViewApplicants }) {
  const st = STATUS[job.status?.toLowerCase()] || STATUS.draft;
  const dl = daysLeft(job.deadline);

  return (
    <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.gray200}`, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Top accent bar */}
      <div style={{ height:3, background: job.status === 'published' ? `linear-gradient(90deg, ${C.primary}, ${C.accent})` : job.status === 'draft' ? C.amber : C.gray }} />

      <div style={{ padding:'14px 16px' }}>
        {/* Header row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div style={{ flex:1, minWidth:0, paddingRight:8 }}>
            {/* Status badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'2px 9px', borderRadius:9999, background:st.bg, border:`1px solid ${st.border}`, marginBottom:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:st.dot }} />
              <span style={{ fontSize:10, fontWeight:700, color:st.color }}>{st.label}</span>
            </div>
            <h3 style={{ fontWeight:800, fontSize:16, color:C.gray900, margin:0, lineHeight:1.2, letterSpacing:'-0.3px' }}>
              {job.title}
            </h3>
          </div>
          {/* Toggle */}
          <button
            onClick={() => onToggle(job._id, !job.isActive)}
            style={{ width:38, height:22, borderRadius:11, padding:2, border:'none', cursor:'pointer', background: job.isActive ? C.green : C.gray200, position:'relative', flexShrink:0 }}
          >
            <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', transform: job.isActive ? 'translateX(16px)' : 'translateX(0)', transition:'transform 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
          </button>
        </div>

        {/* Meta pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
          {[
            { Icon:MapPin,    val:job.location },
            { Icon:Briefcase, val:job.jobType  },
            { Icon:Users,     val:`${job.openings} opening${job.openings !== 1 ? 's' : ''}` },
          ].filter(m => m.val).map(({ Icon, val }, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:4, background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:7, padding:'3px 8px' }}>
              <Icon size={11} color={C.gray} />
              <span style={{ fontSize:11, color:'#4b5563', fontWeight:500 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
          <div style={{ background:C.light, borderRadius:10, padding:'10px 12px', border:`1px solid ${C.border}` }}>
            <p style={{ fontSize:9, color:C.accent, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', margin:'0 0 2px' }}>Applicants</p>
            <p style={{ fontWeight:800, fontSize:20, color:C.primary, margin:0, lineHeight:1 }}>{job.applicationsCount || 0}</p>
          </div>
          <div style={{ background:C.gray50, borderRadius:10, padding:'10px 12px', border:`1px solid ${C.gray200}` }}>
            <p style={{ fontSize:9, color:C.gray, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase', margin:'0 0 2px' }}>Deadline</p>
            <p style={{ fontWeight:700, fontSize:12, color:C.gray900, margin:0, lineHeight:1.3 }}>{formatDeadline(job.deadline)}</p>
            {dl !== null && (
              <p style={{ fontSize:10, color: dl < 0 ? C.red : dl <= 3 ? C.amber : C.green, margin:'2px 0 0', fontWeight:600 }}>
                {dl < 0 ? `Expired` : dl === 0 ? 'Today!' : `${dl}d left`}
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        {job.skillsRequired?.length > 0 && (
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
            {job.skillsRequired.slice(0, 3).map(s => (
              <span key={s} style={{ fontSize:10, padding:'2px 7px', borderRadius:5, background:C.gray50, color:'#4b5563', border:`1px solid ${C.gray200}` }}>{s}</span>
            ))}
            {job.skillsRequired.length > 3 && (
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:5, background:C.gray50, color:C.gray, border:`1px solid ${C.gray200}` }}>+{job.skillsRequired.length - 3}</span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:'flex', gap:8, borderTop:`1px solid ${C.gray100}`, paddingTop:12 }}>
          <button
            onClick={() => onViewApplicants()}
            style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:10, border:`1px solid ${C.border}`, background:C.light, color:C.primary, fontSize:12, fontWeight:700, cursor:'pointer' }}
          >
            <Users size={14} /> Applicants
          </button>
          <button
            onClick={() => onEdit(job._id)}
            style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:10, border:`1px solid ${C.gray200}`, background:'#fff', color:C.gray900, fontSize:12, fontWeight:700, cursor:'pointer' }}
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete(job._id)}
            style={{ width:38, display:'flex', alignItems:'center', justifyContent:'center', padding:'9px', borderRadius:10, border:'1px solid #fecaca', background:'#fef2f2', color:C.red, cursor:'pointer' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function CompanyJobsPage() {
  const navigate   = useNavigate();
  const fetchedRef = useRef(false);
  const isMobile   = useIsMobile();

  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('all');
  const [view,    setView]    = useState('grid');
  const [confirmModal, setConfirmModal] = useState({ isOpen:false, jobId:null });

  const [interviewModal, setInterviewModal] = useState({ isOpen:false, questions:[], jobTitle:'', loading:false });

  const handleGenerateQuestions = async (jobId) => {
    const job = jobs.find(j => j._id === jobId);
    setInterviewModal({ isOpen:true, questions:[], jobTitle: job?.title || '', loading:true });
    try {
      const data = await generateInterviewQuestions(jobId);
      setInterviewModal(prev => ({ ...prev, questions: data.questions || [], loading:false }));
    } catch (err) {
      toast.error('Failed to generate questions');
      setInterviewModal(prev => ({ ...prev, isOpen:false, loading:false }));
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const data = await getMyJobs();
        setJobs(data || []);
      } catch {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggle = async (id, isActive) => {
    try {
      await updateJobStatus(id, { isActive });
      setJobs(prev => prev.map(j => j._id === id ? { ...j, isActive } : j));
      toast.success(isActive ? 'Job is now Active' : 'Job is now Paused');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = (id) => {
    setConfirmModal({ isOpen: true, jobId: id });
  };


  const handleDelete = async () => {
    const jobId = confirmModal.jobId;
    const deletedJob = jobs.find(j => j._id === jobId);
    setJobs(prev => prev.filter(j => j._id !== jobId));
    setConfirmModal({ isOpen: false, jobId: null });
    let undone = false;
    toast((t) => (
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span>Job deleted</span>
        <button onClick={() => { undone = true; setJobs(prev => [...prev, deletedJob]); toast.dismiss(t.id); toast.success("Undo successful!"); }} style={{ background:"#fff", color:"#dc2626", border:"1px solid #dc2626", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Undo</button>
      </div>
    ), { duration: 5000 });
    setTimeout(async () => {
      if (!undone) {
        try { await deleteJob(jobId); }
        catch { setJobs(prev => [...prev, deletedJob]); toast.error("Delete failed — job restored"); }
      }
    }, 5000);
  };

  const published = jobs.filter(j => j.status === 'published').length;
  const drafts    = jobs.filter(j => j.status === 'draft').length;
  const closed    = jobs.filter(j => j.status === 'closed').length;
  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);

  const TABS = [
    { id:'all',       label:'All Jobs',  count:jobs.length },
    { id:'published', label:'Published', count:published   },
    { id:'draft',     label:'Draft',     count:drafts      },
    { id:'closed',    label:'Closed',    count:closed      },
  ];

  const filtered = tab === 'all' ? jobs : jobs.filter(j => j.status === tab);

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return isMobile ? (
      <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>
        {/* Mobile loading header */}
        <header style={{ background:'rgba(255,255,255,0.98)', borderBottom:`1px solid ${C.gray200}`, height:56, padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:C.grad, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Building2 size={15} color="#fff" />
            </div>
            <span style={{ fontWeight:900, fontSize:16, color:C.gray900 }}>HirePortal</span>
          </div>
        </header>
        <div style={{ padding:16, display:'flex', flexDirection:'column', gap:12 }}>
          {[1,2,3].map(i => <div key={i} style={{ height:200, background:'#fff', borderRadius:16, border:`1px solid ${C.gray200}`, animation:'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>
    ) : (
      <DashboardLayout>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height:110, background:'#fff', borderRadius:16, border:`1px solid ${C.gray200}`, animation:'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[1,2,3].map(i => <div key={i} style={{ height:340, background:'#fff', borderRadius:18, border:`1px solid ${C.gray200}`, animation:'pulse 1.5s ease-in-out infinite' }} />)}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </DashboardLayout>
    );
  }

  // ════════════════════════════════════════════════════════════
  // MOBILE LAYOUT
  // ════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif', paddingBottom:32 }}>

        {/* Mobile Header */}
        <header style={{ background:'rgba(255,255,255,0.98)', backdropFilter:'blur(20px)', borderBottom:`1px solid rgba(0,0,0,0.06)`, height:56, padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40, boxShadow:'0 1px 0 rgba(0,0,0,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:C.grad, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 6px rgba(30,58,95,0.4)' }}>
              <Building2 size={15} color="#fff" />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontWeight:900, fontSize:16, color:C.gray900, letterSpacing:'-0.3px' }}>HirePortal</span>
              <span style={{ background:`${C.primary}12`, color:C.primary, fontSize:9, fontWeight:800, borderRadius:5, padding:'2px 6px', letterSpacing:'0.5px', border:`1px solid ${C.primary}20` }}>COMPANY</span>
            </div>
          </div>
          <button
            onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)}
            style={{ background:C.primary, color:'#fff', border:'none', borderRadius:9, padding:'7px 13px', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5, boxShadow:'0 2px 6px rgba(30,58,95,0.35)' }}
          >
            <PlusCircle size={13} /> Post Job
          </button>
        </header>

        {/* Mobile Hero Banner */}
        <section style={{ background:C.grad, padding:'20px 16px 24px', borderRadius:'0 0 24px 24px', boxShadow:'0 6px 20px rgba(14,30,64,0.25)' }}>
          <p style={{ fontSize:10, color:'rgba(255,255,255,0.55)', fontWeight:700, letterSpacing:2, textTransform:'uppercase', margin:'0 0 4px' }}>
            Hiring · {jobs.length} posting{jobs.length !== 1 ? 's' : ''}
          </p>
          <h1 style={{ fontWeight:900, fontSize:24, color:'#fff', margin:'0 0 16px', letterSpacing:'-0.5px', lineHeight:1.1 }}>
            My Job Postings
          </h1>
          {/* Mobile mini stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[
              { label:'Published', value:published,   color:'#4ade80' },
              { label:'Draft',     value:drafts,       color:'#fbbf24' },
              { label:'Applied',   value:totalApps,    color:'#93c5fd' },
              { label:'Total',     value:jobs.length,  color:'rgba(255,255,255,0.7)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 6px', textAlign:'center' }}>
                <div style={{ color, fontWeight:900, fontSize:18, lineHeight:1 }}>{value}</div>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:9, marginTop:2, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.3px' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile Tab Filter */}
        <div style={{ padding:'14px 16px 0', overflowX:'auto' }}>
          <div style={{ display:'flex', gap:8, minWidth:'max-content' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer', background: tab === t.id ? C.primary : '#fff', color: tab === t.id ? '#fff' : '#4b5563', fontSize:12, fontWeight: tab === t.id ? 700 : 500, display:'inline-flex', alignItems:'center', gap:6, whiteSpace:'nowrap', boxShadow: tab === t.id ? `0 2px 8px ${C.primary}30` : '0 1px 3px rgba(0,0,0,0.06)', border: tab === t.id ? 'none' : `1px solid ${C.gray200}` }}
              >
                {t.label}
                <span style={{ background: tab === t.id ? 'rgba(255,255,255,0.25)' : C.gray100, color: tab === t.id ? '#fff' : C.gray, padding:'1px 6px', borderRadius:6, fontSize:10, fontWeight:700 }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Jobs List */}
        <div style={{ padding:'12px 16px 0', display:'flex', flexDirection:'column', gap:12 }}>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'48px 20px', background:'#fff', borderRadius:18, border:`1px solid ${C.gray200}` }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                <Briefcase size={24} color={C.primary} />
              </div>
              <p style={{ fontWeight:800, fontSize:17, color:C.gray900, margin:'0 0 6px' }}>No jobs found</p>
              <p style={{ color:C.gray, fontSize:13, margin:'0 0 18px' }}>
                {tab === 'all' ? 'Post your first job to start receiving applications' : `No ${tab} jobs yet`}
              </p>
              <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Post New Job
              </button>
            </div>
          )}

          {/* Job cards */}
          {filtered.map(job => (
            <MobileJobCard
              key={job._id}
              job={job}
              onToggle={handleToggle}
              onDelete={confirmDelete}
              onEdit={(id) => navigate(ROUTES.COMPANY_JOB_EDIT.replace(':id', id))}
              onViewApplicants={() => navigate(ROUTES.COMPANY_APPLICATIONS)}
              onGenerateQuestions={handleGenerateQuestions}
            />
          ))}

          {/* Post new job card */}
          <div
            onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)}
            style={{ border:`2px dashed ${C.gray200}`, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', gap:12, padding:'20px', cursor:'pointer' }}
          >
            <div style={{ width:40, height:40, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Plus size={20} color={C.primary} />
            </div>
            <div>
              <p style={{ fontWeight:800, fontSize:14, color:C.gray900, margin:'0 0 2px' }}>Post a New Job</p>
              <p style={{ fontSize:12, color:C.gray, margin:0 }}>Reach 1000+ candidates</p>
            </div>
            <ChevronRight size={16} color={C.gray} style={{ marginLeft:'auto' }} />
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // ════════════════════════════════════════════════════════════
  return (
    <DashboardLayout>
      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%' }}>

        {/* Page Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ fontSize:11.5, color:C.accent, fontWeight:700, letterSpacing:2, textTransform:'uppercase', margin:'0 0 6px' }}>
              Hiring · {jobs.length} posting{jobs.length !== 1 ? 's' : ''}
            </p>
            <h1 style={{ fontWeight:900, fontSize:32, color:C.gray900, margin:'0 0 6px', letterSpacing:'-1px', lineHeight:1 }}>
              My Job <span style={{ color:C.primary }}>Postings</span>
            </h1>
            <p style={{ fontSize:14, color:C.gray, margin:0, maxWidth:460 }}>
              Manage all your job and internship listings. Track applicants, edit details, and close roles when filled.
            </p>
          </div>
          <button
            onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:12, background:C.primary, color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, boxShadow:`0 6px 20px ${C.primary}40`, whiteSpace:'nowrap' }}
          >
            <Plus size={16} /> Post New Job
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          <StatCard label="Published"  value={published}   sub="live and visible"   color={C.green}   Icon={CheckCircle} trend={[0,1,1,2,2,3,published]} />
          <StatCard label="In Draft"   value={drafts}      sub="not yet published"  color={C.amber}   Icon={Clock}       trend={[0,0,0,1,1,1,drafts]}    />
          <StatCard label="Applicants" value={totalApps}   sub="across all jobs"    color={C.accent}  Icon={Users}       trend={[0,2,4,6,8,10,totalApps]} />
          <StatCard label="Total Jobs" value={jobs.length} sub="posted"             color={C.primary} Icon={Briefcase}   trend={[0,1,2,3,4,5,jobs.length]} />
        </div>

        {/* Tabs + View Toggle */}
        <div style={{ background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:16, padding:'10px 14px', marginBottom:18, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:2, flexWrap:'wrap' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'7px 13px', borderRadius:8, border:'none', cursor:'pointer', background: tab === t.id ? C.primary : 'transparent', color: tab === t.id ? '#fff' : '#4b5563', fontSize:12.5, fontWeight: tab === t.id ? 700 : 500, display:'inline-flex', alignItems:'center', gap:6 }}>
                {t.label}
                <span style={{ background: tab === t.id ? 'rgba(255,255,255,0.25)' : C.gray100, color: tab === t.id ? '#fff' : C.gray, padding:'1px 7px', borderRadius:6, fontSize:10.5, fontWeight:700 }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <div style={{ flex:1 }} />
          <div style={{ display:'flex', gap:0, background:C.gray50, padding:2, borderRadius:8, border:`1px solid ${C.gray200}` }}>
            {[{ v:'grid', Icon:LayoutGrid }, { v:'list', Icon:List }].map(({ v, Icon }) => (
              <button key={v} onClick={() => setView(v)} style={{ padding:'6px 10px', borderRadius:6, border:'none', cursor:'pointer', background: view === v ? '#fff' : 'transparent', color: view === v ? C.gray900 : C.gray, boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', display:'flex', alignItems:'center' }}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff', borderRadius:18, border:`1px solid ${C.gray200}` }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Briefcase size={28} color={C.primary} />
            </div>
            <p style={{ fontWeight:800, fontSize:18, color:C.gray900, margin:'0 0 6px' }}>No jobs found</p>
            <p style={{ color:C.gray, fontSize:14, margin:'0 0 20px' }}>
              {tab === 'all' ? 'Post your first job to start receiving applications' : `No ${tab} jobs yet`}
            </p>
            <button onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'11px 24px', fontSize:14, fontWeight:700, cursor:'pointer' }}>
              Post New Job
            </button>
          </div>
        )}

        {/* Jobs Grid / List */}
        {filtered.length > 0 && (
          <div style={{ display: view === 'grid' ? 'grid' : 'flex', gridTemplateColumns: view === 'grid' ? 'repeat(3,1fr)' : undefined, flexDirection: view === 'list' ? 'column' : undefined, gap:16 }}>
            {filtered.map(job => (
              <JobCard
                key={job._id}
                job={job}
                view={view}
                onToggle={handleToggle}
                onDelete={confirmDelete}
                onEdit={(id) => navigate(ROUTES.COMPANY_JOB_EDIT.replace(':id', id))}
                onViewApplicants={() => navigate(ROUTES.COMPANY_APPLICATIONS)}
                onGenerateQuestions={handleGenerateQuestions}
              />
            ))}
            {view === 'grid' && (
              <div
                onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)}
                style={{ border:`2px dashed ${C.gray200}`, borderRadius:18, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', minHeight:340, cursor:'pointer', transition:'border-color 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.background=C.light; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.gray200; e.currentTarget.style.background='transparent'; }}
              >
                <div style={{ width:60, height:60, borderRadius:'50%', background:`${C.primary}12`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <Plus size={28} color={C.primary} />
                </div>
                <p style={{ fontWeight:800, fontSize:16, color:C.gray900, margin:'0 0 5px' }}>Post a New Job</p>
                <p style={{ fontSize:12, color:C.gray, textAlign:'center', maxWidth:180, margin:0 }}>
                  Reach 1000+ candidates with one click
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen:false, jobId:null })}
      />

      {/* AI Interview Questions Modal */}
{interviewModal.isOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    onClick={() => setInterviewModal(prev => ({ ...prev, isOpen:false }))}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      onClick={e => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">AI Interview Questions</h2>
            <p className="text-xs text-white/70">{interviewModal.jobTitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInterviewModal(prev => ({ ...prev, isOpen:false }))}
          className="text-white/70 hover:text-white transition text-xl font-bold"
        >
          X
        </button>
      </div>

      {/* Modal Body */}
      <div className="overflow-y-auto flex-1 p-6">
        {interviewModal.loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <span className="ml-3 text-gray-500 text-sm">Generating questions...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.isArray(interviewModal.questions) && interviewModal.questions.map((q, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-400">Q{i + 1}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    q.type === 'Technical' ? 'bg-blue-50 text-blue-700' :
                    q.type === 'Leadership' ? 'bg-amber-50 text-amber-700' :
                    q.type === 'Behavioural' ? 'bg-purple-50 text-purple-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    {q.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{q.question}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Footer */}
      {!interviewModal.loading && (
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={() => {
              const text = interviewModal.questions.map((q, i) =>
                `Q${i + 1} [${q.type}]\n${q.question}`
              ).join('\n\n');
              navigator.clipboard.writeText(text);
              toast.success('Questions copied to clipboard');
            }}
            className="flex-1 border border-gray-200 text-gray-600 hover:border-gray-400 font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            Copy All
          </button>
          <button
            type="button"
            onClick={() => handleGenerateQuestions(jobs.find(j => j.title === interviewModal.jobTitle)?._id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Regenerate
          </button>
        </div>
      )}
    </div>
  </div>
)}
    </DashboardLayout>
  );
}