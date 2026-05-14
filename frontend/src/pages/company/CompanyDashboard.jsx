// CompanyDashboard

import { useEffect, useState }    from 'react';
import { useNavigate }            from 'react-router-dom';
import { useAuth }                from '../../context/AuthContext';
import DashboardLayout            from '../../components/layout/DashboardLayout';
import { ROUTES }                 from '../../constants/routes';
import { getMyJobs }              from '../../services/jobService';
import { getCompanyApplications } from '../../services/applicationService';
import { getCompanyDashboardStats } from '../../services/jobService';

import {
  Building2, Briefcase, Users,
  Plus, Star, CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function CompanyDashboard() {

  const { user, profile } = useAuth();
  const navigate          = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCompanyDashboardStats(); // ← single clean call
        setStats(data);
      } catch {
        // non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const companyName = profile?.companyName || user?.name || 'Company';
  const initial     = companyName.charAt(0).toUpperCase();
  const industry    = profile?.industry || 'Your Industry';

  return (
    <DashboardLayout>

      {/* ── Hero Welcome Card ── */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 rounded-2xl p-8 mb-6 overflow-hidden shadow-lg">

        {/* Background decoration */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Left — Company info */}
          <div className="flex items-center gap-5">

            {/* Company avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-white font-bold text-2xl font-sora">{initial}</span>
            </div>

            <div>
              <p className="text-white/70 text-sm font-medium">Welcome back,</p>
              <h1 className="font-sora text-2xl font-bold text-white leading-tight">
                {companyName}
              </h1>
              <p className="text-white/70 text-sm mt-0.5">{user?.email}</p>

              <span className="inline-flex items-center gap-1 mt-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Building2 size={11} />
                {industry}
              </span>
            </div>

          </div>

          {/* Right — Post job CTA + quick stat */}
          <div className="flex flex-col items-start md:items-end gap-3">

            {/* Post new job — main CTA */}
            <button
              onClick={() => navigate(ROUTES.COMPANY_JOB_CREATE)}
              className="flex items-center gap-2 bg-white text-blue-900 font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition shadow-sm"
            >
              <Plus size={16} />
              Post New Job
              <ArrowRight size={14} />
            </button>

            {/* Quick stat pill */}
            {stats && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Briefcase size={12} />
                  {stats.totalJobs} job{stats.totalJobs !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <Users size={12} />
                  {stats.totalApps} applicant{stats.totalApps !== 1 ? 's' : ''}
                </span>
                {stats.shortlisted > 0 && (
                  <span className="flex items-center gap-1.5 bg-green-400/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Star size={12} />
                    {stats.shortlisted} shortlisted
                  </span>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ── Analytics Stats ── */}
      {!loading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Briefcase size={20} />} label="Total Jobs"    value={stats.totalJobs}   sub={`${stats.activeJobs} active`}      color="blue"   />
          <StatCard icon={<Users     size={20} />} label="Applications"  value={stats.totalApps}   sub={`${stats.applied} new`}            color="orange" />
          <StatCard icon={<Star      size={20} />} label="Shortlisted"   value={stats.shortlisted} sub="candidates"                        color="purple" />
          <StatCard icon={<CheckCircle2 size={20}/>} label="Hired"       value={stats.hired}       sub="this cycle"                        color="green"  />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
              <div className="w-9 h-9 bg-gray-200 rounded-xl mb-3" />
              <div className="h-7 bg-gray-200 rounded w-12 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
          ))}
        </div>
      )}

      {/* ── Navigation Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <NavCard
          icon={<Building2 size={24} />}
          title="Company Profile"
          desc="Update company info and details"
          onClick={() => navigate(ROUTES.PROFILE)}
          badge={null}
        />
        <NavCard
          icon={<Briefcase size={24} />}
          title="Job Postings"
          desc="Create and manage your listings"
          onClick={() => navigate(ROUTES.COMPANY_JOBS)}
          badge={stats?.totalJobs}
          badgeColor="bg-blue-100 text-blue-700"
        />
        <NavCard
          icon={<Users size={24} />}
          title="Applicants"
          desc="Review and manage candidates"
          onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)}
          badge={stats?.totalApps}
          badgeColor="bg-orange-100 text-orange-700"
        />

      </div>

    </DashboardLayout>
  );
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  const colors = {
    blue:   'bg-blue-50   text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    green:  'bg-green-50  text-green-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="font-sora font-bold text-2xl text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

// ── Nav card ─────────────────────────────────────────────
function NavCard({ icon, title, desc, onClick, badge, badgeColor }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border-l-4 border-blue-600 shadow-sm hover:shadow-md transition text-left w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-blue-700">{icon}</span>
        {badge !== null && badge !== undefined && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="font-sora font-bold text-gray-900">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </button>
  );
}