// JobDetailsPage.jsx
// Single job view — save, apply with cover letter modal

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Users,
  CalendarDays,
  Bookmark,
} from 'lucide-react';

import { getJobById, applyToJob } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import ApplyModal from '../../components/jobs/ApplyModal';

export default function JobDetailsPage() {

  const { id } = useParams();
  const { user } = useAuth();

  const [job,           setJob]           = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [applying,      setApplying]      = useState(false);
  const [isSaved,       setIsSaved]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [showApplyModal,setShowApplyModal] = useState(false);
  const [applied,       setApplied]       = useState(false);

  // ── 1. Fetch job details ─────────────────────────────
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        setJob(response.data);
      } catch (err) {
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // ── 2. Check if job is already SAVED ─────────────────
  // Fix: this useEffect was missing — isSaved was never set from API
  useEffect(() => {
    if (!user || user.role !== 'candidate') return;

    const checkSaved = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.SAVED_JOB_IDS);
        // res.data.data is array of job ID strings
        setIsSaved(res.data.data.includes(id));
      } catch (_) {}
    };

    checkSaved();
  }, [id, user]);

  // ── 3. Check if already APPLIED ──────────────────────
  // Fix: separate useEffect — does NOT replace checkSaved
  useEffect(() => {
    if (!user || user.role !== 'candidate') return;

    const checkApplied = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.MY_APPLICATIONS);
        const myApps = res.data.data || [];
        // Check if any application's job ID matches this job
        const alreadyApplied = myApps.some(app => app.job?._id === id);
        setApplied(alreadyApplied);
      } catch (_) {}
    };

    checkApplied();
  }, [id, user]);

  // ── Apply handler ────────────────────────────────────
  const handleApply = async (coverLetter) => {
    try {
      setApplying(true);
      await applyToJob(id, coverLetter);
      setApplied(true);
      setShowApplyModal(false);
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  // ── Save / Unsave handler ────────────────────────────
  const handleToggleSave = async () => {
    if (!user) {
      alert('Please log in to save jobs.');
      return;
    }
    try {
      setSaving(true);
      if (isSaved) {
        await API.delete(API_ENDPOINTS.UNSAVE_JOB(id));
        setIsSaved(false);
      } else {
        await API.post(API_ENDPOINTS.SAVE_JOB(id));
        setIsSaved(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update saved job');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading / Error / Not found states ──────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── Top Card ── */}
        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8">

          {/* Title */}
          <h1 className="font-sora text-4xl font-bold text-gray-900">
            {job.title}
          </h1>

          {/* Fix: job.postedBy NOT job.company */}
          <p className="mt-2 text-lg text-gray-500">
            {job.postedBy?.companyName || 'Company'}
          </p>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              {job.jobType}
            </span>
            <span className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
              {job.workMode}
            </span>
            <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">
              {job.experienceLevel}
            </span>
          </div>

          {/* Info Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-medium text-gray-800">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Openings</p>
                <p className="font-medium text-gray-800">{job.openings}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Experience</p>
                <p className="font-medium text-gray-800">{job.experienceLevel}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Deadline</p>
                <p className="font-medium text-gray-800">
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : 'No deadline'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Description ── */}
        <div className="mt-6 rounded-3xl bg-white border border-gray-100 shadow-sm p-8">
          <h2 className="font-sora text-2xl font-bold text-gray-900 mb-5">
            Job Description
          </h2>
          <p className="leading-8 text-gray-700 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* ── Skills Required (show if exists) ── */}
        {job.skillsRequired?.length > 0 && (
          <div className="mt-6 rounded-3xl bg-white border border-gray-100 shadow-sm p-8">
            <h2 className="font-sora text-2xl font-bold text-gray-900 mb-5">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Save + Apply Buttons ── */}
        <div className="mt-6 flex justify-end gap-3">

          {/* Save button — candidates only */}
          {user?.role === 'candidate' && (
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`
                flex items-center gap-2
                px-6 py-3 rounded-xl
                font-semibold text-sm
                border transition
                disabled:opacity-60
                ${isSaved
                  ? 'bg-orange-50 border-orange-400 text-orange-600 hover:bg-orange-100'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500'
                }
              `}
            >
              <Bookmark
                size={17}
                className={isSaved ? 'fill-orange-500 text-orange-500' : ''}
              />
              {saving ? '...' : isSaved ? 'Saved' : 'Save Job'}
            </button>
          )}

          {/* Apply button — candidates only */}
          {user?.role === 'candidate' && (
            <>
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={applied || applying}
                className="
                  bg-green-600 hover:bg-green-700
                  disabled:opacity-60 disabled:cursor-not-allowed
                  text-white font-semibold
                  px-8 py-3 rounded-xl transition-colors
                "
              >
                {applied ? '✓ Applied' : 'Apply Now'}
              </button>

              {/* Apply Modal */}
              {showApplyModal && (
                <ApplyModal
                  jobTitle={job.title}
                  loading={applying}
                  onConfirm={handleApply}
                  onClose={() => setShowApplyModal(false)}
                />
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}