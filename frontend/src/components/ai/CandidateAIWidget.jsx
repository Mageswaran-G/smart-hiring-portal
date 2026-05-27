

import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { getMatchScoreBatch } from '../../services/aiService';
import { getAllJobs } from '../../services/jobService';

export default function CandidateAIWidget({ profile }) {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllJobs({ limit: 10 });
        const jobs = data.data || [];
        if (!jobs.length) { setLoading(false); return; }

        const jobIds = jobs.map(j => j._id);
        const scores = await getMatchScoreBatch(jobIds);

        const entries  = Object.entries(scores);
        if (!entries.length) { setLoading(false); return; }

        const topEntry = entries.sort((a, b) => b[1] - a[1])[0];
        const topJob   = jobs.find(j => j._id === topEntry[0]);
        const topScore = topEntry[1];

        const avgScore = Math.round(
          entries.reduce((sum, [, s]) => sum + s, 0) / entries.length
        );

        const strongCount = entries.filter(([, s]) => s >= 70).length;

        setInsights({ topJob, topScore, avgScore, strongCount, total: entries.length });
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
        <div className="h-16 bg-gray-50 rounded-xl mb-2" />
        <div className="h-16 bg-gray-50 rounded-xl" />
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <Sparkles size={14} color="#fff" />
        </div>
        <p className="font-bold text-sm text-gray-900">AI Insights</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">

        {/* Top Match */}
        {insights.topJob && (
          <div
            className="bg-violet-50 rounded-xl p-3 border border-violet-100 cursor-pointer hover:bg-violet-100 transition"
            onClick={() => navigate(ROUTES.JOB_DETAILS.replace(':slug', insights.topJob.slug || insights.topJob._id))}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wide">Best Match</p>
              <span className="text-xs font-black text-violet-700">{insights.topScore}%</span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">{insights.topJob.title}</p>
            <p className="text-xs text-gray-500 truncate">{insights.topJob.postedBy?.companyName || 'Company'}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 rounded-xl p-3 border border-green-100">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} className="text-green-600" />
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Avg Score</p>
            </div>
            <p className="text-xl font-black text-green-700">{insights.avgScore}%</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen size={12} className="text-blue-600" />
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Strong Fits</p>
            </div>
            <p className="text-xl font-black text-blue-700">{insights.strongCount}<span className="text-sm font-normal text-blue-400">/{insights.total}</span></p>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.CANDIDATE_RECOMMENDATIONS)}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl text-xs transition"
        >
          <Sparkles size={12} />
          View AI Recommendations
          <ArrowRight size={12} />
        </button>

      </div>
    </div>
  );
}