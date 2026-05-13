// JobCard.jsx
// Shows one job in company dashboard
// Has edit, toggle active, delete buttons

import { useNavigate } from 'react-router-dom';

import JobStatusBadge from './JobStatusBadge';
import Button from '../ui/Button';
import { ROUTES } from '../../constants/routes';
import { Pencil, Trash2, MapPin, Briefcase, Users, FileText } from 'lucide-react';

export default function JobCard({ job, onToggleStatus, onDelete }) {
  const navigate = useNavigate();

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

      {/* Top row — title + badges */}
      <div className="mb-3">
        <h3 className="font-sora font-bold text-gray-900 text-base leading-snug mb-2">
            {job.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
            <JobStatusBadge type="status"   value={job.status} />
            <JobStatusBadge type="workMode" value={job.workMode} />
            <JobStatusBadge type="jobType"  value={job.jobType} />
        </div>
        </div>

      {/* Info row */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} />
          {job.openings} opening{job.openings !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1 text-blue-500">
          <FileText size={14} />
          {job.applicationsCount || 0} applied
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={14} />
          {job.experienceLevel}
        </span>
      </div>

      {/* Deadline */}
      <p className="text-xs text-gray-400 mb-4">
        Deadline: {formatDate(job.deadline)}
      </p>

      {/* Active toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => onToggleStatus(job._id, !job.isActive)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            job.isActive ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            job.isActive ? 'translate-x-4' : 'translate-x-1'
          }`} />
        </button>
        <span className="text-xs text-gray-500">
          {job.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(ROUTES.COMPANY_JOB_EDIT.replace(':id', job._id))}
        >
          <Pencil size={13} /> Edit
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(job._id)}
        >
          <Trash2 size={13} /> Delete
        </Button>
      </div>

    </div>
  );
}