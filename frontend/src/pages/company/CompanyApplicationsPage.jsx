// CompanyApplicationsPage.jsx — Company applicants with AI ranking
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { Users, ChevronDown, LayoutList, Columns } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import { ROUTES } from '../../constants/routes';
import { getCompanyApplicationsPaginated, updateApplicationStatus } from '../../services/applicationService';
import { getRankedCandidates } from '../../services/ai/rankingService';
import { useDebounce } from '../../hooks/useDebounce';
import AIRankingPanel from './components/applications/AIRankingPanel';
import ApplicationCard from './components/applications/ApplicationCard';
import ApplicationFilters from './components/applications/ApplicationFilters';
import ApplicationSkeleton from './components/applications/ApplicationSkeleton';
import ScheduleInterviewModal from './components/applications/ScheduleInterviewModal';
import KanbanBoard from './components/applications/KanbanBoard';

const LIMIT = 10;

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [scheduleApp,  setScheduleApp]  = useState(null);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [total,        setTotal]        = useState(0);
  const [hasMore,      setHasMore]      = useState(false);
  const [page,         setPage]         = useState(1);
  const [updating,     setUpdating]     = useState(null);
  const [searchName,   setSearchName]   = useState('');
  const [filterJob,    setFilterJob]    = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRanking,  setShowRanking]  = useState(false);
  const [rankFilters,  setRankFilters]  = useState({ minScore: '', recommendation: '', sortBy: 'score' });
  const [ranking,      setRanking]      = useState([]);
  const [rankLoading,  setRankLoading]  = useState(false);
  const [viewMode,     setViewMode]     = useState('list');
  const debouncedSearch = useDebounce(searchName, 400);
  const abortRef = useRef(null);

  const loadPage = useCallback(async (pageNum, isFirstLoad = false) => {
    isFirstLoad ? setLoading(true) : setLoadingMore(true);
    try {
      const { data, pagination } = await getCompanyApplicationsPaginated(pageNum, LIMIT);
      isFirstLoad ? setApplications(data) : setApplications(prev => [...prev, ...data]);
      setTotal(pagination.total);
      setHasMore(pagination.hasMore);
      setPage(pageNum);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      isFirstLoad ? setLoading(false) : setLoadingMore(false);
    }
  }, []);

  useEffect(() => { loadPage(1, true); }, [loadPage]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleLoadMore = () => loadPage(page + 1);

  const jobOptions = useMemo(() => {
    const map = new Map();
    applications.forEach(app => {
      if (app.job?._id && app.job?.title) map.set(app.job._id, app.job.title);
    });
    return Array.from(map.entries());
  }, [applications]);

  const filtered = useMemo(() => {
    let result = applications;
    if (filterJob !== 'all') result = result.filter(app => app.job?._id === filterJob);
    if (filterStatus !== 'all') result = result.filter(app => app.status === filterStatus);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(app => app.candidate?.name?.toLowerCase().includes(q));
    }
    return result;
  }, [applications, filterJob, filterStatus, debouncedSearch]);

  const handleStatusChange = async (applicationId, newStatus) => {
    const previous = applications;
    setUpdating(applicationId);
    setApplications(prev =>
      prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
    );
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success('Status updated');
    } catch {
      setApplications(previous);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtersActive = filterJob !== 'all' || filterStatus !== 'all' || debouncedSearch.trim() !== '';

  const fetchRanking = async (jobId) => {
    if (!jobId || jobId === 'all') return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setRankLoading(true);
    try {
      const data = await getRankedCandidates(jobId, rankFilters, abortRef.current.signal);
      setRanking(data.ranked || []);
      setShowRanking(true);
    } catch (err) {
      if (err?.code !== 'ERR_CANCELED') toast.error('Ranking failed');
    } finally {
      setRankLoading(false);
    }
  };

  return (
    <>
    <DashboardLayout>
      <PageHeader
        title="Applicants"
        subtitle={
          loading ? 'Loading...' :
          filtersActive ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} (filtered)` :
          `${total} total applicant${total !== 1 ? 's' : ''}`
        }
        backRoute={ROUTES.COMPANY_DASHBOARD}
      />

      {/* View toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <LayoutList size={15} /> List
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Columns size={15} /> Kanban
          </button>
        </div>
      </div>

      <ApplicationFilters
        searchName={searchName}
        setSearchName={setSearchName}
        filterJob={filterJob}
        setFilterJob={setFilterJob}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        jobOptions={jobOptions}
        filtersActive={filtersActive}
      />

      {/* AI Ranking Panel */}
      {jobOptions.length > 0 && (
        <AIRankingPanel
          jobOptions={jobOptions}
          showRanking={showRanking}
          setShowRanking={setShowRanking}
          rankFilters={rankFilters}
          setRankFilters={setRankFilters}
          ranking={ranking}
          rankLoading={rankLoading}
          fetchRanking={fetchRanking}
          filterJob={filterJob}
        />
      )}

      {loading && <ApplicationSkeleton />}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={<Users size={32} />}
          title="No applicants found"
          subtitle={filtersActive ? 'Try adjusting your search or filters' : 'Applications will appear here once candidates apply'}
          variant="company"
        />
      )}

      {/* Kanban view */}
      {!loading && viewMode === 'kanban' && (
        <KanbanBoard
          applications={filtered}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}

      {/* Applications list */}
      {!loading && viewMode === 'list' && filtered.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {filtered.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                updating={updating}
                onStatusChange={handleStatusChange}
                onScheduleInterview={setScheduleApp}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && !filtersActive && (
            <div className="flex flex-col items-center gap-2 mt-6">
              <p className="text-sm text-gray-400">Showing {applications.length} of {total} applicants</p>
              <button onClick={handleLoadMore} disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-200 text-blue-700 font-semibold text-sm hover:bg-blue-50 hover:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loadingMore ? (
                  <><span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />Loading...</>
                ) : (
                  <><ChevronDown size={16} />Load More Applicants</>
                )}
              </button>
            </div>
          )}

          {hasMore && filtersActive && (
            <p className="text-center text-xs text-gray-400 mt-4 bg-yellow-50 border border-yellow-100 rounded-xl py-3 px-4">
              Showing filtered results from {applications.length} loaded applicants. Clear filters and use Load More to see all {total} applicants.
            </p>
          )}

          {!hasMore && applications.length > 0 && total > LIMIT && (
            <p className="text-center text-sm text-gray-300 mt-6">All {total} applicants loaded</p>
          )}
        </>
      )}
    </DashboardLayout>

    {scheduleApp && (
      <ScheduleInterviewModal
        app={scheduleApp}
        onClose={() => setScheduleApp(null)}
        onSuccess={() => setScheduleApp(null)}
      />
    )}
    </>
  );
}