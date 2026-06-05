// AuditLogsPage
// Admin can view all system activity logs with pagination

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import { getAuditLogs } from '../../services/adminService';
import { ROUTES } from '../../constants/routes';

const LIMIT = 20;

const ACTION_COLORS = {
  suspend_user:     'bg-red-100 text-red-700',
  unsuspend_user:   'bg-green-100 text-green-700',
  delete_user:      'bg-red-200 text-red-800',
  restore_user:     'bg-blue-100 text-blue-700',
  suspend_company:  'bg-orange-100 text-orange-700',
  unsuspend_company:'bg-green-100 text-green-700',
  verified_company: 'bg-purple-100 text-purple-700',
  unverified_company:'bg-gray-100 text-gray-600',
  close_job:        'bg-yellow-100 text-yellow-700',
  delete_job:       'bg-red-100 text-red-700',
};

export default function AuditLogsPage() {
  const fetchedRef = useRef(false);

  const [logs,        setLogs]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(false);
  const [total,       setTotal]       = useState(0);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    loadPage(1, true);
  }, []);

  const loadPage = async (pageNum, isFirstLoad = false) => {
    try {
      const res = await getAuditLogs({ page: pageNum, limit: LIMIT });
      if (isFirstLoad) {
        setLogs(res.data);
      } else {
        setLogs(prev => [...prev, ...res.data]);
      }
      setTotal(res.pagination.total);
      setHasMore(res.pagination.hasMore);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    loadPage(page + 1, false);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Audit Logs"
        subtitle={loading ? 'Loading...' : `${total} total actions recorded`}
        backRoute={ROUTES.ADMIN_DASHBOARD}
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse border border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && logs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Shield size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-semibold">No audit logs yet</p>
          <p className="text-sm mt-1">Admin actions will appear here</p>
        </div>
      )}

      {/* Logs list */}
      {!loading && logs.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div
                key={log._id}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  {/* Action badge */}
                  <span className={`
                    inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1
                    ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'}
                  `}>
                    {log.action.replace(/_/g, ' ')}
                  </span>

                  {/* Description */}
                  <p className="text-sm text-gray-700 font-medium">
                    {log.description}
                  </p>

                  {/* Performed by */}
                  <p className="text-xs text-gray-400 mt-0.5">
                    By: {log.performedBy?.name || 'Admin'} ({log.performedBy?.email || '—'})
                  </p>
                </div>

                {/* Timestamp */}
                <div className="shrink-0 text-xs text-gray-400 text-right">
                  <p>{new Date(log.createdAt).toLocaleDateString()}</p>
                  <p>{new Date(log.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <p className="text-sm text-gray-400">
                Showing {logs.length} of {total} logs
              </p>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-indigo-200 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Load More Logs
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && total > LIMIT && (
            <p className="text-center text-sm text-gray-300 mt-6">
              All {total} logs loaded
            </p>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
