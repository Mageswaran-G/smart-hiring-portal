// CreateJobPage.jsx
// Company creates a new job using the reusable JobForm

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobForm from '../../components/jobs/JobForm';
import { createJob } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      await createJob(formData);
      // Go back to jobs list after success
      navigate(ROUTES.COMPANY_JOBS);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create job. Try again.';
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
            Post New Job
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Fill in the details to publish your job listing
          </p>
        </div>
      </div>

      {/* API Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <JobForm
          mode="create"
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

    </DashboardLayout>
  );
}