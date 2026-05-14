// CompanyApplicationsPage

import { useEffect, useState, useMemo }                    from 'react';
import { useNavigate }                                     from 'react-router-dom';
import { Users, Mail, MapPin, FileText, Search }           from 'lucide-react';
import toast                                               from 'react-hot-toast';
import DashboardLayout                                     from '../../components/layout/DashboardLayout';
import PageHeader                                          from '../../components/ui/PageHeader';
import EmptyState                                          from '../../components/ui/EmptyState';
import { ROUTES }                                          from '../../constants/routes';
import { APPLICATION_STATUS, APPLICATION_STATUS_OPTIONS }  from '../../constants/applicationStatus';
import { getCompanyApplications, updateApplicationStatus } from '../../services/applicationService';
import { useDebounce } from '../../hooks/useDebounce';

export default function CompanyApplicationsPage() {

  const navigate = useNavigate();

  const [applications,  setApplications]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filterJob,     setFilterJob]     = useState('all');
  const [filterStatus,  setFilterStatus]  = useState('all');  
  const [searchName,    setSearchName]    = useState('');     
  const [updating,      setUpdating]      = useState(null);

  const debouncedSearch = useDebounce(searchName, 300);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCompanyApplications();
        setApplications(data);
      } catch {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Unique job options for job filter dropdown
  const jobOptions = useMemo(() => {
    const seen = new Map();
    applications.forEach((app) => {
      if (app.job && !seen.has(app.job._id)) {
        seen.set(app.job._id, app.job.title);
      }
    });
    return Array.from(seen.entries());
  }, [applications]);

  // 3-level filtering: job → status → name search
  const filtered = useMemo(() => {
    let result = applications;
    if (filterJob !== 'all') {
      result = result.filter(app => app.job?._id === filterJob);
    }
    if (filterStatus !== 'all') {
      result = result.filter(app => app.status === filterStatus);
    }
    if (debouncedSearch.trim()) {          // ← use debounced value
      const q = debouncedSearch.toLowerCase();
      result = result.filter(app =>
        app.candidate?.name?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [applications, filterJob, filterStatus, debouncedSearch]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
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

  return (
    <DashboardLayout>

      <PageHeader
        title="Applicants"
        subtitle={`${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
        backRoute={ROUTES.COMPANY_DASHBOARD}
      />

      {/* ── Search + Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">

        {/* Search by name */}
        <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidate name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {/* Filter by job */}
        {jobOptions.length > 1 && (
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
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
          className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        >
          <option value="all">All Statuses</option>
          {APPLICATION_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{APPLICATION_STATUS[s].label}</option>
          ))}
        </select>

        {/* Clear filters */}
        {(filterJob !== 'all' || filterStatus !== 'all' || searchName) && (
          <button
            onClick={() => { setFilterJob('all'); setFilterStatus('all'); setSearchName(''); }}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-2 rounded-xl transition"
          >
            Clear
          </button>
        )}

      </div>

      {/* Loading skeletons */}
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

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={<Users size={32} />}
          title="No applicants found"
          subtitle={
            searchName || filterJob !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Applications will appear here once candidates apply'
          }
          variant="company"
        />
      )}

      {/* Applications list */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-4">
          {filtered.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col gap-4">

                {/* Candidate info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {app.candidate?.profilePhoto ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${app.candidate.profilePhoto}`}
                        alt={app.candidate.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-orange-600 font-bold text-lg">
                        {app.candidate?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-sora font-bold text-gray-900">
                      {app.candidate?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail size={13} />
                      {app.candidate?.email || '—'}
                    </p>
                    {app.candidate?.headline && (
                      <p className="text-sm text-gray-500 mt-1 max-w-md truncate">
                        {app.candidate.headline}
                      </p>
                    )}

                    {app.resume ? (
                      <div className="flex items-center gap-2 mt-2">

                        {/* View — opens in new tab */}
                        <a
                          href={`${import.meta.env.VITE_API_URL}${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                        >
                          <FileText size={13} />
                          View
                        </a>

                        {/* Download — forces browser download */}
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

                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-400">
                      <span className="font-medium text-gray-600">{app.job?.title || '—'}</span>
                      {app.job?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {app.job.location}
                        </span>
                      )}
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>

                    {app.coverLetter && (
                      <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 max-w-lg">
                        "{app.coverLetter}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status control */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 shrink-0 pt-2 border-t border-gray-100 md:border-0 md:pt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${APPLICATION_STATUS[app.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {APPLICATION_STATUS[app.status]?.label || app.status}
                  </span>
                  <select
                    value={app.status}
                    disabled={updating === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                  >
                    {APPLICATION_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{APPLICATION_STATUS[s].label}</option>
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
      )}

    </DashboardLayout>
  );
}