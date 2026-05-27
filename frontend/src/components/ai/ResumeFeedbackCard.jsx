// ResumeFeedbackCard.jsx — AI Resume Feedback for candidates

import { useState } from 'react';
import { Sparkles, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { generateResumeFeedback } from '../../services/aiService';
import toast from 'react-hot-toast';

export default function ResumeFeedbackCard() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const handleAnalyze = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const data = await generateResumeFeedback();
      setFeedback(data);
      setDone(true);
    } catch {
      toast.error('Failed to analyze profile');
    } finally {
      setLoading(false);
    }
  };

  const atsColor = !feedback ? 'bg-gray-100' :
    feedback.atsScore >= 80 ? 'bg-green-500' :
    feedback.atsScore >= 50 ? 'bg-amber-500' : 'bg-red-400';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles size={15} color="#fff" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">AI Resume Feedback</p>
            <p className="text-[11px] text-gray-400">Analyze your profile strength</p>
          </div>
        </div>
        {done && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="text-xs text-violet-600 hover:text-violet-800 font-semibold underline"
          >
            Re-analyze
          </button>
        )}
      </div>

      <div className="px-6 py-5">

        {/* Before analyze */}
        {!done && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            {loading ? 'Analyzing your profile...' : 'Analyze My Profile'}
          </button>
        )}

        {/* After analyze */}
        {done && feedback && (
          <div className="flex flex-col gap-4">

            {/* ATS Score */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">ATS Score</p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">{feedback.atsScore}%</p>
              </div>
              
            </div>

            {/* ATS progress bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-2">
              <div className={`h-full rounded-full transition-all duration-500 ${atsColor}`}
                style={{ width: `${feedback.atsScore}%` }} />
            </div>

            {/* Strengths */}
            {feedback.strengths?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">Strengths</p>
                <div className="flex flex-col gap-1.5">
                  {feedback.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={13} className="text-green-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Improvements</p>
                <div className="flex flex-col gap-1.5">
                  {feedback.improvements.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing */}
            {feedback.missing?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Missing</p>
                <div className="flex flex-col gap-1.5">
                  {feedback.missing.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}