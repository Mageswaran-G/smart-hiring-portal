import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import { ROUTES } from '../../constants/routes';
import { getAdminApplications } from '../../services/adminService';

const COLUMNS = [
  { status: 'applied',     label: 'Applied',     color: 'bg-blue-50 border-blue-200',     badge: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400'   },
  { status: 'reviewing',   label: 'Reviewing',   color: 'bg-amber-50 border-amber-200',   badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400'  },
  { status: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  { status: 'hired',       label: 'Hired',       color: 'bg-green-50 border-green-200',   badge: 'bg-green-100 text-green-700',   dot: 'bg-green-400'  },
  { status: 'rejected',    label: 'Rejected',    color: 'bg-red-50 border-red-200',       badge: 'bg-red-100 text-red-700',       dot: 'bg-red-400'    },
  { status: 'withdrawn',   label: 'Withdrawn',   color: 'bg-gray-50 border-gray-200',     badge: 'bg-gray-100 text-gray-600',     dot: 'bg-gray-400'   },
];

const formatDate = (d) => {
  if (!d) return 'N/A';
  const date = new Date(d);
  if (isNaN(date)) return 'N/A';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const initials = (name = '') => name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminApplications();
        setApplications(data);
      } catch {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const groupedApps = useMemo(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] ??= [];
      acc[app.status].push(app);
      return acc;
    }, {});
  }, [applications]);

  const total = applications.length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Applications Kanban"
        subtitle={loading ? 'Loading...' : `${total} total application${total !== 1 ? 's' : ''} across all companies`}
        backRoute={ROUTES.ADMIN_DASHBOARD}
      />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && applications.length === 0 && (
        <EmptyState
          icon={<Briefcase size={32} />}
          title="No applications found"
          subtitle="Applications will appear here once candidates apply"
          variant="admin"
        />
      )}

      {!loading && applications.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6 sm:grid-cols-6">
          {COLUMNS.map((col) => {
            const count = (groupedApps[col.status] || []).length;
            return (
              <div key={col.status} className={`rounded-xl border p-3 text-center ${col.color}`}>
                <p className="text-lg font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500 font-medium">{col.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {COLUMNS.map((col) => {
              const colApps = groupedApps[col.status] || [];
              return (
                <div key={col.status} className={`w-64 rounded-2xl border-2 ${col.color}`}>
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
                        className="bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
                      >
                        {/* Candidate */}
                        <div className="flex items-center gap-2 mb-2">
                          {app.candidate?.profilePhoto ? (
                            <img src={app.candidate.profilePhoto} alt={app.candidate?.name || 'Candidate'} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold flex-shrink-0">
                              {initials(app.candidate?.name)}
                            </div>
                          )}
                          <p className="text-xs font-semibold text-gray-900 truncate">{app.candidate?.name || 'Unknown'}</p>
                        </div>

                        {/* Job title */}
                        <p className="text-sm font-semibold text-gray-800 truncate mb-1">{app.job?.title || 'Unknown Job'}</p>

                        {/* Company */}
                        <p className="text-xs text-purple-600 font-medium truncate mb-2">{app.job?.postedBy?.companyName || 'Unknown Company'}</p>

                        {/* Location */}
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                          <p className="text-xs text-gray-500 truncate">{app.job?.location || 'Remote'}</p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1">
                          <Calendar size={11} className="text-gray-400 flex-shrink-0" />
                          <p className="text-xs text-gray-400">{formatDate(app.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
