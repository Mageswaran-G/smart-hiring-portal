import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';
import ScoreBadge from './ScoreBadge';

export default function RecommendationCard({ job, index }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job.slug}`)}
      style={{ background:'#fff', borderRadius:18, border:'1px solid #e5e7eb', padding:'20px 24px', cursor:'pointer', transition:'all 0.15s', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(124,58,237,0.12)'; e.currentTarget.style.borderColor='#c4b5fd'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor='#e5e7eb'; }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <span style={{ background:'#f3f4f6', color:'#6b7280', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6 }}>#{index + 1}</span>
            <ScoreBadge score={job.matchScore} />
          </div>
          <h3 style={{ fontWeight:800, fontSize:17, color:'#111827', margin:'0 0 4px', letterSpacing:'-0.3px' }}>{job.title}</h3>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'#6b7280', display:'flex', alignItems:'center', gap:4 }}>
              <MapPin size={12} /> {job.location || 'Remote'}
            </span>
            <span style={{ fontSize:12, color:'#6b7280', display:'flex', alignItems:'center', gap:4 }}>
              <Briefcase size={12} /> {job.jobType} · {job.workMode}
            </span>
          </div>
        </div>
        <ChevronRight size={18} color="#9ca3af" style={{ flexShrink:0, marginTop:4 }} />
      </div>

      {/* Matched Skills */}
      {job.matchedSkills?.length > 0 && (
        <div style={{ marginBottom:8 }}>
          <p style={{ fontSize:11, color:'#16a34a', fontWeight:700, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:0.5 }}>Matched</p>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {job.matchedSkills.slice(0, 5).map((s, j) => (
              <span key={j} style={{ background:'#dcfce7', color:'#15803d', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {job.missingSkills?.length > 0 && (
        <div>
          <p style={{ fontSize:11, color:'#dc2626', fontWeight:700, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:0.5 }}>Missing</p>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {job.missingSkills.slice(0, 3).map((s, j) => (
              <span key={j} style={{ background:'#fef2f2', color:'#dc2626', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}