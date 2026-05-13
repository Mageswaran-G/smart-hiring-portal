import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import { ROUTES } from '../../constants/routes';

export default function CandidateApplicationsPage() {

  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.MY_APPLICATIONS);
        setApplications(res.data.data);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.CANDIDATE_DASHBOARD)}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="font-sora text-2xl font-bold text-gray-900">
            My Applications
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track all jobs you have applied to
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-gray-400 text-sm p-4">Loading applications...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 text-sm p-4">{error}</div>
      )}

      {/* Empty */}
      {!loading && !error && applications.length === 0 && (
        <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
          <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No applications yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Browse jobs and hit Apply Now to get started
          </p>
          <button
            onClick={() => navigate(ROUTES.PUBLIC_JOBS)}
            className="mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Browse Jobs
          </button>
        </div>
      )}

      {/* Applications List */}
      {!loading && applications.length > 0 && (
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
                  ${app.status === 'accepted'  ? 'bg-green-100 text-green-700'  : ''}
                  ${app.status === 'rejected'  ? 'bg-red-100 text-red-700'    : ''}
                  ${app.status === 'pending' || !app.status ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${app.status === 'reviewed'  ? 'bg-blue-100 text-blue-700'   : ''}
                `}>
                  {app.status
                    ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                    : 'Pending'}
                </span>

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
      )}

    </DashboardLayout>
  );
}