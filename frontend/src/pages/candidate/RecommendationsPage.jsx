// RecommendationsPage.jsx — AI Job Recommendations for Candidates

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Briefcase, ChevronRight, BookOpen } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getRecommendations } from '../../services/ai/recommendationService';
import RecommendationCard from '../../components/ai/RecommendationCard';
import { ROUTES } from '../../constants/routes';

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
              <RecommendationCard key={job._id} job={job} index={i} />
            ))}
              </div>
        )}
      </div>
    </DashboardLayout>
  );
}
