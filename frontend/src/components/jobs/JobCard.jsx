// PublicJobCard.jsx
// Shows one job on the public listing page
// Bookmark button for candidates only

import { MapPin, Briefcase, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function PublicJobCard({ job, isSaved = false, onToggleSave }) {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(ROUTES.JOB_DETAILS.replace(':id', job._id))}
      className="
        rounded-2xl bg-white border border-gray-100
        p-5 shadow-sm hover:shadow-md
        transition relative cursor-pointer
      "
    >

      {/* Bookmark button — top right, only if onToggleSave provided */}
      {onToggleSave && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // stop card click from firing
            onToggleSave(job._id);
          }}
          title={isSaved ? 'Remove from saved' : 'Save job'}
          className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 transition"
        >
          <Bookmark
            size={20}
            className={isSaved ? 'fill-orange-500 text-orange-500' : ''}
          />
        </button>
      )}

      {/* Title */}
      <h2 className="font-sora text-xl font-bold text-gray-900 pr-8">
        {job.title}
      </h2>

      {/* Fix: job.postedBy NOT job.company */}
      <p className="mt-1 text-sm text-gray-500">
        {job.postedBy?.companyName || 'Company'}
      </p>

      {/* Location */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <MapPin size={15} />
        {job.location}
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {job.jobType}
        </span>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          {job.workMode}
        </span>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {job.experienceLevel}
        </span>
      </div>

      {/* Openings */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Briefcase size={15} />
        {job.openings} opening{job.openings !== 1 ? 's' : ''}
      </div>

      {/* View Details link */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
          View Details →
        </span>
      </div>

    </div>
  );
}