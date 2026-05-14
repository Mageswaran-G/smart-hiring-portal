// AdminDashboard

import { useAuth }      from '../../context/AuthContext';
import DashboardLayout  from '../../components/layout/DashboardLayout';
import {
  Users, BarChart3, CheckCircle,
  Shield, Settings, AlertTriangle,
  TrendingUp, Briefcase, FileText,
  Lock
} from 'lucide-react';

export default function AdminDashboard() {

  const { user } = useAuth();
  const name     = user?.name || 'Admin';
  const initial  = name.charAt(0).toUpperCase();

  return (
    <DashboardLayout>

      {/* ── Hero Welcome Card ── */}
      <div className="relative bg-gradient-to-br from-purple-800 via-purple-700 to-violet-700 rounded-2xl p-8 mb-6 overflow-hidden shadow-lg">

        {/* Background decoration */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute top-4 right-32 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Left — Admin info */}
          <div className="flex items-center gap-5">

            {/* Admin avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-white font-bold text-2xl font-sora">{initial}</span>
            </div>

            <div>
              <p className="text-white/70 text-sm font-medium">Signed in as</p>
              <h1 className="font-sora text-2xl font-bold text-white leading-tight">
                {name}
              </h1>
              <p className="text-white/70 text-sm mt-0.5">{user?.email}</p>

              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <Shield size={11} />
                  SUPER ADMIN
                </span>
                <span className="inline-flex items-center gap-1.5 bg-green-400/30 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  System Online
                </span>
              </div>
            </div>

          </div>

          {/* Right — Platform status panel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 flex flex-col gap-2 min-w-[200px]">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
              Platform Status
            </p>
            <StatusRow label="Backend API"   status="Online" green />
            <StatusRow label="Database"      status="Online" green />
            <StatusRow label="File Storage"  status="Online" green />
            <StatusRow label="Module 5"      status="In Progress" yellow />
          </div>

        </div>
      </div>

      {/* ── Module 5 banner ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-6 flex items-center gap-3">
        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
        <p className="text-sm text-amber-700 font-medium">
          Module 5 (Admin Features) is currently under development.
          <span className="text-amber-500 font-semibold ml-1">
            User management, job moderation, and analytics will be live soon.
          </span>
        </p>
      </div>

      {/* ── Module 5 Feature Cards ── */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
        Module 5 — Coming Soon
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <ComingSoonCard
          icon={<Users size={24} />}
          title="User Management"
          desc="View all users, change roles, suspend accounts"
          features={['View all candidates', 'View all companies', 'Change user roles', 'Suspend / ban users']}
        />
        <ComingSoonCard
          icon={<CheckCircle size={24} />}
          title="Job Moderation"
          desc="Review and approve job postings"
          features={['Review pending jobs', 'Approve or reject', 'Flag inappropriate', 'Company verification']}
        />
        <ComingSoonCard
          icon={<BarChart3 size={24} />}
          title="Platform Analytics"
          desc="Monitor platform health and metrics"
          features={['Total users', 'Jobs posted', 'Applications count', 'Growth trends']}
        />

      </div>

      {/* ── Module 6 Feature Cards ── */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
        Module 6 — Advanced Features (Week 6)
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <LockedCard
          icon={<TrendingUp size={22} />}
          title="AI Job Suggestions"
          week="Week 6"
        />
        <LockedCard
          icon={<FileText size={22} />}
          title="Resume Matching"
          week="Week 6"
        />
        <LockedCard
          icon={<Settings size={22} />}
          title="Email Notifications"
          week="Week 6"
        />

      </div>

    </DashboardLayout>
  );
}

// ── Platform status row ───────────────────────────────────
function StatusRow({ label, status, green, yellow }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70 text-xs">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-semibold
        ${green ? 'text-green-300' : yellow ? 'text-amber-300' : 'text-red-300'}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full
          ${green ? 'bg-green-400' : yellow ? 'bg-amber-400' : 'bg-red-400'}`}
        />
        {status}
      </span>
    </div>
  );
}

// ── Coming soon card ─────────────────────────────────────
function ComingSoonCard({ icon, title, desc, features }) {
  return (
    <div className="bg-white rounded-2xl p-6 border-l-4 border-purple-500 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-purple-600">{icon}</span>
        <span className="text-xs font-bold bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full border border-purple-100">
          Module 5
        </span>
      </div>
      <p className="font-sora font-bold text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-400 mb-4">{desc}</p>
      <ul className="flex flex-col gap-1.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 bg-purple-300 rounded-full shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Locked / future card ──────────────────────────────────
function LockedCard({ icon, title, week }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 flex items-center gap-4 opacity-70">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-sora font-bold text-gray-500 text-sm">{title}</p>
        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Lock size={10} />
          Planned — {week}
        </span>
      </div>
    </div>
  );
}