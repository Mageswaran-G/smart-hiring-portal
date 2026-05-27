import React from 'react';

export default function AIHealthCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">AI Health Metrics</h3>
          <p className="text-xs text-gray-500">Platform AI usage overview</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-purple-700">{data.adoptionRate}%</p>
          <p className="text-xs text-purple-500 font-medium mt-1">AI Adoption</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-700">{data.aiParsedCandidates}</p>
          <p className="text-xs text-blue-500 font-medium mt-1">Resume Parsed</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-green-700">{data.totalActiveJobs}</p>
          <p className="text-xs text-green-500 font-medium mt-1">Active Jobs</p>
        </div>
      </div>

      {/* Top Skills */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Top Skills on Platform
        </p>
        <div className="flex flex-wrap gap-2">
          {data.topSkills?.map(({ skill, count }) => (
            <span
              key={skill}
              className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {skill} <span className="text-gray-400">({count})</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}