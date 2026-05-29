// CreateJobPage.jsx — Modern redesign with live preview
// Left: Sectioned form | Right: Live preview card
// Navy company theme

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, MapPin, Users, Calendar, Clock,
  CheckCircle, Star, Eye, Bookmark, ChevronRight,
  FileText, DollarSign, Target, ShieldCheck, Zap,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { createJob } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '../../constants/jobConstants';
import { useAuth } from '../../context/AuthContext';
import useIsMobile from '../../hooks/useIsMobile';
import toast from 'react-hot-toast';
import { analyzeJobDescription } from '../../services/ai/generationService';

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary : '#1e3a5f',
  accent  : '#3b82f6',
  deep    : '#152d4a',
  light   : '#eff6ff',
  border  : '#bfdbfe',
  green   : '#059669',
  gray50  : '#f9fafb',
  gray100 : '#f3f4f6',
  gray200 : '#e5e7eb',
  gray400 : '#9ca3af',
  gray600 : '#4b5563',
  gray900 : '#111827',
};

// ─── Helper: strip HTML for preview ──────────────────────────
const stripHtml = (html) => html?.replace(/<[^>]*>/g, '').trim() || '';

// ─── Helper: today date ───────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

// ─── Chip Input component ─────────────────────────────────────
// Modern tag input — type and press Enter to add chips
function ChipInput({ chips, onChange, placeholder, color = C.accent, suggestions = [] }) {
  const [input, setInput] = useState('');

  const add = (val) => {
    const t = val.trim();
    if (t && !chips.includes(t)) onChange([...chips, t]);
    setInput('');
  };

  const remove = (chip) => onChange(chips.filter(c => c !== chip));

  return (
    <div>
      {/* Chip container */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'8px', background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:10, minHeight:46, alignItems:'center' }}>
        {chips.map(c => (
          <span key={c} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:9999, background:'#fff', border:`1px solid ${color}40`, color }}>
            <span style={{ fontSize:12, fontWeight:600 }}>{c}</span>
            <button
              type="button"
              onClick={() => remove(c)}
              style={{ background:'transparent', border:'none', cursor:'pointer', color, fontSize:14, padding:0, lineHeight:1, display:'flex', alignItems:'center' }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input); } if (e.key === ',' ) { e.preventDefault(); add(input); } }}
          placeholder={chips.length ? '' : placeholder}
          style={{ flex:1, minWidth:120, padding:'4px 6px', border:'none', background:'transparent', outline:'none', fontSize:13 }}
        />
      </div>
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ marginTop:7, display:'flex', flexWrap:'wrap', gap:5, alignItems:'center' }}>
          <span style={{ fontSize:10, color:C.gray400, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>Suggest:</span>
          {suggestions.filter(s => !chips.includes(s)).slice(0, 5).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              style={{ padding:'2px 8px', borderRadius:5, background:'transparent', border:`1px dashed ${C.gray200}`, color:C.gray600, cursor:'pointer', fontSize:11 }}
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Form Section wrapper ─────────────────────────────────────
function FormSection({ num, Icon, title, subtitle, active, children }) {
  return (
    <section style={{
      background:'#fff', borderRadius:18, padding:window.innerWidth < 640 ? '16px 14px' : '22px 24px',
      border: active ? `1.5px solid ${C.accent}` : `1px solid ${C.gray200}`,
      boxShadow: active ? `0 6px 24px ${C.accent}16` : 'none',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <div style={{ width:38, height:38, borderRadius:10, background: active ? C.accent : `${C.accent}14`, color: active ? '#fff' : C.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={18} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
            <span style={{ fontSize:10, color:C.gray400, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>Step {num}</span>
            {active && <span style={{ fontSize:9, background:C.accent, color:'#fff', borderRadius:5, padding:'1px 7px', fontWeight:700 }}>Editing</span>}
          </div>
          <p style={{ fontWeight:800, fontSize:16, color:C.gray900, margin:'0 0 1px', letterSpacing:'-0.3px' }}>{title}</p>
          <p style={{ fontSize:11.5, color:C.gray400, margin:0 }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {children}
      </div>
    </section>
  );
}

// ─── Form Row ─────────────────────────────────────────────────
function FormRow({ label, required, hint, children, error }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:7 }}>
        <label style={{ fontSize:12.5, fontWeight:600, color:C.gray900 }}>
          {label}{required && <span style={{ color:'#ef4444', marginLeft:3 }}>*</span>}
        </label>
        {hint && <span style={{ fontSize:10.5, color:C.gray400 }}>{hint}</span>}
      </div>
      {children}
      {error && <p style={{ color:'#ef4444', fontSize:11, marginTop:4, display:'flex', alignItems:'center', gap:3 }}>⚠ {error}</p>}
    </div>
  );
}

// ─── Input style helper ───────────────────────────────────────
const inputStyle = (hasError) => ({
  width:'100%', padding:'10px 14px', borderRadius:10,
  border: `1px solid ${hasError ? '#ef4444' : C.gray200}`,
  background: hasError ? '#fef2f2' : '#fff',
  fontSize:13, outline:'none', color:C.gray900,
  fontFamily:'inherit',
});

// ─── Type/Mode pill button ────────────────────────────────────
function TypePill({ label, selected, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding:'9px 12px', borderRadius:9, fontSize:12, cursor:'pointer',
        background: selected ? `${color}14` : '#fff',
        color: selected ? color : C.gray600,
        border: selected ? `1.5px solid ${color}` : `1px solid ${C.gray200}`,
        fontWeight: selected ? 700 : 500,
        transition:'all 0.12s',
      }}
    >
      {label}
    </button>
  );
}

// ─── Live Preview Card ────────────────────────────────────────
function LivePreview({ form, profile }) {
  const companyName = profile?.companyName || profile?.name || 'Your Company';
  const isVerified  = profile?.isVerified;

  // Quality score calculation
  const qualityItems = [
    { label:'Clear title',        done: form.title.trim().length >= 5 },
    { label:'Description written',done: stripHtml(form.description).length >= 30 },
    { label:'Salary disclosed',   done: form.salary.isDisclosed && (form.salary.min || form.salary.max) },
    { label:'Skills tagged',      done: form.skillsRequired.length > 0 },
    { label:'Deadline set',       done: !!form.deadline },
  ];
  const score = Math.round((qualityItems.filter(q => q.done).length / qualityItems.length) * 100);

  return (
    <div style={{ position:'sticky', top:20 }}>
      {/* Preview header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <p style={{ fontWeight:800, fontSize:14, color:C.gray900, margin:0 }}>Live Preview</p>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:5, background:`${C.green}14`, color:C.green, fontSize:10, fontWeight:700 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:C.green }} />
            LIVE
          </span>
        </div>
      </div>

      {/* Preview card */}
      <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.gray200}`, overflow:'hidden' }}>
        {/* Browser chrome */}
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 12px', background:C.gray50, borderBottom:`1px solid ${C.gray200}` }}>
          <div style={{ display:'flex', gap:4 }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => (
              <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c }} />
            ))}
          </div>
          <div style={{ flex:1, padding:'3px 10px', background:'#fff', border:`1px solid ${C.gray200}`, borderRadius:5, fontSize:10, color:C.gray400, textAlign:'center', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
            hireportal.com/jobs/{form.title.toLowerCase().replace(/\s+/g,'-').slice(0,30) || 'your-job-title'}
          </div>
        </div>

        {/* Job card content */}
        <div style={{ padding:'18px 20px' }}>
          {/* Company info */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:`linear-gradient(135deg, ${C.deep}, ${C.primary})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:18, flexShrink:0 }}>
              {companyName[0].toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:11, color:C.gray400, margin:'0 0 3px' }}>{companyName} · {profile?.industry || 'Technology'}</p>
              <div style={{ display:'flex', gap:5 }}>
                {isVerified && (
                  <span style={{ fontSize:9.5, padding:'1px 7px', borderRadius:5, background:`${C.accent}14`, color:C.accent, fontWeight:600 }}>
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
            <button type="button" style={{ width:30, height:30, borderRadius:7, background:C.gray50, border:`1px solid ${C.gray200}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bookmark size={13} color={C.gray400} />
            </button>
          </div>

          {/* Job title */}
          <h2 style={{ fontWeight:800, fontSize:20, color:C.gray900, margin:'0 0 8px', letterSpacing:'-0.5px', lineHeight:1.2 }}>
            {form.title || 'Job Title will appear here'}
          </h2>

          {/* Status + type pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
            {form.status && <span style={{ fontSize:10.5, padding:'3px 9px', borderRadius:9999, background:`${C.green}14`, color:C.green, fontWeight:600 }}>{form.status}</span>}
            {form.workMode && <span style={{ fontSize:10.5, padding:'3px 9px', borderRadius:9999, background:`${C.accent}14`, color:C.accent, fontWeight:600 }}>{form.workMode}</span>}
            {form.jobType && <span style={{ fontSize:10.5, padding:'3px 9px', borderRadius:9999, background:`${C.primary}14`, color:C.primary, fontWeight:600 }}>{form.jobType}</span>}
            {form.experienceLevel && <span style={{ fontSize:10.5, padding:'3px 9px', borderRadius:9999, background:'#f3e8ff', color:'#7c3aed', fontWeight:600 }}>{form.experienceLevel}</span>}
          </div>

          {/* Meta grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
            {[
              { Icon:MapPin,   val: form.location || 'Location' },
              { Icon:Users,    val: `${form.openings || 1} opening${form.openings > 1 ? 's' : ''}` },
              { Icon:Calendar, val: form.deadline ? `Apply by ${new Date(form.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}` : 'No deadline' },
              { Icon:DollarSign, val: form.salary.isDisclosed && (form.salary.min || form.salary.max)
                  ? `₹${Number(form.salary.min || 0).toLocaleString()} — ₹${Number(form.salary.max || 0).toLocaleString()}`
                  : 'Salary not disclosed'
              },
            ].map(({ Icon, val }, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 9px', background:C.gray50, borderRadius:7 }}>
                <Icon size={12} color={C.gray400} style={{ flexShrink:0 }} />
                <span style={{ fontSize:11, fontWeight:500, color:C.gray900, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Description preview */}
          {stripHtml(form.description) && (
            <>
              <p style={{ fontSize:10.5, color:C.gray400, fontWeight:700, letterSpacing:1, textTransform:'uppercase', margin:'0 0 6px' }}>About the role</p>
              <p style={{ fontSize:11.5, color:C.gray600, lineHeight:1.55, margin:'0 0 14px' }}>
                {stripHtml(form.description).slice(0, 120)}{stripHtml(form.description).length > 120 ? '…' : ''}
              </p>
            </>
          )}

          {/* Skills */}
          {form.skillsRequired.length > 0 && (
            <>
              <p style={{ fontSize:10.5, color:C.gray400, fontWeight:700, letterSpacing:1, textTransform:'uppercase', margin:'0 0 6px' }}>Skills</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                {form.skillsRequired.slice(0, 5).map(s => (
                  <span key={s} style={{ fontSize:10.5, padding:'3px 8px', borderRadius:5, background:'#fff', border:`1px solid ${C.gray200}`, color:C.gray600 }}>{s}</span>
                ))}
                {form.skillsRequired.length > 5 && <span style={{ fontSize:10.5, color:C.gray400, padding:'3px 4px' }}>+{form.skillsRequired.length - 5} more</span>}
              </div>
            </>
          )}

          {/* Apply button */}
          <div style={{ display:'flex', gap:8 }}>
            <button type="button" style={{ flex:1, padding:'9px', borderRadius:9, background:C.primary, color:'#fff', border:'none', cursor:'pointer', fontSize:13, fontWeight:700 }}>
              Apply Now →
            </button>
            <button type="button" style={{ padding:'9px 14px', borderRadius:9, background:C.gray50, color:C.gray600, border:`1px solid ${C.gray200}`, cursor:'pointer', fontSize:13 }}>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Quality score card */}
      <div style={{ marginTop:14, padding:'16px', background:'#fff', borderRadius:14, border:`1px solid ${C.gray200}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <Zap size={14} color={C.accent} />
            <span style={{ fontWeight:800, fontSize:13, color:C.gray900 }}>Job Quality Score</span>
          </div>
          <span style={{ fontWeight:900, fontSize:18, color: score >= 80 ? C.green : score >= 60 ? C.accent : C.gray400, letterSpacing:'-0.5px' }}>
            {score}<span style={{ fontSize:11, color:C.gray400, fontWeight:400 }}>/100</span>
          </span>
        </div>
        <div style={{ height:5, background:C.gray100, borderRadius:3, overflow:'hidden', marginBottom:12 }}>
          <div style={{ width:`${score}%`, height:'100%', background: score >= 80 ? C.green : score >= 60 ? C.accent : C.gray400, borderRadius:3, transition:'width 0.5s ease' }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {qualityItems.map(({ label, done }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color: done ? C.green : C.gray400 }}>
              <span>{done ? '✓' : '○'}</span>
              <span style={{ fontWeight: done ? 600 : 400 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main CreateJobPage ───────────────────────────────────────
export default function CreateJobPage() {
  const navigate      = useNavigate();
  const { profile }   = useAuth();
  const [loading,     setLoading]     = useState(false);
  const [apiError,    setApiError]    = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [activeSection, setActiveSection] = useState(1);


  const [jdAnalyzing,  setJdAnalyzing]  = useState(false);
  const [jdResult,     setJdResult]     = useState(null); 

  // ── Form state (lifted up for live preview) ───────────────
  const [form, setForm] = useState({
    title:            '',
    description:      '',
    location:         '',
    jobType:          '',
    workMode:         '',
    experienceLevel:  'fresher',
    openings:         1,
    status:           'draft',
    skillsRequired:   [],   // array (chip input)
    preferredSkills:  [],   // array (chip input)
    requirements:     [],   // array (chip input)
    responsibilities: [],   // array (chip input)
    benefits:         [],   // array (chip input)
    salary: { min:'', max:'', isDisclosed:false, currency:'INR' },
    deadline:         '',
  });

  // ── Generic field updater ─────────────────────────────────
  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const setSalary = (field, value) => {
    setForm(prev => ({ ...prev, salary: { ...prev.salary, [field]: value } }));
    setFieldErrors(prev => ({ ...prev, salaryMin:'', salaryMax:'' }));
  };

  // ── Validate ──────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim())          errs.title       = 'Job title is required';
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    if (!stripHtml(form.description))      errs.description = 'Description is required';
    else if (stripHtml(form.description).length < 20) errs.description = 'Description must be at least 20 characters';
    if (!form.location.trim())       errs.location    = 'Location is required';
    if (!form.jobType)               errs.jobType     = 'Please select a job type';
    if (!form.workMode)              errs.workMode    = 'Please select a work mode';
    if (form.salary.min !== '' && form.salary.max !== '' && Number(form.salary.min) > Number(form.salary.max))
      errs.salaryMin = 'Minimum cannot be more than maximum';
    if (form.deadline && form.deadline < todayStr()) errs.deadline = 'Deadline cannot be in the past';
    return errs;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setApiError('');

    const finalData = {
      title:            form.title.trim(),
      description:      form.description.trim(),
      location:         form.location.trim(),
      jobType:          form.jobType,
      workMode:         form.workMode,
      experienceLevel:  form.experienceLevel,
      openings:         Number(form.openings) || 1,
      status:           form.status,
      skillsRequired:   form.skillsRequired,
      preferredSkills:  form.preferredSkills,
      requirements:     form.requirements,
      responsibilities: form.responsibilities,
      benefits:         form.benefits,
      salary: { min:Number(form.salary.min)||0, max:Number(form.salary.max)||0, isDisclosed:form.salary.isDisclosed, currency:'INR' },
    };
    if (form.deadline) finalData.deadline = form.deadline;

    try {
      setLoading(true);
      await createJob(finalData);
      toast.success('Job posted successfully!');
      navigate(ROUTES.COMPANY_JOBS);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to post job. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Input class helper ────────────────────────────────────
  const iClass = (f) => ({ ...inputStyle(!!fieldErrors[f]) });
  const isMobile = useIsMobile();

  const ErrMsg = ({ field }) => fieldErrors[field]
    ? <p style={{ color:'#ef4444', fontSize:11, marginTop:4 }}>⚠ {fieldErrors[field]}</p>
    : null;

  const errorCount = Object.values(fieldErrors).filter(Boolean).length;


  const handleAnalyzeJD = async () => {
    const desc = stripHtml(form.description);
    if (!desc || desc.length < 20) {
      toast.error('Please write a description first (at least 20 characters)');
      return;
    }
    try {
      setJdAnalyzing(true);
      setJdResult(null);
      const result = await analyzeJobDescription(form.description);
      setJdResult(result);
      // Auto-fill skills if empty
      if (form.skillsRequired.length === 0 && result.extractedSkills.length > 0) {
        set('skillsRequired', result.extractedSkills);
      }
      // Auto-fill experience level
      if (result.experienceLevel) {
        set('experienceLevel', result.experienceLevel);
      }
      toast.success('JD analyzed! Skills and experience level auto-filled.');
    } catch (err) {
      toast.error('Could not analyze description. Please try again.');
    } finally {
      setJdAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>

      {/* ── Page header ── */}
      <div style={{ display:'flex', alignItems:isMobile ? 'flex-start' : 'flex-start', justifyContent:'space-between', marginBottom:24, gap:16, flexDirection:isMobile ? 'column' : 'row' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
          <button
            type="button"
            onClick={() => navigate(ROUTES.COMPANY_JOBS)}
            style={{ width:40, height:40, borderRadius:11, background:'#fff', border:`1px solid ${C.gray200}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
          >
            <ArrowLeft size={18} color={C.gray600} />
          </button>
          <div>
            <p style={{ fontSize:11.5, color:C.accent, fontWeight:700, letterSpacing:2, textTransform:'uppercase', margin:'0 0 5px' }}>
              New Posting
            </p>
            <h1 style={{ fontWeight:900, fontSize:isMobile ? 20 : 28, color:C.gray900, margin:'0 0 4px', letterSpacing:'-0.8px', lineHeight:1 }}>
              Post a New Job
            </h1>
            <p style={{ fontSize:13.5, color:C.gray400, margin:0 }}>
              Fill in the details below and publish your listing to reach candidates.
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0 }}>
          <button
            type="button"
            onClick={() => { set('status','draft'); handleSubmit({ preventDefault:()=>{} }); }}
            style={{ padding:'10px 18px', borderRadius:10, background:'transparent', color:C.gray600, border:`1px solid ${C.gray200}`, cursor:'pointer', fontSize:13, fontWeight:500 }}
          >
            Save as Draft
          </button>
          <button
            form="job-create-form"
            type="submit"
            disabled={loading}
            style={{ padding:'10px 22px', borderRadius:10, background:`linear-gradient(135deg, ${C.deep}, ${C.primary})`, color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, boxShadow:`0 6px 20px ${C.primary}40`, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Posting...' : 'Publish Job →'}
          </button>
        </div>
      </div>

      {/* ── API Error banner ── */}
      {apiError && (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'12px 16px', marginBottom:20, color:'#dc2626', fontSize:13 }}>
          ⚠ {apiError}
        </div>
      )}

      {/* ── Validation error banner ── */}
      {errorCount > 0 && (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:16, flexShrink:0 }}>⚠</span>
          <div>
            <p style={{ color:'#dc2626', fontWeight:700, fontSize:13, margin:'0 0 2px' }}>Please fix {errorCount} error{errorCount > 1 ? 's' : ''}</p>
            <p style={{ color:'#ef4444', fontSize:11, margin:0 }}>Fields with errors are highlighted below</p>
          </div>
        </div>
      )}

      {/* ── Main 2-column layout ── */}
      <form id="job-create-form" onSubmit={handleSubmit} style={{ maxWidth:"100%", overflowX:"hidden" }}>
        <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : '1fr 380px', gap:20, minWidth:0, width:'100%', alignItems:'flex-start' }}>

          {/* LEFT — Form sections */}
          <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0, width:'100%' }}>

            {/* Section 1 — Basics */}
            <FormSection num={1} Icon={FileText} title="The Basics" subtitle="Start with the essentials" active={activeSection === 1}>
              <FormRow label="Job Title" required hint="Clear titles get more applicants">
                <input value={form.title} onChange={e => { set('title', e.target.value); setActiveSection(1); }} placeholder="e.g. React Developer Intern" style={iClass('title')} />
                <ErrMsg field="title" />
                {!fieldErrors.title && form.title.length > 0 && (
                  <p style={{ fontSize:10.5, color:C.gray400, marginTop:3, textAlign:'right' }}>{form.title.length}/100</p>
                )}
              </FormRow>

              <FormRow label="Description" required hint="Min 20 characters">
                {/* Rich text is replaced by textarea for simplicity in this redesign */}
                <textarea
                  value={form.description}
                  onChange={e => { set('description', e.target.value); setActiveSection(1); }}
                  placeholder="Describe the role, responsibilities, and what you are looking for..."
                  rows={5}
                  style={{ ...iClass('description'), resize:'vertical', lineHeight:1.6 }}
                />
                <ErrMsg field="description" />
                {/* Analyze JD Button */}
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={handleAnalyzeJD}
                    disabled={jdAnalyzing}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 8,
                      background: jdAnalyzing ? '#E5E7EB' : '#EEF2FF',
                      color: jdAnalyzing ? '#9CA3AF' : '#4F46E5',
                      border: '1px solid #C7D2FE',
                      fontSize: 12, fontWeight: 700, cursor: jdAnalyzing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {jdAnalyzing ? (
                      <>
                        <div style={{ width:12, height:12, borderRadius:'50%', border:'2px solid #9CA3AF', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize:14 }}>AI</span>
                        Analyze JD — Auto-fill Skills
                      </>
                    )}
                  </button>
                  <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>
                    AI will extract skills and suggest experience level from your description
                  </p>
                </div>

                {/* JD Analysis Result */}
                {jdResult && (
                  <div style={{ marginTop: 12, padding: 14, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#15803D', marginBottom: 8 }}>
                      JD Analysis Result — Confidence: {jdResult.confidence}
                    </p>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: '#374151' }}>
                        Experience: <strong>{jdResult.experienceLevel}</strong>
                      </span>
                      <span style={{ fontSize: 11, color: '#374151' }}>
                        Difficulty: <strong>{jdResult.difficulty}</strong>
                      </span>
                      <span style={{ fontSize: 11, color: '#374151' }}>
                        Est. Salary: <strong>
                          {(jdResult.estimatedSalary.min / 100000).toFixed(0)}L –
                          {(jdResult.estimatedSalary.max / 100000).toFixed(0)}L INR/yr
                        </strong>
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {jdResult.extractedSkills.map(s => (
                        <span key={s} style={{ fontSize: 11, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                    </div>
                    {jdResult.suggestions?.length > 0 && (
                      <p style={{ fontSize: 11, color: '#92400E', marginTop: 8 }}>
                        Tip: {jdResult.suggestions[0]}
                      </p>
                    )}
                  </div>
                )}
              </FormRow>
            </FormSection>

            {/* Section 2 — Job Details */}
            <FormSection num={2} Icon={Target} title="Job Details" subtitle="Location, type, and seniority" active={activeSection === 2}>
              <FormRow label="Location" required>
                <div style={{ position:'relative' }}>
                  <MapPin size={14} color={C.gray400} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} />
                  <input value={form.location} onChange={e => { set('location', e.target.value); setActiveSection(2); }} placeholder="e.g. Chennai, India" style={{ ...iClass('location'), paddingLeft:36 }} />
                </div>
                <ErrMsg field="location" />
              </FormRow>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <FormRow label="Job Type" required>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    {JOB_TYPES.map(t => (
                      <TypePill key={t.value} label={t.label} selected={form.jobType === t.value} color={C.primary} onClick={() => { set('jobType', t.value); setActiveSection(2); }} />
                    ))}
                  </div>
                  <ErrMsg field="jobType" />
                </FormRow>
                <FormRow label="Work Mode" required>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {WORK_MODES.map(m => (
                      <TypePill key={m.value} label={m.label} selected={form.workMode === m.value} color={C.accent} onClick={() => { set('workMode', m.value); setActiveSection(2); }} />
                    ))}
                  </div>
                  <ErrMsg field="workMode" />
                </FormRow>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : '2fr 1fr 1fr', gap:14 }}>
                <FormRow label="Experience Level">
                  <select value={form.experienceLevel} onChange={e => { set('experienceLevel', e.target.value); setActiveSection(2); }} style={iClass('experienceLevel')}>
                    {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </FormRow>
                <FormRow label="Openings">
                  <div style={{ display:'flex', alignItems:'center', gap:4, border:`1px solid ${C.gray200}`, borderRadius:10, overflow:'hidden', background:C.gray50 }}>
                    <button type="button" onClick={() => set('openings', Math.max(1, (form.openings||1) - 1))} style={{ width:34, height:40, background:'#fff', border:'none', cursor:'pointer', fontSize:16, fontWeight:700, borderRight:`1px solid ${C.gray200}` }}>−</button>
                    <input value={form.openings} onChange={e => set('openings', e.target.value)} style={{ flex:1, border:'none', background:'transparent', textAlign:'center', fontSize:15, fontWeight:700, outline:'none', padding:'8px 4px' }} />
                    <button type="button" onClick={() => set('openings', (form.openings||1) + 1)} style={{ width:34, height:40, background:'#fff', border:'none', cursor:'pointer', fontSize:16, fontWeight:700, borderLeft:`1px solid ${C.gray200}` }}>+</button>
                  </div>
                </FormRow>
                <FormRow label="Status">
                  <select value={form.status} onChange={e => set('status', e.target.value)} style={iClass('status')}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </FormRow>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <FormRow label="Application Deadline" hint="Leave empty for no deadline">
                  <div style={{ position:'relative' }}>
                    <Calendar size={14} color={C.gray400} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }} />
                    <input type="date" value={form.deadline} onChange={e => { set('deadline', e.target.value); setActiveSection(2); }} min={todayStr()} style={{ ...iClass('deadline'), paddingLeft:36 }} />
                  </div>
                  <ErrMsg field="deadline" />
                </FormRow>
              </div>
            </FormSection>

            {/* Section 3 — Compensation */}
            <FormSection num={3} Icon={DollarSign} title="Compensation" subtitle="Salary range and benefits" active={activeSection === 3}>
              <FormRow label="Salary / Stipend (INR)" hint="Jobs with salary get more applicants">
                <div style={{ padding:'18px', background:C.gray50, borderRadius:12, border:`1px solid ${C.gray200}` }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                    <div>
                      <p style={{ fontSize:10, color:C.gray400, fontWeight:700, textTransform:'uppercase', margin:'0 0 5px' }}>Minimum</p>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:13, color:C.gray400 }}>₹</span>
                        <input type="number" value={form.salary.min} onChange={e => { setSalary('min', e.target.value); setActiveSection(3); }} placeholder="e.g. 5000" style={{ ...iClass('salaryMin'), paddingLeft:24, fontSize:13 }} />
                      </div>
                      <ErrMsg field="salaryMin" />
                    </div>
                    <div>
                      <p style={{ fontSize:10, color:C.gray400, fontWeight:700, textTransform:'uppercase', margin:'0 0 5px' }}>Maximum</p>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:13, color:C.gray400 }}>₹</span>
                        <input type="number" value={form.salary.max} onChange={e => { setSalary('max', e.target.value); setActiveSection(3); }} placeholder="e.g. 10000" style={{ ...iClass('salaryMax'), paddingLeft:24, fontSize:13 }} />
                      </div>
                      <ErrMsg field="salaryMax" />
                    </div>
                  </div>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:12.5, color:C.gray600 }}>
                    <input type="checkbox" checked={form.salary.isDisclosed} onChange={e => setSalary('isDisclosed', e.target.checked)} style={{ width:15, height:15, accentColor:C.primary, cursor:'pointer' }} />
                    Show salary to candidates <span style={{ color:C.gray400 }}>(recommended)</span>
                  </label>
                </div>
              </FormRow>

              <FormRow label="Benefits" hint="Press Enter to add each benefit">
                <ChipInput chips={form.benefits} onChange={v => { set('benefits', v); setActiveSection(3); }} placeholder="e.g. Health insurance, Remote work..." color={C.green} suggestions={['Health insurance','Work from home','Flexible hours','Stock options','Annual bonus','Learning budget']} />
              </FormRow>
            </FormSection>

            {/* Section 4 — Requirements */}
            <FormSection num={4} Icon={CheckCircle} title="Requirements & Skills" subtitle="What you need and what they'll do" active={activeSection === 4}>
              <FormRow label="Skills Required" hint="Press Enter or comma to add">
                <ChipInput chips={form.skillsRequired} onChange={v => { set('skillsRequired', v); setActiveSection(4); }} placeholder="e.g. React, Node.js, MongoDB..." color={C.primary} suggestions={['React','Node.js','MongoDB','TypeScript','Python','AWS','Docker','Figma']} />
                  <div style={{ marginTop: 16 }}>
                    <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>
                      Preferred Skills
                      <span style={{ fontSize:11, fontWeight:400, color:'#9CA3AF', marginLeft:8 }}>(optional — nice to have)</span>
                    </label>
                    <ChipInput chips={form.preferredSkills} onChange={v => set('preferredSkills', v)} placeholder="e.g. Docker, AWS, Redis..." color="#7C3AED" suggestions={['Docker','AWS','Redis','Kubernetes','GraphQL','TypeScript','Figma','PostgreSQL']} />
                    <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>Candidates with these skills get bonus points in AI matching</p>
                  </div>
              </FormRow>

              <FormRow label="Requirements" hint="One per Enter">
                <ChipInput chips={form.requirements} onChange={v => { set('requirements', v); setActiveSection(4); }} placeholder="e.g. Bachelor's degree in CS..." color={C.gray600} suggestions={["Bachelor's in CS","1+ year experience","Strong communication","Portfolio required"]} />
              </FormRow>

              <FormRow label="Responsibilities" hint="One per Enter">
                <ChipInput chips={form.responsibilities} onChange={v => { set('responsibilities', v); setActiveSection(4); }} placeholder="e.g. Build React components..." color={C.accent} suggestions={['Build UI components','Write clean APIs','Code reviews','Team collaboration']} />
              </FormRow>
            </FormSection>

            {/* Bottom action bar */}
            <div style={{ background:'#fff', borderRadius:14, padding:'14px 18px', border:`1px solid ${C.gray200}`, display:'flex', alignItems:'center', gap:14, boxShadow:'0 -4px 24px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', background:C.gray50, borderRadius:8 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:C.green }} />
                <span style={{ fontSize:11.5, color:C.gray600 }}>Auto-saved</span>
              </div>
              <div style={{ flex:1 }} />
              <button type="button" onClick={() => navigate(ROUTES.COMPANY_JOBS)} style={{ padding:'10px 18px', borderRadius:10, background:'transparent', color:C.gray600, border:`1px solid ${C.gray200}`, cursor:'pointer', fontSize:13, fontWeight:500 }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ padding:'11px 26px', borderRadius:10, background:`linear-gradient(135deg, ${C.deep}, ${C.primary})`, color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, boxShadow:`0 6px 20px ${C.primary}40`, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Posting...' : 'Publish Job →'}
              </button>
            </div>
          </div>

          {/* RIGHT — Live Preview */}
          {isMobile && null}
          {!isMobile && <LivePreview form={form} profile={profile} />}
        </div>
      </form>

    </DashboardLayout>
  );
}