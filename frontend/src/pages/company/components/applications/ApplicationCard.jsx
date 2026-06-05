// ApplicationCard.jsx — Single application card
import React from 'react';
import { Mail, MapPin, FileText, Calendar } from 'lucide-react';
import SafeAvatar from '../../../../components/ui/SafeAvatar';
import { APPLICATION_STATUS, APPLICATION_STATUS_OPTIONS } from '../../../../constants/applicationStatus';

export default function ApplicationCard({ app, updating, onStatusChange, onScheduleInterview }) {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

        {/* Left: Candidate info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">

          <SafeAvatar
            src={app.candidate?.profilePhoto ? `${import.meta.env.VITE_API_URL}${app.candidate.profilePhoto}` : ''}
            name={app.candidate?.name}
            alt={app.candidate?.name || 'Candidate'}
            className="w-11 h-11 rounded-full object-cover shrink-0"
            fallbackClassName="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden"
            textClassName="text-blue-700 font-bold text-base"
          />

          <div className="min-w-0 flex-1">
            <p className="font-sora font-bold text-gray-900">
              {app.candidate?.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5 min-w-0">
              <Mail size={12} className="shrink-0" />
              <span className="truncate">{app.candidate?.email || '—'}</span>
            </p>
            {app.candidate?.headline && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {app.candidate.headline}
              </p>
            )}

            {/* Resume buttons */}
            {app.resume ? (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <a
                  href={`${import.meta.env.VITE_API_URL}${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition font-medium"
                >
                  <FileText size={12} /> View
                </a>
                <a
                  href={`${import.meta.env.VITE_API_URL}${app.resume}`}
                  download
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition font-medium"
                >
                  Download
                </a>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-2">No resume uploaded</p>
            )}

            {/* Job title + location + date */}
            <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-400">
              <span className="font-medium text-gray-600">{app.job?.title || '—'}</span>
              {app.job?.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />{app.job.location}
                </span>
              )}
              <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Cover letter */}
            {app.coverLetter && (
              <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 w-full sm:max-w-lg break-words">
                "{app.coverLetter}"
              </p>
            )}
          </div>
        </div>

        {/* Right: Status control */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 md:gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-0 border-gray-100">
          <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${APPLICATION_STATUS[app.status]?.color || 'bg-gray-100 text-gray-600'}`}>
            {APPLICATION_STATUS[app.status]?.label || app.status}
          </span>

          <select
            value={app.status}
            disabled={updating === app._id}
            onChange={(e) => onStatusChange(app._id, e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 bg-white"
          >
            {APPLICATION_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{APPLICATION_STATUS[s].label}</option>
            ))}
          </select>

          {updating === app._id && (
            <span className="text-xs text-gray-400">Saving...</span>
          )}

          {app.status === 'shortlisted' && onScheduleInterview && (
            <button
              type="button"
              onClick={() => onScheduleInterview(app)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
            >
              <Calendar size={12} /> Schedule Interview
            </button>
          )}
        </div>

      </div>
    </div>
  );
}