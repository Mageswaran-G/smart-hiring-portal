import { useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';

const STATUS_OPTIONS = ['applied', 'reviewing', 'shortlisted', 'hired', 'rejected'];

export default function KanbanCard({ app, onStatusChange, updating }) {
  const [dragging, setDragging] = useState(false);
  const isUpdating = updating === app._id;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const initials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('applicationId', app._id);
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      className={`bg-white border border-gray-200 rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all ${dragging ? 'opacity-40 scale-95' : 'hover:border-blue-300 hover:shadow-md'} ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Candidate info */}
      <div className="flex items-center gap-2 mb-2">
        {app.candidate?.profilePhoto ? (
          <img src={app.candidate.profilePhoto} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
            {initials(app.candidate?.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{app.candidate?.name || 'Unknown'}</p>
          <p className="text-xs text-gray-400 truncate">{app.candidate?.email || ''}</p>
        </div>
      </div>

      {/* Job title */}
      <div className="flex items-center gap-1 mb-2">
        <Briefcase size={11} className="text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-500 truncate">{app.job?.title || 'Unknown Job'}</p>
      </div>

      {/* Applied date */}
      <div className="flex items-center gap-1">
        <Calendar size={11} className="text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-400">{formatDate(app.createdAt)}</p>
      </div>

      {isUpdating && (
        <div className="flex items-center gap-1 mt-2">
          <span className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-xs text-blue-500">Updating...</span>
        </div>
      )}
    </div>
  );
}
