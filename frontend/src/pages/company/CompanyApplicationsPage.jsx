import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import { ROUTES } from '../../constants/routes';

// Status config — label, colors
const STATUS_CONFIG = {
  applied:     { label: 'Applied',     color: 'bg-yellow-100 text-yellow-700' },
  reviewing:   { label: 'Reviewing',   color: 'bg-blue-100 text-blue-700'    },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700'},
  rejected:    { label: 'Rejected',    color: 'bg-red-100 text-red-700'      },
  hired:       { label: 'Hired',       color: 'bg-green-100 text-green-700'  },
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

export default function CompanyApplicationsPage() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [filterJob,    setFilterJob]    = useState('all');
  const [updating,     setUpdating]     = useState(null); // applicationId being updated

  // Fetch all applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.COMPANY_APPLICATIONS);
        setApplications(res.data.data);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Build unique job list for filter dropdown
  const jobOptions = useMemo(() => {
    const seen = new Map();
    applications.forEach((app) => {
      if (app.job && !seen.has(app.job._id)) {
        seen.set(app.job._id, app.job.title);
      }
    });
    return Array.from(seen.entries()); // [[id, title], ...]
  }, [applications]);

  // Filtered list based on selected job
  const filtered = useMemo(() => {
    if (filterJob === 'all') return applications;
    return applications.filter((app) => app.job?._id === filterJob);
  }, [applications, filterJob]);

  // Update status handler
  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await API.patch(
        API_ENDPOINTS.UPDATE_APPLICATION_STATUS(applicationId),
        { status: newStatus }
      );
      // Update locally — no need to re-fetch
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
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

        {/* Filter by Job */}
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
        <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No applicants yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Applications will appear here once candidates apply
          </p>
        </div>
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

                {/* Candidate info */}
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
                    <p className="font-sora font-bold text-gray-900">
                      {app.candidate?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <Mail size={13} />
                      {app.candidate?.email || '—'}
                    </p>
                    {app.candidate?.headline && (
                      <p className="text-sm text-gray-500 mt-1">
                        {app.candidate.headline}
                      </p>
                    )}

                    {/* Job + location */}
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

                

                {/* Status control */}
                <div className="flex flex-col items-end gap-2 shrink-0">

                  {/* Current status badge */}
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${STATUS_CONFIG[app.status]?.color || 'bg-gray-100 text-gray-600'}
                  `}>
                    {STATUS_CONFIG[app.status]?.label || app.status}
                  </span>

                  {/* Status dropdown */}
                  <select
                    value={app.status}
                    disabled={updating === app._id}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s].label}
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