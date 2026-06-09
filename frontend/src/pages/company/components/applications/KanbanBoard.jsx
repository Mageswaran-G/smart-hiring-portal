import { useState, useMemo } from 'react';
import KanbanCard from './KanbanCard';

const COLUMNS = [
  { status: 'applied',     label: 'Applied',     color: 'bg-blue-50 border-blue-200',     badge: 'bg-blue-100 text-blue-700'   },
  { status: 'reviewing',   label: 'Reviewing',   color: 'bg-amber-50 border-amber-200',   badge: 'bg-amber-100 text-amber-700' },
  { status: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700'},
  { status: 'hired',       label: 'Hired',       color: 'bg-green-50 border-green-200',   badge: 'bg-green-100 text-green-700' },
  { status: 'rejected',    label: 'Rejected',    color: 'bg-red-50 border-red-200',       badge: 'bg-red-100 text-red-700'     },
];

export default function KanbanBoard({ applications, onStatusChange, updating }) {
  const [dragOver, setDragOver] = useState(null);

  const groupedApps = useMemo(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] ??= [];
      acc[app.status].push(app);
      return acc;
    }, {});
  }, [applications]);

  const handleDragOver = (e, status) => {
    e.preventDefault();
    setDragOver(status);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOver(null);
    const applicationId = e.dataTransfer.getData('applicationId');
    const app = applications.find(a => a._id === applicationId);
    if (!app || app.status === newStatus) return;
    onStatusChange(applicationId, newStatus);
  };

  const handleDragLeave = () => setDragOver(null);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {COLUMNS.map((col) => {
          const colApps = groupedApps[col.status] || [];
          const isOver  = dragOver === col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              onDragLeave={handleDragLeave}
              className={`w-64 rounded-2xl border-2 transition-all ${col.color} ${isOver ? 'scale-[1.02] shadow-lg border-dashed' : ''}`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-inherit">
                <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3 p-3 min-h-32">
                {colApps.length === 0 && (
                  <div className={`flex items-center justify-center h-20 rounded-xl border-2 border-dashed text-xs text-gray-400 transition-all ${isOver ? 'border-gray-400 bg-white' : 'border-gray-200'}`}>
                    {isOver ? 'Drop here' : 'No applicants'}
                  </div>
                )}
                {colApps.map((app) => (
                  <KanbanCard
                    key={app._id}
                    app={app}
                    onStatusChange={onStatusChange}
                    updating={updating}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
