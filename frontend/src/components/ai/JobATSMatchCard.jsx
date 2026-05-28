import React from 'react';
import { FileSearch, CheckCircle, XCircle } from 'lucide-react';
import { clampPercent, getBarColor, SCORE_COLOR_MAP } from '../../utils/scoreColors';
import CardSkeleton from '../ui/CardSkeleton';

const JobATSMatchCard = ({ data, loading }) => {
  if (loading) return <CardSkeleton variant="analytics" />;
  if (!data) return null;

  const atsColors = SCORE_COLOR_MAP[
    data.overallATSScore >= 80 ? 'green' :
    data.overallATSScore >= 60 ? 'blue' :
    data.overallATSScore >= 40 ? 'orange' : 'red'
  ];

  const matchColors = SCORE_COLOR_MAP[
    data.skillMatchScore >= 80 ? 'green' :
    data.skillMatchScore >= 60 ? 'blue' :
    data.skillMatchScore >= 40 ? 'orange' : 'red'
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <FileSearch size={20} className="text-violet-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">Resume vs Job Match</h3>
          <p className="text-xs text-gray-500">How well your resume fits this job</p>
        </div>
      </div>

      {/* Two Score Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className={`rounded-xl p-4 text-center ${atsColors.bg}`}>
          <p className={`text-3xl font-black ${atsColors.ring}`}>
            {clampPercent(data.overallATSScore)}
          </p>
          <p className="text-xs font-semibold text-gray-500 mt-1">ATS Score</p>
          <p className={`text-xs font-bold mt-1 ${atsColors.ring}`}>{data.atsLabel}</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${matchColors.bg}`}>
          <p className={`text-3xl font-black ${matchColors.ring}`}>
            {clampPercent(data.skillMatchScore)}%
          </p>
          <p className="text-xs font-semibold text-gray-500 mt-1">Skill Match</p>
          <p className="text-xs text-gray-400 mt-1">{data.totalJobSkills} skills required</p>
        </div>
      </div>

      {/* Skill Match Bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-semibold text-gray-600">Overall Job Fit</span>
          <span className="text-xs font-bold text-gray-700">
            {clampPercent(Math.round((data.overallATSScore + data.skillMatchScore) / 2))}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getBarColor(Math.round((data.overallATSScore + data.skillMatchScore) / 2))}`}
            style={{ width: `${clampPercent(Math.round((data.overallATSScore + data.skillMatchScore) / 2))}%` }}
          />
        </div>
      </div>

      {/* Matched Skills */}
      {data.matchedSkills?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            <CheckCircle size={14} className="text-green-500" />
            <p className="text-xs font-bold text-green-700">
              Matched Skills ({data.matchedSkills.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {data.matchedSkills.map((skill, i) => (
              <span key={i} className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {data.missingSkills?.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-2">
            <XCircle size={14} className="text-red-400" />
            <p className="text-xs font-bold text-red-600">
              Missing Skills ({data.missingSkills.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {data.missingSkills.map((skill, i) => (
              <span key={i} className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default React.memo(JobATSMatchCard);