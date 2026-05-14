// CompanyJobsPage.jsx
// Company sees all their own jobs
// Can create, edit, delete, toggle active

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/ui/Button';
import { getMyJobs, updateJobStatus, deleteJob } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';
import EmptyState from '../../components/ui/EmptyState';



export default function CompanyJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all company's jobs on page load
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getMyJobs();
      setJobs(data || []);   
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle job active/inactive
  const handleToggleStatus = async (id, isActive) => {
  try {
    await updateJobStatus(id, { isActive });
    setJobs(prev =>
      prev.map(job => job._id === id ? { ...job, isActive } : job)
    );
    // Simple feedback — shows green or red message
    toast.success(isActive ? 'Job is now Active — visible to candidates' : 'Job is now Inactive — hidden from candidates');
  } catch (err) {
    toast.error('Failed to update status. Try again.');
  }
  };

  // Delete job with confirmation
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    try {
      await deleteJob(id);
      // Remove from local state
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (err) {
      toast.error('Failed to delete job. Try again.');
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-sora text-2xl font-bold text-gray-900">
            My Job Postings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage all your job and internship listings
          </p>
        </div>
        <Button
          onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)}
        >
          <Plus size={16} /> Post New Job
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
              <div className="h-3 bg-gray-100 rounded mb-2 w-1/2" />
              <div className="h-3 bg-gray-100 rounded mb-4 w-1/3" />
              <div className="h-8 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {jobs.length === 0 && !loading && (
        <EmptyState
          icon={<Briefcase size={32} />}
          title="No jobs posted yet"
          subtitle="Create your first job listing to start receiving applications"
          actionLabel="Post New Job"
          onAction={() => navigate(ROUTES.COMPANY_JOB_CREATE)}
          variant="company"
        />
      )}

      {/* Jobs grid */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

    </DashboardLayout>
  );
}