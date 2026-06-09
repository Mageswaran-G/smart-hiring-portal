import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';
import ScoreBadge from './ScoreBadge';
import SkillChip from './SkillChip';

export default function RecommendationCard({ job, index }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      className="bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-200 cursor-pointer"
      style={{ padding:'20px 24px' }}
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
              <SkillChip key={j} label={s} type='matched' />
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
              <SkillChip key={j} label={s} type='missing' />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}