// ApplicationFilters.jsx — Search, job filter, status filter
import React from 'react';
import { Search } from 'lucide-react';
import { APPLICATION_STATUS, APPLICATION_STATUS_OPTIONS } from '../../../../constants/applicationStatus';

export default function ApplicationFilters({
  searchName, setSearchName,
  filterJob, setFilterJob,
  filterStatus, setFilterStatus,
  jobOptions, filtersActive,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row flex-wrap gap-3">
      <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search candidate name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {jobOptions.length > 1 && (
        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}
          className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white">
          <option value="all">All Jobs</option>
          {jobOptions.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
        </select>
      )}

      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
        className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white">
        <option value="all">All Statuses</option>
        {APPLICATION_STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{APPLICATION_STATUS[s].label}</option>
        ))}
      </select>

      {filtersActive && (
        <button
          onClick={() => { setFilterJob('all'); setFilterStatus('all'); setSearchName(''); }}
          className="w-full sm:w-auto text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition">
          Clear
        </button>
      )}
    </div>
  );
}