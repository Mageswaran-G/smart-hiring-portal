import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, MapPin, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import { ROUTES } from '../../constants/routes';

export default function SavedJobsPage() {

  const navigate = useNavigate();
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.SAVED_JOBS);
        setSaved(res.data.data);
      } catch (err) {
        setError('Failed to load saved jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await API.delete(API_ENDPOINTS.UNSAVE_JOB(jobId));
      setSaved((prev) => prev.filter((s) => s.job?._id !== jobId));
    } catch (err) {
      alert('Failed to remove saved job');
    }
  };

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
            Saved Jobs
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Jobs you bookmarked to apply later
          </p>
        </div>
      </div>

      {loading && <p className="text-gray-400 text-sm p-4">Loading...</p>}
      {error   && <p className="text-red-500 text-sm p-4">{error}</p>}

      {/* Empty */}
      {!loading && !error && saved.length === 0 && (
        <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
          <Bookmark size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No saved jobs yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click the bookmark icon on any job to save it here
          </p>
          <button
            onClick={() => navigate(ROUTES.PUBLIC_JOBS)}
            className="mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Browse Jobs
          </button>
        </div>
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
                    onClick={() =>
                      navigate(ROUTES.JOB_DETAILS.replace(':id', job._id))
                    }
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