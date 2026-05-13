// JobDetailsPage.jsx
// Redesigned — professional job portal layout

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Users, CalendarDays,
  Bookmark, ArrowLeft, Clock, Building2,
  CheckCircle2, ChevronRight
} from 'lucide-react';

import { getJobById, applyToJob } from '../../services/jobService';
import { useAuth }         from '../../context/AuthContext';
import { API }             from '../../services/authService';
import { API_ENDPOINTS }   from '../../constants/api';
import { ROUTES }          from '../../constants/routes';
import ApplyModal          from '../../components/jobs/ApplyModal';

// ── Days remaining helper ────────────────────────────
function getDaysLeft(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0)  return { text: 'Expired',      color: 'text-red-500'    };
  if (days === 0) return { text: 'Last day!',    color: 'text-orange-500' };
  if (days <= 7)  return { text: `${days}d left`, color: 'text-orange-500' };
  return           { text: `${days}d left`,       color: 'text-green-600'  };
}

export default function JobDetailsPage() {

  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job,            setJob]            = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [applying,       setApplying]       = useState(false);
  const [isSaved,        setIsSaved]        = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied,        setApplied]        = useState(false);

  // 1. Fetch job
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch {
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // 2. Check saved
  useEffect(() => {
    if (!user || user.role !== 'candidate') return;
    const check = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.SAVED_JOB_IDS);
        setIsSaved(res.data.data.includes(id));
      } catch (_) {}
    };
    check();
  }, [id, user]);

  // 3. Check applied
  useEffect(() => {
    if (!user || user.role !== 'candidate') return;
    const check = async () => {
      try {
        const res  = await API.get(API_ENDPOINTS.MY_APPLICATIONS);
        const apps = res.data.data || [];
        setApplied(apps.some(a => a.job?._id === id));
      } catch (_) {}
    };
    check();
  }, [id, user]);

  const handleApply = async (coverLetter) => {
    try {
      setApplying(true);
      await applyToJob(id, coverLetter);
      setApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  const handleToggleSave = async () => {
    if (!user) { alert('Please log in to save jobs.'); return; }
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
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ──────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading job details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Job not found</p>
    </div>
  );

  const daysLeft    = getDaysLeft(job.deadline);
  const companyName = job.postedBy?.companyName || 'Company';
  const initials    = companyName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top nav bar ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => navigate(ROUTES.PUBLIC_JOBS)}
          className="flex items-center gap-1.5 hover:text-gray-800 transition"
        >
          <ArrowLeft size={15} />
          Jobs
        </button>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="text-gray-800 font-medium truncate max-w-xs">
          {job.title}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── HERO CARD ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">

          {/* Color top bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">

              {/* Company avatar */}
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-2xl font-sora">
                  {initials}
                </span>
              </div>

              <div className="flex-1">
                {/* Title */}
                <h1 className="font-sora text-3xl font-bold text-gray-900 leading-tight">
                  {job.title}
                </h1>

                {/* Company + location */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                    <Building2 size={15} className="text-blue-500" />
                    {companyName}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <MapPin size={15} className="text-gray-400" />
                    {job.location}
                  </span>
                  {daysLeft && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className={`flex items-center gap-1.5 text-sm font-medium ${daysLeft.color}`}>
                        <Clock size={14} />
                        {daysLeft.text}
                      </span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold">
                    {job.jobType}
                  </span>
                  <span className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full text-xs font-semibold">
                    {job.workMode}
                  </span>
                  <span className="bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full text-xs font-semibold">
                    {job.experienceLevel}
                  </span>
                  {job.status === 'published' && (
                    <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Actively Hiring
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT — Main content ── */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Job Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="font-sora text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-600 rounded-full" />
                Job Description
              </h2>
              <p className="text-gray-600 leading-8 whitespace-pre-line text-sm">
                {job.description}
              </p>
            </div>

            {/* Skills Required */}
            {job.skillsRequired?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-sora text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-purple-500 rounded-full" />
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-sora text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-orange-500 rounded-full" />
                  Requirements
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-sora text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-indigo-500 rounded-full" />
                  Responsibilities
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-sora text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-500 rounded-full" />
                  Benefits
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((b, i) => (
                    <span
                      key={i}
                      className="bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT — Sticky sidebar ── */}
          <div className="lg:w-80 flex flex-col gap-4">

            {/* Quick info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">

              <h3 className="font-sora font-bold text-gray-900 text-base mb-5">
                Job Overview
              </h3>

              {/* Info rows */}
              <div className="flex flex-col gap-4">

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Location</p>
                    <p className="text-sm font-semibold text-gray-800">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Openings</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {job.openings} position{job.openings !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Briefcase size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Experience</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {job.experienceLevel}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <CalendarDays size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Deadline</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : 'No deadline'}
                    </p>
                    {daysLeft && (
                      <p className={`text-xs mt-0.5 font-medium ${daysLeft.color}`}>
                        {daysLeft.text}
                      </p>
                    )}
                  </div>
                </div>

                {/* Salary — show only if disclosed */}
                {job.salary?.isDisclosed && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <span className="text-emerald-600 font-bold text-sm">₹</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Salary</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {job.salary.min?.toLocaleString()} – {job.salary.max?.toLocaleString()}
                        <span className="text-gray-400 font-normal text-xs ml-1">
                          {job.salary.currency}/yr
                        </span>
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-5" />

              {/* Action buttons — candidates only */}
              {user?.role === 'candidate' ? (
                <div className="flex flex-col gap-3">

                  {/* Apply button */}
                  <button
                    onClick={() => !applied && setShowApplyModal(true)}
                    disabled={applied || applying}
                    className={`
                      w-full py-3 rounded-xl font-semibold text-sm
                      flex items-center justify-center gap-2
                      transition-all disabled:cursor-not-allowed
                      ${applied
                        ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
                      }
                    `}
                  >
                    {applied ? (
                      <>
                        <CheckCircle2 size={16} />
                        Application Submitted
                      </>
                    ) : (
                      applying ? 'Submitting...' : 'Apply Now'
                    )}
                  </button>

                  {/* Save button */}
                  <button
                    onClick={handleToggleSave}
                    disabled={saving}
                    className={`
                      w-full py-3 rounded-xl font-semibold text-sm
                      flex items-center justify-center gap-2
                      border-2 transition-all
                      ${isSaved
                        ? 'bg-orange-50 border-orange-300 text-orange-600 hover:bg-orange-100'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500'
                      }
                    `}
                  >
                    <Bookmark
                      size={16}
                      className={isSaved ? 'fill-orange-500' : ''}
                    />
                    {saving ? '...' : isSaved ? 'Saved' : 'Save Job'}
                  </button>

                </div>
              ) : !user ? (
                // Not logged in
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
                >
                  Login to Apply
                </button>
              ) : null}

            </div>

          </div>

        </div>

      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          jobTitle={job.title}
          loading={applying}
          onConfirm={handleApply}
          onClose={() => setShowApplyModal(false)}
        />
      )}

    </div>
  );
}