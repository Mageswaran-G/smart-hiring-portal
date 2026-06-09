import { useMemo } from 'react';
import { MapPin, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLUMNS = [
  { status: 'applied',     label: 'Applied',     color: 'bg-blue-50 border-blue-200',     badge: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400'   },
  { status: 'reviewing',   label: 'Reviewing',   color: 'bg-amber-50 border-amber-200',   badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400'  },
  { status: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  { status: 'hired',       label: 'Hired',       color: 'bg-green-50 border-green-200',   badge: 'bg-green-100 text-green-700',   dot: 'bg-green-400'  },
  { status: 'rejected',    label: 'Rejected',    color: 'bg-red-50 border-red-200',       badge: 'bg-red-100 text-red-700',       dot: 'bg-red-400'    },
];

const formatDate = (d) => {
  if (!d) return 'N/A';
  const date = new Date(d);
  if (isNaN(date)) return 'N/A';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function CandidateKanbanBoard({ applications }) {
  const navigate = useNavigate();

  const groupedApps = useMemo(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] ??= [];
      acc[app.status].push(app);
      return acc;
    }, {});
  }, [applications]);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {COLUMNS.map((col) => {
          const colApps = groupedApps[col.status] || [];

          return (
            <div
              key={col.status}
              className={`w-64 rounded-2xl border-2 ${col.color}`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 p-3 min-h-32">
                {colApps.length === 0 && (
                  <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400">
                    No applications
                  </div>
                )}
                {colApps.map((app) => (
                  <div
                    key={app._id}
                    onClick={() => {
                    const id = app.job?.slug || app.job?._id;
                    if (!id) return;
                    navigate(`/jobs/${id}`);
                  }}
                    className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
                  >
                    {/* Job title */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 truncate flex-1">{app.job?.title || 'Unknown Job'}</p>
                      <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                    </div>

                    {/* Company */}
                    <p className="text-xs text-orange-600 font-medium truncate mb-2">
                      {app.job?.postedBy?.companyName || 'Unknown Company'}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500 truncate">{app.job?.location || 'Remote'}</p>
                    </div>

                    {/* Job type */}
                    <div className="flex items-center gap-1 mb-1">
                      <Briefcase size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-500 truncate">{app.job?.jobType || 'Full Time'} · {app.job?.workMode || 'Remote'}</p>
                    </div>

                    {/* Applied date */}
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-400">
                        {formatDate(app.statusHistory?.at(-1)?.changedAt || app.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
