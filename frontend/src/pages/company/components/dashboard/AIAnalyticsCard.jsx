// AIAnalyticsCard.jsx
// Shows AI hiring intelligence for company dashboard

import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { getRankedCandidates } from '../../../../services/aiService';
import { getMyJobs } from '../../../../services/jobService';

export default function AIAnalyticsCard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get company jobs first
        const jobs = await getMyJobs();
        if (!jobs || jobs.length === 0) {
          setLoading(false);
          return;
        }

        // Get ranked candidates for first published job
        const publishedJob = jobs.find(j => j.status === 'published' && (j.applicationsCount || 0) > 0);
        if (!publishedJob) {
          setLoading(false);
          return;
        }

        const data = await getRankedCandidates(publishedJob._id);
        const ranked = data.ranked || [];

        if (ranked.length === 0) {
          setLoading(false);
          return;
        }

        // Calculate analytics
        const scores = ranked.map(r => r.score);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

        // Top missing skills
        const missingCount = {};
        ranked.forEach(r => {
          (r.missingSkills || []).forEach(skill => {
            missingCount[skill] = (missingCount[skill] || 0) + 1;
          });
        });
        const topMissing = Object.entries(missingCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([skill, count]) => ({ skill, count }));

        // Quality distribution
        const strong   = scores.filter(s => s >= 70).length;
        const moderate = scores.filter(s => s >= 40 && s < 70).length;
        const weak     = scores.filter(s => s < 40).length;

        setAnalytics({
          avgScore,
          topMissing,
          strong,
          moderate,
          weak,
          total: ranked.length,
          jobTitle: publishedJob.title,
        });

      } catch (err) {
        // Silent fail — analytics is optional
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="h-8 bg-gray-100 rounded mb-2" />
          <div className="h-8 bg-gray-100 rounded mb-2" />
          <div className="h-8 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles size={14} color="#fff" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">AI Hiring Intelligence</h3>
        </div>
        <p className="text-xs text-gray-400 text-center py-4">
          Post a job and receive applications to see AI insights.
        </p>
      </div>
    );
  }

  const scoreColor = analytics.avgScore >= 70 ? 'text-green-600' :
                     analytics.avgScore >= 40 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <Sparkles size={14} color="#fff" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-gray-900">AI Hiring Intelligence</h3>
          <p className="text-[10px] text-gray-400">{analytics.jobTitle}</p>
        </div>
      </div>

      {/* Average Match Score */}
      <div className="bg-violet-50 rounded-xl p-3 mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Avg Match Score</p>
          <p className={`text-2xl font-black ${scoreColor}`}>{analytics.avgScore}%</p>
        </div>
        <TrendingUp size={28} className="text-violet-300" />
      </div>

      {/* Quality Distribution */}
      <div className="mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Candidate Quality
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-green-700">{analytics.strong}</p>
            <p className="text-[10px] text-green-600 font-semibold">Strong</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-amber-700">{analytics.moderate}</p>
            <p className="text-[10px] text-amber-600 font-semibold">Moderate</p>
          </div>
          <div className="bg-red-50 rounded-lg p-2 text-center">
            <p className="text-lg font-black text-red-600">{analytics.weak}</p>
            <p className="text-[10px] text-red-500 font-semibold">Weak</p>
          </div>
        </div>
      </div>

      {/* Top Missing Skills */}
      {analytics.topMissing.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Top Skill Gaps
          </p>
          <div className="flex flex-col gap-1.5">
            {analytics.topMissing.map(({ skill, count }) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{skill}</span>
                <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                  {count} candidate{count > 1 ? 's' : ''} missing
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}