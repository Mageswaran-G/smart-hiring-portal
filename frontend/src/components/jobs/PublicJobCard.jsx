// PublicJobCard.jsx
// Shows one job on the public listing page
// Bookmark button for candidates only

import { MapPin, Briefcase, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import ScoreBadge from '../ai/ScoreBadge';
export default function PublicJobCard({ job, isSaved = false, onToggleSave, matchScore }) {

  const navigate = useNavigate();
  // Strips HTML tags for plain text preview
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition relative">

      {/* Bookmark button — top right, candidates only */}
      {onToggleSave && (
        <button
          onClick={(e) => {
            e.stopPropagation();
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

      {/* job.postedBy not job.company */}
      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
        <p className="text-sm text-gray-500">
          {job.postedBy?.companyName || 'Company'}
        </p>
        {job.postedBy?.isVerified && (
          <span className="inline-flex items-center gap-0.5 text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full font-semibold">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Location */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <MapPin size={15} />
        {job.location}
      </div>
      
      {/* AI Match Score badge — candidates only */}
      {matchScore !== undefined && (
        <div className="mt-3">
          <ScoreBadge score={matchScore} />
        </div>
      )}

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
        {job.openings} opening{job.openings > 1 ? 's' : ''}
      </div>

      {/* Description preview */}
      <p className="mt-4 line-clamp-3 text-sm text-gray-600">
        {stripHtml(job.description)}
      </p>

      {/* View Details button */}
      <button
        onClick={() => navigate(ROUTES.JOB_DETAILS.replace(':slug', job.slug || job._id))}
        className="mt-5 w-full rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition"
      >
        View Details
      </button>

    </div>
  );
}