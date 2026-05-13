import { useEffect, useState, useCallback } from 'react';
import { getAllJobs } from '../../services/jobService';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';
import PublicJobCard from '../../components/jobs/PublicJobCard';

export default function PublicJobsPage() {

  const { user } = useAuth();
  const isCandidate = user?.role === 'candidate';

  const [jobs,      setJobs]      = useState([]);
  const [savedIds,  setSavedIds]  = useState(new Set());
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Always fetch jobs
        const data = await getAllJobs();
        setJobs(data.data || []);

        // Fetch saved IDs only if candidate
        if (isCandidate) {
          const savedRes = await API.get(API_ENDPOINTS.SAVED_JOB_IDS);
          setSavedIds(new Set(savedRes.data.data));
        }

      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isCandidate]);

  // Toggle save/unsave
  const handleToggleSave = useCallback(async (jobId) => {
    const alreadySaved = savedIds.has(jobId);
    try {
      if (alreadySaved) {
        await API.delete(API_ENDPOINTS.UNSAVE_JOB(jobId));
        setSavedIds((prev) => { const s = new Set(prev); s.delete(jobId); return s; });
      } else {
        await API.post(API_ENDPOINTS.SAVE_JOB(jobId));
        setSavedIds((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update saved jobs');
    }
  }, [savedIds]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold text-gray-900">
          Explore Jobs
        </h1>
        <p className="mt-2 text-gray-500">
          Discover jobs and internships
        </p>
      </div>

      {loading && <p className="text-gray-500">Loading jobs...</p>}
      {error   && <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>}

      {!loading && jobs.length === 0 && (
        <div className="rounded-xl bg-white p-6 shadow-sm">No jobs found</div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <PublicJobCard
              key={job._id}
              job={job}
              isSaved={savedIds.has(job._id)}
              onToggleSave={isCandidate ? handleToggleSave : undefined}
            />
          ))}
        </div>
      )}

    </div>
  );
}