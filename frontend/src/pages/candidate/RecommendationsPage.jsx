// RecommendationsPage.jsx — AI Job Recommendations for Candidates

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen } from 'lucide-react';
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
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shrink-0">
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h1 className="font-black text-2xl text-gray-900 tracking-tight mb-0">
              AI Recommendations
            </h1>
            <p className="text-sm text-gray-500 mt-0">
              Jobs matched to your skills
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty / Message */}
        {!loading && (jobs.length === 0 || message) && (
          <div className="text-center py-12 px-5 bg-gray-50 rounded-2xl border border-gray-200">
            <BookOpen size={40} className="text-gray-400 mx-auto mb-3" />
            <p className="font-bold text-base text-gray-700 mb-1">
              {jobs.length === 0 ? 'No recommendations yet' : 'Getting ready...'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {message || 'Upload your resume or add skills to get AI-powered job recommendations'}
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.PROFILE)}
              className="bg-violet-600 text-white border-none rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer hover:bg-violet-700 transition-colors"
            >
              Update Profile
            </button>
          </div>
        )}

        {/* Job Cards */}
        {!loading && jobs.length > 0 && (
          <div className="flex flex-col gap-3">
            {jobs.map((job, i) => (
              <RecommendationCard key={job._id} job={job} index={i} />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}