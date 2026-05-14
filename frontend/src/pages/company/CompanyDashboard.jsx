// CompanyDashboard
import { useEffect, useState }    from 'react';
import { useNavigate }            from 'react-router-dom';
import { useAuth }                from '../../context/AuthContext';
import DashboardLayout            from '../../components/layout/DashboardLayout';
import { ROUTES }                 from '../../constants/routes';
import { getMyJobs }              from '../../services/jobService';
import { getCompanyApplications } from '../../services/applicationService';
import {
  Building2, Briefcase, Users,
  TrendingUp, CheckCircle2, XCircle,
  Clock, Star
} from 'lucide-react';

export default function CompanyDashboard() {

  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobs, apps] = await Promise.all([
          getMyJobs(),
          getCompanyApplications(),
        ]);

        const jobList  = jobs.data  || [];
        const appList  = apps || [];

        setStats({
          totalJobs:       jobList.length,
          activeJobs:      jobList.filter(j => j.isActive).length,
          totalApps:       appList.length,
          shortlisted:     appList.filter(a => a.status === 'shortlisted').length,
          hired:           appList.filter(a => a.status === 'hired').length,
          rejected:        appList.filter(a => a.status === 'rejected').length,
          reviewing:       appList.filter(a => a.status === 'reviewing').length,
          applied:         appList.filter(a => a.status === 'applied').length,
        });
      } catch {
        // Fail silently — stats are non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const companyName = user?.companyName || user?.name || 'Company';
  const initial     = companyName.charAt(0).toUpperCase();

  return (
    <DashboardLayout>

      {/* ── Welcome Card ── */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-6 flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-2xl font-sora">{initial}</span>
        </div>
        <div>
          <h1 className="font-sora text-2xl font-bold text-gray-900">
            Company Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
          <span className="inline-block mt-1 px-3 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
            Company
          </span>
        </div>
        <p className="ml-auto text-sm text-gray-400 hidden md:block">
          Manage your company profile, job postings and applicants.
        </p>
      </div>

      {/* ── Analytics Stats ── */}
      {!loading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <StatCard
            icon={<Briefcase size={20} />}
            label="Total Jobs"
            value={stats.totalJobs}
            sub={`${stats.activeJobs} active`}
            color="blue"
          />
          <StatCard
            icon={<Users size={20} />}
            label="Total Applications"
            value={stats.totalApps}
            sub={`${stats.applied} new`}
            color="orange"
          />
          <StatCard
            icon={<Star size={20} />}
            label="Shortlisted"
            value={stats.shortlisted}
            sub={`${stats.reviewing} reviewing`}
            color="purple"
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Hired"
            value={stats.hired}
            sub={`${stats.rejected} rejected`}
            color="green"
          />

        </div>
      )}

      {/* Loading skeleton for stats */}
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

        <DashCard
          icon={<Building2 size={24} />}
          title="Company Profile"
          desc="Update company info and details"
          onClick={() => navigate(ROUTES.PROFILE)}
        />
        <DashCard
          icon={<Briefcase size={24} />}
          title="Job Postings"
          desc="Create and manage your job listings"
          onClick={() => navigate(ROUTES.COMPANY_JOBS)}
          badge={stats?.totalJobs || null}
        />
        <DashCard
          icon={<Users size={24} />}
          title="Applicants"
          desc="Review and manage candidates"
          onClick={() => navigate(ROUTES.COMPANY_APPLICATIONS)}
          badge={stats?.totalApps || null}
          badgeColor="orange"
        />

      </div>

    </DashboardLayout>
  );
}

// ── Small stat card ─────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    green:  'bg-green-50 text-green-600',
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

// ── Navigation card ─────────────────────────────────────
function DashCard({ icon, title, desc, onClick, badge, badgeColor = 'blue' }) {
  const badgeColors = {
    blue:   'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border-l-4 border-blue-600 shadow-sm hover:shadow-md transition text-left w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-blue-600">{icon}</span>
        {badge !== null && badge !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="font-sora font-bold text-gray-900">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </button>
  );
}