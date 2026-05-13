// PublicJobsPage.jsx
// Public job listing with search, filter, and pagination

import { useEffect, useState, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getAllJobs } from '../../services/jobService';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';
import PublicJobCard from '../../components/jobs/PublicJobCard';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '../../constants/jobConstants';

// Default filter state — one place, easy to reset
const DEFAULT_FILTERS = {
  search: '',
  jobType: '',
  workMode: '',
  experienceLevel: '',
  location: '',
  page: 1,
  limit: 9,
};

export default function PublicJobsPage() {

  const { user } = useAuth();
  const isCandidate = user?.role === 'candidate';

  // ── State ────────────────────────────────────────
  const [jobs,       setJobs]       = useState([]);
  const [savedIds,   setSavedIds]   = useState(new Set());
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [filters,    setFilters]    = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(null);

  // ── Fetch jobs whenever filters change ───────────
  const fetchJobs = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError('');

      // Remove empty values — don't send empty strings to API
      const cleanParams = Object.fromEntries(
        Object.entries(currentFilters).filter(([_, v]) => v !== '' && v !== null)
      );

      const data = await getAllJobs(cleanParams);
      setJobs(data.data || []);
      setPagination(data.pagination || null);

    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch saved IDs once on mount (candidates only)
  useEffect(() => {
    if (!isCandidate) return;
    const fetchSaved = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.SAVED_JOB_IDS);
        setSavedIds(new Set(res.data.data));
      } catch (_) {}
    };
    fetchSaved();
  }, [isCandidate]);

  // Fetch jobs whenever filters change
  useEffect(() => {
    fetchJobs(filters);
  }, [filters, fetchJobs]);

  // ── Handlers ─────────────────────────────────────

  // Update one filter — reset page to 1 always
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Search submit (Enter key or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // filters.search is already set by onChange — just re-trigger
    fetchJobs(filters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Check if any filter is active
  const hasActiveFilters = 
    filters.search || filters.jobType || filters.workMode || 
    filters.experienceLevel || filters.location;

  // Pagination
  const goToPage = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top
  };

  // Save / Unsave
  const handleToggleSave = useCallback(async (jobId) => {
    const alreadySaved = savedIds.has(jobId);
    try {
      if (alreadySaved) {
        await API.delete(API_ENDPOINTS.UNSAVE_JOB(jobId));
        setSavedIds(prev => { const s = new Set(prev); s.delete(jobId); return s; });
      } else {
        await API.post(API_ENDPOINTS.SAVE_JOB(jobId));
        setSavedIds(prev => new Set(prev).add(jobId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update saved jobs');
    }
  }, [savedIds]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-sora text-3xl font-bold text-gray-900">
            Explore Jobs
          </h1>
          <p className="mt-1 text-gray-500">
            {pagination ? `${pagination.total} jobs found` : 'Browse all open positions'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* ── Search + Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">

          {/* Search row */}
          <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by title, skill, or keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2.5
                  border border-gray-200 rounded-xl
                  text-sm text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  placeholder:text-gray-400
                "
              />
            </div>
            <button
              type="submit"
              className="
                bg-blue-600 hover:bg-blue-700
                text-white font-semibold
                px-5 py-2.5 rounded-xl
                text-sm transition-colors
              "
            >
              Search
            </button>
          </form>

          {/* Filter dropdowns row */}
          <div className="flex flex-wrap gap-3 items-center">

            <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />

            {/* Location */}
            <input
              type="text"
              placeholder="Location (e.g. Chennai)"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="
                border border-gray-200 rounded-lg
                px-3 py-2 text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
                min-w-[160px]
              "
            />

            {/* Job Type */}
            <select
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              className="
                border border-gray-200 rounded-lg
                px-3 py-2 text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
                bg-white cursor-pointer
              "
            >
              <option value="">All Job Types</option>
              {JOB_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {/* Work Mode */}
            <select
              value={filters.workMode}
              onChange={(e) => handleFilterChange('workMode', e.target.value)}
              className="
                border border-gray-200 rounded-lg
                px-3 py-2 text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
                bg-white cursor-pointer
              "
            >
              <option value="">All Work Modes</option>
              {WORK_MODES.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            {/* Experience Level */}
            <select
              value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              className="
                border border-gray-200 rounded-lg
                px-3 py-2 text-sm text-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
                bg-white cursor-pointer
              "
            >
              <option value="">All Levels</option>
              {EXPERIENCE_LEVELS.map(l => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>

            {/* Clear filters button — only show when active */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="
                  flex items-center gap-1.5
                  text-sm text-red-500 hover:text-red-700
                  border border-red-200 hover:border-red-400
                  px-3 py-2 rounded-lg transition
                "
              >
                <X size={14} />
                Clear Filters
              </button>
            )}

          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
                <div className="h-5 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 rounded mb-2 w-1/2" />
                <div className="h-3 bg-gray-100 rounded mb-4 w-1/3" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                </div>
                <div className="h-9 bg-gray-100 rounded-xl w-28" />
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm mb-4">
            {error}
          </div>
        )}

        {/* ── No results ── */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Search size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="font-sora font-bold text-gray-700 text-lg mb-1">
              No jobs found
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* ── Job cards grid ── */}
        {!loading && jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => (
                <PublicJobCard
                  key={job._id}
                  job={job}
                  isSaved={savedIds.has(job._id)}
                  onToggleSave={isCandidate ? handleToggleSave : undefined}
                />
              ))}
            </div>

            {/* ── Pagination ── */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">

                {/* Previous */}
                <button
                  onClick={() => goToPage(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="
                    px-4 py-2 rounded-xl text-sm font-semibold
                    border border-gray-200 text-gray-600
                    hover:bg-gray-50 disabled:opacity-40
                    disabled:cursor-not-allowed transition
                  "
                >
                  ← Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`
                      w-9 h-9 rounded-xl text-sm font-semibold transition
                      ${pageNum === filters.page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => goToPage(filters.page + 1)}
                  disabled={!pagination.hasNext}
                  className="
                    px-4 py-2 rounded-xl text-sm font-semibold
                    border border-gray-200 text-gray-600
                    hover:bg-gray-50 disabled:opacity-40
                    disabled:cursor-not-allowed transition
                  "
                >
                  Next →
                </button>

              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}