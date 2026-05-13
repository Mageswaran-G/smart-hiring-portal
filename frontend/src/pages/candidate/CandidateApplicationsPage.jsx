import toast                          from 'react-hot-toast';
import PageHeader                     from '../../components/ui/PageHeader';
import EmptyState                     from '../../components/ui/EmptyState';
import { APPLICATION_STATUS }         from '../../constants/applicationStatus';
import { getMyApplications }          from '../../services/applicationService';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

export default function CandidateApplicationsPage() {

  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyApplications(); // returns array directly
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

      {/* Header */}
      <PageHeader
        title="My Applications"
        subtitle="Track all jobs you have applied to"
        backRoute={ROUTES.CANDIDATE_DASHBOARD}
      />

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
        <EmptyState
        icon={<Briefcase size={32} />}
        title="No applications yet"
        subtitle="Browse jobs and hit Apply Now to get started"
        actionLabel="Browse Jobs"
        onAction={() => navigate(ROUTES.PUBLIC_JOBS)}
        variant="candidate"
      />
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