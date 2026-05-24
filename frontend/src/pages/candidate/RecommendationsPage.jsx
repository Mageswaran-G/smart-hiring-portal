// RecommendationsPage.jsx — AI Job Recommendations for Candidates

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Briefcase, ChevronRight, BookOpen } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getRecommendations } from '../../services/aiService';
import { ROUTES } from '../../constants/routes';

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626';
  const bg    = score >= 70 ? '#dcfce7' : score >= 40 ? '#fef3c7' : '#fef2f2';
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:bg, color, padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
      <Sparkles size={11} />
      {score}% Match
    </div>
  );
}

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecommendations();
        setJobs(data.recommendations || []);
        if (data.message) setMessage(data.message);
      } catch {
        setMessage('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg, #7c3aed, #a855f7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontWeight:900, fontSize:24, color:'#111827', margin:0, letterSpacing:'-0.5px' }}>
                AI Recommendations
              </h1>
              <p style={{ fontSize:13, color:'#6b7280', margin:0 }}>
                Jobs matched to your skills
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height:120, background:'#f3f4f6', borderRadius:16, animation:'pulse 1.5s ease-in-out infinite' }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
          </div>
        )}

        {/* Empty / Message */}
        {!loading && (jobs.length === 0 || message) && (
          <div style={{ textAlign:'center', padding:'48px 20px', background:'#f9fafb', borderRadius:20, border:'1px solid #e5e7eb' }}>
            <BookOpen size={40} color="#9ca3af" style={{ margin:'0 auto 12px' }} />
            <p style={{ fontWeight:700, fontSize:16, color:'#374151', margin:'0 0 6px' }}>
              {jobs.length === 0 ? 'No recommendations yet' : 'Getting ready...'}
            </p>
            <p style={{ fontSize:13, color:'#6b7280', margin:'0 0 16px' }}>
              {message || 'Upload your resume or add skills to get AI-powered job recommendations'}
            </p>
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              style={{ background:'#7c3aed', color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}
            >
              Update Profile
            </button>
          </div>
        )}

        {/* Job Cards */}
        {!loading && jobs.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {jobs.map((job, i) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job.slug}`)}
                style={{ background:'#fff', borderRadius:18, border:'1px solid #e5e7eb', padding:'20px 24px', cursor:'pointer', transition:'all 0.15s', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(124,58,237,0.12)'; e.currentTarget.style.borderColor='#c4b5fd'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor='#e5e7eb'; }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ background:'#f3f4f6', color:'#6b7280', fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:6 }}>#{i+1}</span>
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
                    <p style={{ fontSize:11, color:'#16a34a', fontWeight:700, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:0.5 }}>✅ Matched</p>
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
                    <p style={{ fontSize:11, color:'#dc2626', fontWeight:700, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:0.5 }}>❌ Missing</p>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {job.missingSkills.slice(0, 3).map((s, j) => (
                        <span key={j} style={{ background:'#fef2f2', color:'#dc2626', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:600 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
