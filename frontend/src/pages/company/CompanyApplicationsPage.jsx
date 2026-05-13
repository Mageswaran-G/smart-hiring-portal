// CompanyApplicationsPage.jsx
// Company sees all applicants for their jobs
// Can filter by job, update application status, view resume

import { getCompanyApplications, updateApplicationStatus } from '../../services/applicationService';
import { APPLICATION_STATUS, APPLICATION_STATUS_OPTIONS }  from '../../constants/applicationStatus';
import EmptyState from '../../components/ui/EmptyState';
import toast      from 'react-hot-toast';
import { ArrowLeft, Users, Mail, MapPin, FileText } from 'lucide-react';




export default function CompanyApplicationsPage() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [filterJob,    setFilterJob]    = useState('all');
  const [updating,     setUpdating]     = useState(null);

  // Fetch all applications on mount
  const fetchApplications = async () => {
    try {
      const data = await getCompanyApplications();    // ← clean
      setApplications(data.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Build unique job list for filter dropdown
  const jobOptions = useMemo(() => {
    const seen = new Map();
    applications.forEach((app) => {
      if (app.job && !seen.has(app.job._id)) {
        seen.set(app.job._id, app.job.title);
      }
    });
    return Array.from(seen.entries());
  }, [applications]);

  // Filtered list based on selected job
  const filtered = useMemo(() => {
    if (filterJob === 'all') return applications;
    return applications.filter((app) => app.job?._id === filterJob);
  }, [applications, filterJob]);

  // Update status
  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);   // ← clean
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Status updated to ${APPLICATION_STATUS[newStatus]?.label}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.COMPANY_DASHBOARD)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="font-sora text-2xl font-bold text-gray-900">
              Applicants
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {filtered.length} application{filtered.length !== 1 ? 's' : ''}
              {filterJob !== 'all' ? ' for this job' : ' total'}
            </p>
          </div>
        </div>

        {/* Filter by job */}
        {jobOptions.length > 1 && (
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="all">All Jobs</option>
            {jobOptions.map(([id, title]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-400 text-sm p-4">Loading applicants...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm p-4">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
          <EmptyState
          icon={<Users size={32} />}
          title="No applicants yet"
          subtitle="Applications will appear here once candidates apply"
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
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                {/* Left — candidate info */}
                <div className="flex items-start gap-4">

                  {/* Avatar */}
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
                    {/* Name */}
                    <p className="font-sora font-bold text-gray-900">
                      {app.candidate?.name || 'Unknown'}
                    </p>

                    {/* Email */}
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail size={13} />
                      {app.candidate?.email || '—'}
                    </p>

                    {/* Headline */}
                    {app.candidate?.headline && (
                      <p className="text-sm text-gray-500 mt-1">
                        {app.candidate.headline}
                      </p>
                    )}

                    {/* View Resume — shows only if candidate had a resume when they applied */}
                    {app.resume ? (
                      <a
                        href={`${import.meta.env.VITE_API_URL}${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                      >
                        <FileText size={13} />
                        View Resume
                      </a>
                    ) : (
                      <p className="text-xs text-gray-400 mt-2">
                        No resume uploaded
                      </p>
                    )}

                    {/* Job + location + date */}
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-400">
                      <span className="font-medium text-gray-600">
                        {app.job?.title || '—'}
                      </span>
                      {app.job?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {app.job.location}
                        </span>
                      )}
                      <span className="text-gray-300">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Cover letter */}
                    {app.coverLetter && (
                      <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 max-w-lg">
                        "{app.coverLetter}"
                      </p>
                    )}
                  </div>

                </div>

                {/* Right — status control */}
                <div className="flex flex-col items-end gap-2 shrink-0">

                  {/* Current status badge */}
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${APPLICATION_STATUS[app.status]?.color || 'bg-gray-100 text-gray-600'}
                  `}>
                    {APPLICATION_STATUS[app.status]?.label || app.status}
                  </span>

                  {/* Status dropdown */}
                  <select
                    value={app.status}
                    disabled={updating === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
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
      )}

    </DashboardLayout>
  );
}