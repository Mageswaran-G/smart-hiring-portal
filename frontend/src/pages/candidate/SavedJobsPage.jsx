// SavedJobsPage.jsx — complete correct file

import { useState, useEffect }              from 'react';  // ← ADDED
import { useNavigate }                      from 'react-router-dom';
import { Bookmark, MapPin, Briefcase }      from 'lucide-react';
import toast                                from 'react-hot-toast';
import DashboardLayout                      from '../../components/layout/DashboardLayout'; // ← ADDED
import PageHeader                           from '../../components/ui/PageHeader';
import EmptyState                           from '../../components/ui/EmptyState';
import { getSavedJobs, unsaveJob }          from '../../services/savedJobService';
import { ROUTES }                           from '../../constants/routes';

export default function SavedJobsPage() {

  const navigate = useNavigate();

  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getSavedJobs();
        setSaved(data);
      } catch (err) {
        toast.error('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ← ADDED — was missing entirely
  const handleUnsave = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setSaved(prev => prev.filter(s => s.job?._id !== jobId));
      toast.success('Job removed from saved');
    } catch (err) {
      toast.error('Failed to remove saved job');
    }
  };

  return (
    <DashboardLayout>

      <PageHeader
        title="Saved Jobs"
        subtitle="Jobs you bookmarked to apply later"
        backRoute={ROUTES.CANDIDATE_DASHBOARD}
      />

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-100 rounded-full w-20" />
                <div className="h-6 bg-gray-100 rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && saved.length === 0 && (
        <EmptyState
          icon={<Bookmark size={32} />}
          title="No saved jobs yet"
          subtitle="Click the bookmark icon on any job to save it here"
          actionLabel="Browse Jobs"
          onAction={() => navigate(ROUTES.PUBLIC_JOBS)}
          variant="candidate"
        />
      )}

      {/* Saved jobs list */}
      {!loading && saved.length > 0 && (
        <div className="flex flex-col gap-4">
          {saved.map((entry) => {
            const job = entry.job;
            if (!job) return null;

            return (
              <div
                key={entry._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-sora font-bold text-gray-900 text-lg">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {job.postedBy?.companyName || '—'}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {job.jobType}
                    </span>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {job.workMode}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <MapPin size={13} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <Briefcase size={13} /> {job.openings} opening{job.openings > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleUnsave(job._id)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition border border-gray-200 px-3 py-2 rounded-xl"
                  >
                    <Bookmark size={15} className="fill-current" />
                    Remove
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.JOB_DETAILS.replace(':slug', job.slug || job._id))}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition"
                  >
                    Apply Now
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </DashboardLayout>
  );
}