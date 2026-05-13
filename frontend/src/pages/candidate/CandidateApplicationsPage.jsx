// CandidateApplicationsPage.jsx — complete correct file

import { useState, useEffect }            from 'react';  // ← ADDED
import { useNavigate }                    from 'react-router-dom';
import { Briefcase, MapPin, Calendar }    from 'lucide-react';
import toast                              from 'react-hot-toast';
import DashboardLayout                    from '../../components/layout/DashboardLayout'; // ← ADDED
import PageHeader                         from '../../components/ui/PageHeader';
import EmptyState                         from '../../components/ui/EmptyState';
import { APPLICATION_STATUS }             from '../../constants/applicationStatus';
import { getMyApplications }              from '../../services/applicationService';
import { ROUTES }                         from '../../constants/routes';

export default function CandidateApplicationsPage() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>

      <PageHeader
        title="My Applications"
        subtitle="Track all jobs you have applied to"
        backRoute={ROUTES.CANDIDATE_DASHBOARD}
      />

      {/* Loading skeleton */}
      {loading && (
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

      {/* Empty */}
      {!loading && applications.length === 0 && (
        <EmptyState
          icon={<Briefcase size={32} />}
          title="No applications yet"
          subtitle="Browse jobs and hit Apply Now to get started"
          actionLabel="Browse Jobs"
          onAction={() => navigate(ROUTES.PUBLIC_JOBS)}
          variant="candidate"
        />
      )}

      {/* Applications list */}
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
                  ${APPLICATION_STATUS[app.status]?.color || 'bg-gray-100 text-gray-600'}
                `}>
                  {APPLICATION_STATUS[app.status]?.label || app.status}
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