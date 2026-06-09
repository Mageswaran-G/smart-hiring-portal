import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';
import ScoreBadge from './ScoreBadge';
import SkillChip from './SkillChip';

export default function RecommendationCard({ job, index }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-purple-300 hover:shadow-xl transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-md">#{index + 1}</span>
            <ScoreBadge score={job.matchScore} />
          </div>
          <h3 className="font-extrabold text-gray-900 text-base mb-1">{job.title}</h3>
          <div className="flex gap-3 flex-wrap">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} /> {job.location || 'Remote'}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Briefcase size={12} /> {job.jobType} · {job.workMode}
            </span>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400 flex-shrink-0 mt-1" />
      </div>

      {/* Matched Skills */}
      {job.matchedSkills?.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-green-600 font-bold mb-1 uppercase tracking-wide">Matched</p>
          <div className="flex gap-1 flex-wrap">
            {job.matchedSkills.slice(0, 5).map((s) => (
              <SkillChip key={s} label={s} type='matched' />
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {job.missingSkills?.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-red-600 font-bold mb-1 uppercase tracking-wide">Missing</p>
          <div className="flex gap-1 flex-wrap">
            {job.missingSkills.slice(0, 3).map((s) => (
              <SkillChip key={s} label={s} type='missing' />
            ))}
          </div>
        </div>
      )}

      {/* Learning Suggestions */}
      {job.suggestions?.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-amber-600 font-bold mb-1 uppercase tracking-wide">Recommended Learning</p>
          <div className="flex gap-1 flex-wrap">
            {job.suggestions.slice(0, 2).map((item) =>
              item.resources.slice(0, 1).map((r) => (
                <SkillChip key={r} label={r} type='suggestion' />
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
