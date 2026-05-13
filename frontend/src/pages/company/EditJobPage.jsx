// EditJobPage.jsx
// Company edits an existing job
// Fetches job data first, then shows form with existing values

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobForm from '../../components/jobs/JobForm';
import { getJobById, updateJob } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';

export default function EditJobPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // get job ID from URL

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing job data when page loads
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data.data);
      } catch (err) {
        setError('Job not found or you are not authorized.');
      } finally {
        setFetching(false);
      }
    };
    fetchJob();
  }, [id]);

  // Handle form submit — update the job
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await updateJob(id, formData);
      navigate(ROUTES.COMPANY_JOBS); // go back to jobs list
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update job.';
      const errs = err.response?.data?.errors;
      setError(errs ? errs.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(ROUTES.COMPANY_JOBS)}
          className="text-gray-400 hover:text-gray-700 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-sora text-2xl font-bold text-gray-900">
            Edit Job
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Update your job listing details
          </p>
        </div>
      </div>

      {/* Loading while fetching job */}
      {fetching && (
        <div className="bg-white rounded-2xl p-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-full mb-3" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      )}

      {/* Error fetching job */}
      {error && !fetching && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Form — only show when job data is ready */}
      {!fetching && job && (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <JobForm
            mode="edit"
            initialData={job}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      )}

    </DashboardLayout>
  );
}