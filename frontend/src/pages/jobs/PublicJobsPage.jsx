import DashboardLayout from "../../components/layout/DashboardLayout";
// PublicJobsPage.jsx — cursor pagination + load more

import { useEffect, useState, useCallback } from 'react';
import { useNavigate }         from 'react-router-dom';
import { Search, SlidersHorizontal, X, LayoutDashboard, Loader2 } from 'lucide-react';
import { getAllJobs }           from '../../services/jobService';
import { API }                 from '../../services/authService';
import { API_ENDPOINTS }       from '../../constants/api';
import { useAuth }             from '../../context/AuthContext';
import PublicJobCard           from '../../components/jobs/PublicJobCard';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '../../constants/jobConstants';
import { useDebounce }         from '../../hooks/useDebounce';
import { ROUTES }              from '../../constants/routes';

const DEFAULT_FILTERS = {
  search:          '',
  jobType:         '',
  workMode:        '',
  experienceLevel: '',
  location:        '',
};

function FilterPill({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">
        <X size={12} />
      </button>
    </span>
  );
}

export default function PublicJobsPage() {

  const { user }    = useAuth();
  const navigate    = useNavigate();
  const isCandidate = user?.role === 'candidate';

  const [jobs,       setJobs]       = useState([]);
  const [savedIds,   setSavedIds]   = useState(new Set());
  const [loading,    setLoading]    = useState(true);
  const [loadingMore,setLoadingMore]= useState(false);
  const [filters,    setFilters]    = useState(DEFAULT_FILTERS);
  const [total,      setTotal]      = useState(0);
  const [nextCursor, setNextCursor] = useState(null);  // cursor for next page
  const [hasMore,    setHasMore]    = useState(false);

  const debouncedSearch = useDebounce(filters.search, 400);

  // Build clean params (remove empty values)
  const buildParams = useCallback((cursor = null) => {
    const params = {};
    if (debouncedSearch)        params.search          = debouncedSearch;
    if (filters.jobType)        params.jobType         = filters.jobType;
    if (filters.workMode)       params.workMode        = filters.workMode;
    if (filters.experienceLevel)params.experienceLevel = filters.experienceLevel;
    if (filters.location)       params.location        = filters.location;
    if (cursor)                 params.cursor          = cursor;
    params.limit = 9;
    return params;
  }, [debouncedSearch, filters]);

  // Initial load — fetch first page
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllJobs(buildParams(null));
      setJobs(data.data || []);
      setTotal(data.pagination?.total || 0);
      setNextCursor(data.pagination?.nextCursor || null);
      setHasMore(data.pagination?.hasMore || false);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // Load more — append to existing list
  const fetchMore = async () => {
    if (!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const data = await getAllJobs(buildParams(nextCursor));
      setJobs(prev => [...prev, ...(data.data || [])]);  // APPEND, not replace
      setNextCursor(data.pagination?.nextCursor || null);
      setHasMore(data.pagination?.hasMore || false);
    } catch {
      // silent fail
    } finally {
      setLoadingMore(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Fetch saved IDs for candidates
  useEffect(() => {
    if (!isCandidate) return;
    const fetch = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.SAVED_JOB_IDS);
        setSavedIds(new Set(res.data.data));
      } catch (_) {}
    };
    fetch();
  }, [isCandidate]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  const hasActiveFilters = filters.search || filters.jobType ||
    filters.workMode || filters.experienceLevel || filters.location;

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
    } catch (_) {}
  }, [savedIds]);

  return (
    <DashboardLayout>


      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-sora text-3xl font-bold text-gray-900">Explore Jobs</h1>
          <p className="mt-1 text-gray-500">
            {total > 0 ? `${total} jobs found` : 'Browse all open positions'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">

          <form onSubmit={(e) => e.preventDefault()} className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, skill, or keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-3 items-center">
            <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Location (e.g. Chennai)"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto sm:min-w-[160px]"
            />
            <select value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">All Job Types</option>
              {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={filters.workMode}
              onChange={(e) => handleFilterChange('workMode', e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">All Work Modes</option>
              {WORK_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">All Levels</option>
              {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={handleClearFilters}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-2 rounded-lg transition">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-gray-400 self-center">Active filters:</span>
            {filters.search      && <FilterPill label={`Search: "${filters.search}"`}      onRemove={() => handleFilterChange('search', '')} />}
            {filters.location    && <FilterPill label={`Location: ${filters.location}`}    onRemove={() => handleFilterChange('location', '')} />}
            {filters.jobType     && <FilterPill label={`Type: ${filters.jobType}`}         onRemove={() => handleFilterChange('jobType', '')} />}
            {filters.workMode    && <FilterPill label={`Mode: ${filters.workMode}`}        onRemove={() => handleFilterChange('workMode', '')} />}
            {filters.experienceLevel && <FilterPill label={`Level: ${filters.experienceLevel}`} onRemove={() => handleFilterChange('experienceLevel', '')} />}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
                <div className="h-5 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 rounded mb-2 w-1/2" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                </div>
                <div className="h-9 bg-gray-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && jobs.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <Search size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="font-sora font-bold text-gray-700 text-lg mb-1">No jobs found</p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Job cards grid */}
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

            {/* Load More button — cursor pagination */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={fetchMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More Jobs`
                  )}
                </button>
              </div>
            )}

            {/* No more jobs message */}
            {!hasMore && jobs.length > 9 && (
              <p className="text-center text-gray-400 text-sm mt-8">
                You have seen all {total} jobs
              </p>
            )}
          </>
        )}

      </div>
    </DashboardLayout>
  );
}