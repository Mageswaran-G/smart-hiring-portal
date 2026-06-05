// CandidateApplicationsPage
// Shows candidate's own applications with Load More pagination

import { useState, useEffect, useRef }     from 'react';
import { useNavigate }                     from 'react-router-dom';
import { Briefcase, MapPin, Calendar, ChevronDown } from 'lucide-react';
import toast                               from 'react-hot-toast';
import DashboardLayout                     from '../../components/layout/DashboardLayout';
import PageHeader                          from '../../components/ui/PageHeader';
import EmptyState                          from '../../components/ui/EmptyState';
import { APPLICATION_STATUS }             from '../../constants/applicationStatus';
import { getMyApplicationsPaginated, withdrawApplication } from '../../services/applicationService';
import { ROUTES }                          from '../../constants/routes';

const LIMIT = 10; // how many to load per page

export default function CandidateApplicationsPage() {

  const navigate    = useNavigate();
  const fetchedRef  = useRef(false);  // prevent double-fetch

  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [hasMore,      setHasMore]      = useState(false);
  const [total,        setTotal]        = useState(0);
  const [withdrawingId, setWithdrawingId] = useState(null);

  // ── Load first page on mount ──────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    loadPage(1, true);
  }, []);

  // ── Fetch one page from backend ───────────────────────────
  // isFirstLoad=true → replaces all data (fresh start)
  // isFirstLoad=false → appends to existing list (Load More)
  const loadPage = async (pageNum, isFirstLoad = false) => {
    try {
      const { data, pagination } = await getMyApplicationsPaginated(pageNum, LIMIT);

      if (isFirstLoad) {
        setApplications(data);         // replace — fresh start
      } else {
        setApplications(prev => [...prev, ...data]);  // append — Load More
      }

      setTotal(pagination.total);
      setHasMore(pagination.hasMore);
      setPage(pageNum);

    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ── Load More button handler ──────────────────────────────
  const handleLoadMore = () => {
    setLoadingMore(true);
    loadPage(page + 1, false);  // next page, append mode
  };

  // ── Withdraw handler ─────────────────────────────────────
  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      setWithdrawingId(appId);
      await withdrawApplication(appId);
      setApplications(prev => prev.filter(a => a._id !== appId));
      setTotal(prev => prev - 1);
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to withdraw');
    } finally {
      setWithdrawingId(null);
    }
  };

  // ── Loading state — first load only ──────────────────────
  const showSkeleton = loading;

  return (
    <DashboardLayout>

      <PageHeader
        title="My Applications"
        subtitle={
          loading
            ? 'Loading...'
            : `${total} application${total !== 1 ? 's' : ''} total`
        }
        backRoute={ROUTES.CANDIDATE_DASHBOARD}
      />

      {/* ── Loading skeleton — first load ── */}
      {showSkeleton && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="flex gap-3">
                <div className="h-3 bg-gray-100 rounded w-20" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!showSkeleton && applications.length === 0 && (
        <EmptyState
          icon={<Briefcase size={32} />}
          title="No applications yet"
          subtitle="Browse jobs and hit Apply Now to get started"
          actionLabel="Browse Jobs"
          onAction={() => navigate(ROUTES.PUBLIC_JOBS)}
          variant="candidate"
        />
      )}

      {/* ── Applications list ── */}
      {!showSkeleton && applications.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-sora font-bold text-gray-900 text-lg">
                    {app.job?.title || 'Job no longer available'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {app.job?.postedBy?.companyName || '—'}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                    {app.job?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {app.job.location}
                      </span>
                    )}
                    {app.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Badge */}
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${APPLICATION_STATUS[app.status]?.color || 'bg-gray-100 text-gray-600'}
                  `}>
                    {APPLICATION_STATUS[app.status]?.label || app.status}
                  </span>

                  {/* Status Timeline */}
                  {app.statusHistory && app.statusHistory.length > 1 && (
                    <div className="w-full mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-2">Timeline</p>
                      <div className="flex flex-wrap gap-2">
                        {app.statusHistory.map((h, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-gray-500">
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${APPLICATION_STATUS[h.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                              {APPLICATION_STATUS[h.status]?.label || h.status}
                            </span>
                            <span className="text-gray-300">
                              {new Date(h.changedAt).toLocaleDateString()}
                            </span>
                            {i < app.statusHistory.length - 1 && (
                              <span className="text-gray-300">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Withdraw button — only for applied/reviewing */}
                  {['applied', 'reviewing'].includes(app.status) && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      disabled={withdrawingId === app._id}
                      className="px-3 py-1 rounded-full text-xs font-bold border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {withdrawingId === app._id ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}

                  {/* Job Type Badge */}
                  {app.job?.jobType && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      {app.job.jobType}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Load More button ── */}
          {hasMore && (
            <div className="flex flex-col items-center gap-2 mt-6">
              {/* Progress count */}
              <p className="text-sm text-gray-400">
                Showing {applications.length} of {total} applications
              </p>

              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-orange-200 text-orange-600 font-semibold text-sm hover:bg-orange-50 hover:border-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    {/* Spinner */}
                    <span className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Load More Applications
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── End of list message ── */}
          {!hasMore && applications.length > 0 && total > LIMIT && (
            <p className="text-center text-sm text-gray-300 mt-6">
              All {total} applications loaded
            </p>
          )}
        </>
      )}

    </DashboardLayout>
  );
}