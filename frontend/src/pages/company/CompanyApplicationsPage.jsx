// CompanyApplicationsPage.jsx
// Shows all applicants for company's jobs
// Pagination: Load More loads next page from backend
// Filtering: works on all loaded data (client-side)

import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { Users, Mail, MapPin, FileText, Search, ChevronDown } from 'lucide-react';
import toast                                              from 'react-hot-toast';
import DashboardLayout                                    from '../../components/layout/DashboardLayout';
import PageHeader                                         from '../../components/ui/PageHeader';
import EmptyState                                         from '../../components/ui/EmptyState';
import SafeAvatar                                         from '../../components/ui/SafeAvatar';
import { ROUTES }                                         from '../../constants/routes';
import { APPLICATION_STATUS, APPLICATION_STATUS_OPTIONS } from '../../constants/applicationStatus';
import { getCompanyApplicationsPaginated, updateApplicationStatus } from '../../services/applicationService';
import { useDebounce }                                    from '../../hooks/useDebounce';

const LIMIT = 10;

export default function CompanyApplicationsPage() {

  const fetchedRef = useRef(false);

  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [hasMore,      setHasMore]      = useState(false);
  const [total,        setTotal]        = useState(0);

  const [filterJob,    setFilterJob]    = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchName,   setSearchName]   = useState('');
  const [updating,     setUpdating]     = useState(null);
  const [showRanking,  setShowRanking]  = useState(false);
  const [ranking,      setRanking]      = useState([]);
  const [rankLoading,  setRankLoading]  = useState(false);

  const debouncedSearch = useDebounce(searchName, 300);

  const loadPage = useCallback(async (pageNum, isFirstLoad = false) => {
    try {
      const { data, pagination } = await getCompanyApplicationsPaginated(pageNum, LIMIT);

      if (isFirstLoad) {
        setApplications(data);
      } else {
        setApplications(prev => [...prev, ...data]);
      }

      setTotal(pagination.total);
      setHasMore(pagination.hasMore);
      setPage(pageNum);

    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ── Load first page on mount ──────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    loadPage(1, true);
  }, [loadPage]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    loadPage(page + 1, false);
  };

  // ── Build job filter options from loaded data ─────────────
  const jobOptions = useMemo(() => {
    const seen = new Map();
    applications.forEach((app) => {
      if (app.job && !seen.has(app.job._id)) {
        seen.set(app.job._id, app.job.title);
      }
    });
    return Array.from(seen.entries());
  }, [applications]);

  // ── 3-level filter on loaded data ────────────────────────
  const filtered = useMemo(() => {
    let result = applications;

    if (filterJob !== 'all') {
      result = result.filter(app => app.job?._id === filterJob);
    }
    if (filterStatus !== 'all') {
      result = result.filter(app => app.status === filterStatus);
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(app =>
        app.candidate?.name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [applications, filterJob, filterStatus, debouncedSearch]);

  // ── Update status ─────────────────────────────────────────
  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Moved to ${APPLICATION_STATUS[newStatus]?.label}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  // ── Are any filters active? ───────────────────────────────

  const fetchRanking = async (jobId) => {
    if (!jobId || jobId === "all") return;
    try {
      setRankLoading(true);
      setShowRanking(true);
      const data = await getRankedCandidates(jobId);
      setRanking(data.ranked || []);
    } catch {
      setShowRanking(false);
    } finally {
      setRankLoading(false);
    }
  };
  const filtersActive = filterJob !== 'all' || filterStatus !== 'all' || searchName;

  return (
    <DashboardLayout>

      {/* ── Page Header ── */}
      <PageHeader
        title="Applicants"
        subtitle={
          loading
            ? 'Loading...'
            : filtersActive
              ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} (filtered)`
              : `${total} total applicant${total !== 1 ? 's' : ''}`
        }
        backRoute={ROUTES.COMPANY_DASHBOARD}
      />

      {/* ── Search + Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row flex-wrap gap-3">

        {/* Search by name */}
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

        {/* Filter by job */}
        {jobOptions.length > 1 && (
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="all">All Jobs</option>
            {jobOptions.map(([id, title]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>
        )}

        {/* Filter by status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        >
          <option value="all">All Statuses</option>
          {APPLICATION_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{APPLICATION_STATUS[s].label}</option>
          ))}
        </select>

        {/* Clear filters button */}
        {filtersActive && (
          <button
            onClick={() => {
              setFilterJob('all');
              setFilterStatus('all');
              setSearchName('');
            }}
            className="w-full sm:w-auto text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── AI Candidate Ranking ── */}
      {jobOptions.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => showRanking ? setShowRanking(false) : fetchRanking(filterJob === "all" ? jobOptions[0]?.[0] : filterJob)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:12, border:"1px solid #7c3aed", background: showRanking ? "#7c3aed" : "#fff", color: showRanking ? "#fff" : "#7c3aed", fontSize:13, fontWeight:700, cursor:"pointer" }}
          >
            AI Candidate Ranking {showRanking ? "— Hide" : "— Show"}
          </button>
          {showRanking && (
            <div style={{ marginTop:12, background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", overflow:"hidden" }}>
              <div style={{ padding:"14px 20px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"#fff" }}>
                <p style={{ fontWeight:800, fontSize:15, margin:0 }}>AI Candidate Ranking</p>
                <p style={{ fontSize:12, margin:0, opacity:0.8 }}>Sorted by skill match score</p>
              </div>
              {rankLoading && <div style={{ padding:20, textAlign:"center", color:"#6b7280" }}>Calculating rankings...</div>}
              {!rankLoading && ranking.map((r, i) => (
                <div key={r.applicationId} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:"1px solid #f3f4f6" }}>
                  <span style={{ fontWeight:800, fontSize:14, color:"#7c3aed", minWidth:24 }}>#{i+1}</span>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"#7c3aed", fontSize:14 }}>{r.candidate.name?.charAt(0).toUpperCase()}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:14, color:"#111827", margin:0 }}>{r.candidate.name}</p>
                    <p style={{ fontSize:12, color:"#6b7280", margin:0 }}>{r.candidate.email}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ background: r.score>=70?"#dcfce7":r.score>=40?"#fef3c7":"#fef2f2", color: r.score>=70?"#16a34a":r.score>=40?"#d97706":"#dc2626", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700 }}>{r.score}% Match</div>
                    <p style={{ fontSize:11, color:"#6b7280", margin:"2px 0 0" }}>{r.matchedSkills?.length || 0} skills matched</p>
                  </div>
                </div>
              ))}
              {!rankLoading && ranking.length === 0 && <div style={{ padding:20, textAlign:"center", color:"#6b7280" }}>No applicants yet</div>}
            </div>
          )}
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={<Users size={32} />}
          title="No applicants found"
          subtitle={
            filtersActive
              ? 'Try adjusting your search or filters'
              : 'Applications will appear here once candidates apply'
          }
          variant="company"
        />
      )}

      {/* ── Applications list ── */}
      {!loading && filtered.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {filtered.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                  {/* ── Left: Candidate info ── */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">

                    {/* Avatar */}
                    <SafeAvatar
                      src={app.candidate?.profilePhoto ? `${import.meta.env.VITE_API_URL}${app.candidate.profilePhoto}` : ''}
                      name={app.candidate?.name}
                      alt={app.candidate?.name || 'Candidate'}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                      fallbackClassName="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden"
                      textClassName="text-blue-700 font-bold text-base"
                    />

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="font-sora font-bold text-gray-900">
                        {app.candidate?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5 min-w-0">
                        <Mail size={12} className="shrink-0" />
                        <span className="truncate">{app.candidate?.email || '—'}</span>
                      </p>
                      {app.candidate?.headline && (
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {app.candidate.headline}
                        </p>
                      )}

                      {/* Resume buttons */}
                      {app.resume ? (
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <a
                            href={`${import.meta.env.VITE_API_URL}${app.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                          >
                            <FileText size={12} /> View
                          </a>
                          <a
                            href={`${import.meta.env.VITE_API_URL}${app.resume}`}
                            download
                            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition font-medium"
                          >
                            ↓ Download
                          </a>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2">No resume uploaded</p>
                      )}

                      {/* Job title + location + date */}
                      <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-400">
                        <span className="font-medium text-gray-600">
                          {app.job?.title || '—'}
                        </span>
                        {app.job?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {app.job.location}
                          </span>
                        )}
                        <span>
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Cover letter */}
                      {app.coverLetter && (
                        <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 w-full sm:max-w-lg break-words">
                          "{app.coverLetter}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── Right: Status control ── */}
                  <div className="
                    flex flex-row md:flex-col
                    items-center md:items-end
                    justify-between md:justify-start
                    gap-3 md:gap-2
                    shrink-0
                    pt-3 md:pt-0
                    border-t md:border-0
                    border-gray-100
                  ">
                    {/* Status badge */}
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap
                      ${APPLICATION_STATUS[app.status]?.color || 'bg-gray-100 text-gray-600'}
                    `}>
                      {APPLICATION_STATUS[app.status]?.label || app.status}
                    </span>

                    {/* Status dropdown */}
                    <select
                      value={app.status}
                      disabled={updating === app._id}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 bg-white"
                    >
                      {APPLICATION_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {APPLICATION_STATUS[s].label}
                        </option>
                      ))}
                    </select>

                    {updating === app._id && (
                      <span className="text-xs text-gray-400">Saving...</span>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* ── Load More button ── */}
          {hasMore && !filtersActive && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <p className="text-sm text-gray-400">
                Showing {applications.length} of {total} applicants
              </p>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 hover:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Load More Applicants
                  </>
                )}
              </button>
            </div>
          )}

          {/* Note when filters are active and more data exists on server */}
          {hasMore && filtersActive && (
            <p className="text-center text-xs text-gray-400 mt-4 bg-yellow-50 border border-yellow-100 rounded-xl py-3 px-4">
              Showing filtered results from {applications.length} loaded applicants.
              Clear filters and use Load More to see all {total} applicants.
            </p>
          )}

          {/* End of list message */}
          {!hasMore && applications.length > 0 && total > LIMIT && (
            <p className="text-center text-sm text-gray-300 mt-6">
              All {total} applicants loaded
            </p>
          )}
        </>
      )}

    </DashboardLayout>
  );
}
