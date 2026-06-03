// AI Candidate Ranking section
import React from 'react';
import CandidateRankCard from '../../../../components/ai/CandidateRankCard';

export default function AIRankingPanel({
  jobOptions, showRanking, setShowRanking,
  rankFilters, setRankFilters,
  ranking, rankLoading, fetchRanking, filterJob,
}) {
  const currentJobId = filterJob === 'all' ? jobOptions[0]?.[0] : filterJob;

  return (
    <div className="mb-4">
      <button
        onClick={() => showRanking ? setShowRanking(false) : fetchRanking(currentJobId)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition ${
          showRanking
            ? 'bg-violet-600 text-white border-violet-600'
            : 'bg-white text-violet-600 border-violet-400 hover:bg-violet-50'
        }`}
      >
        AI Candidate Ranking {showRanking ? '— Hide' : '— Show'}
      </button>

      {showRanking && (
        <div className="mt-3">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-5 p-3 bg-violet-50 rounded-xl border border-violet-100 mt-3">
            <select
              value={rankFilters.minScore}
              onChange={e => setRankFilters(p => ({ ...p, minScore: e.target.value }))}
              className="flex-1 min-w-[140px] text-sm px-3 py-2 rounded-lg border border-violet-200 bg-white text-gray-700 font-semibold focus:outline-none"
            >
              <option value="">All Scores</option>
              <option value="80">80%+ only</option>
              <option value="65">65%+ only</option>
              <option value="50">50%+ only</option>
            </select>

            <select
              value={rankFilters.recommendation}
              onChange={e => setRankFilters(p => ({ ...p, recommendation: e.target.value }))}
              className="flex-1 min-w-[140px] text-sm px-3 py-2 rounded-lg border border-violet-200 bg-white text-gray-700 font-semibold focus:outline-none"
            >
              <option value="">All Labels</option>
              <option value="Strong Hire">Strong Hire</option>
              <option value="Hire">Hire</option>
              <option value="Consider">Consider</option>
              <option value="Reject">Reject</option>
            </select>

            <select
              value={rankFilters.sortBy}
              onChange={e => setRankFilters(p => ({ ...p, sortBy: e.target.value }))}
              className="flex-1 min-w-[140px] text-sm px-3 py-2 rounded-lg border border-violet-200 bg-white text-gray-700 font-semibold focus:outline-none"
            >
              <option value="score">Sort by Score</option>
              <option value="recent">Sort by Recent</option>
              <option value="name">Sort by Name</option>
            </select>

            <button
              onClick={() => fetchRanking(currentJobId)}
              className="text-sm px-4 py-2 rounded-lg bg-violet-600 text-white font-bold hover:bg-violet-700 transition whitespace-nowrap"
            >
              Apply Filters
            </button>
          </div>

          <CandidateRankCard ranking={ranking} loading={rankLoading} />
        </div>
      )}
    </div>
  );
}