import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Briefcase,
  BookMarked,
  FileText,
  Building2,
  PlusCircle,
  Users,
  BarChart3,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";

// ─── Theme config per role ───────────────────────────────────────
const THEME = {
  candidate: {
    primary: "bg-orange-500",
    primaryHover: "hover:bg-orange-600",
    primaryText: "text-orange-500",
    primaryBorder: "border-orange-500",
    primaryLight: "bg-orange-50",
    primaryLightText: "text-orange-700",
    activeLink: "bg-orange-500/10 text-orange-600 border-l-2 border-orange-500",
    hoverLink: "hover:bg-orange-50 hover:text-orange-600",
    mobilePrimary: "bg-orange-500",
    ring: "ring-orange-400",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    dot: "bg-orange-500",
    label: "Candidate",
  },
  company: {
    primary: "bg-[#1a3a5c]",
    primaryHover: "hover:bg-[#0f2d4a]",
    primaryText: "text-[#1a3a5c]",
    primaryBorder: "border-[#1a3a5c]",
    primaryLight: "bg-blue-50",
    primaryLightText: "text-[#1a3a5c]",
    activeLink: "bg-blue-900/10 text-[#1a3a5c] border-l-2 border-[#1a3a5c]",
    hoverLink: "hover:bg-blue-50 hover:text-[#1a3a5c]",
    mobilePrimary: "bg-[#1a3a5c]",
    ring: "ring-blue-800",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-900",
    dot: "bg-blue-800",
    label: "Company",
  },
  admin: {
    primary: "bg-purple-700",
    primaryHover: "hover:bg-purple-800",
    primaryText: "text-purple-700",
    primaryBorder: "border-purple-600",
    primaryLight: "bg-purple-50",
    primaryLightText: "text-purple-700",
    activeLink: "bg-purple-700/10 text-purple-700 border-l-2 border-purple-600",
    hoverLink: "hover:bg-purple-50 hover:text-purple-700",
    mobilePrimary: "bg-purple-700",
    ring: "ring-purple-500",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    dot: "bg-purple-600",
    label: "Admin",
  },
};

// ─── Nav links per role ───────────────────────────────────────────
const NAV_LINKS = {
  candidate: [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.CANDIDATE_DASHBOARD },
    { label: "My Profile", icon: User, path: ROUTES.PROFILE },
    { label: "Browse Jobs", icon: Briefcase, path: ROUTES.PUBLIC_JOBS },
    { label: "My Applications", icon: FileText, path: ROUTES.CANDIDATE_APPLICATIONS },
    { label: "Saved Jobs", icon: BookMarked, path: ROUTES.SAVED_JOBS },
  ],
  company: [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.COMPANY_DASHBOARD },
    { label: "My Profile", icon: Building2, path: ROUTES.PROFILE },
    { label: "Post a Job", icon: PlusCircle, path: ROUTES.COMPANY_JOB_CREATE },
    { label: "My Jobs", icon: Briefcase, path: ROUTES.COMPANY_JOBS },
    { label: "Applications", icon: Users, path: ROUTES.COMPANY_APPLICATIONS },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
    { label: "Users", icon: Users, path: ROUTES.ADMIN_USERS || "/admin/users" },
    { label: "Jobs", icon: Briefcase, path: ROUTES.ADMIN_JOBS || "/admin/jobs" },
    { label: "Analytics", icon: BarChart3, path: ROUTES.ADMIN_ANALYTICS || "/admin/analytics" },
  ],
};

// ─── Helper: get first letter for avatar ─────────────────────────
function getInitial(name) {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

// ─── Logo color map ───────────────────────────────────────────────
const LOGO_COLORS = {
  candidate: "text-orange-500",
  company: "text-[#1a3a5c]",
  admin: "text-purple-700",
};

// ─── Component ───────────────────────────────────────────────────
export default function DashboardLayout({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = THEME[role] || THEME.candidate;
  const links = NAV_LINKS[role] || NAV_LINKS.candidate;
  const logoColor = LOGO_COLORS[role] || LOGO_COLORS.candidate;

  const handleLogout = async () => {
    await logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path) => location.pathname === path;

  const displayName = profile?.name || user?.name || "User";
  const photoUrl = profile?.photo || null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-md
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className={`${theme.primary} px-5 py-4 flex items-center justify-between`}>
          <Link
            to={links[0].path}
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <Shield size={22} className="text-white" />
            <span className="text-white font-bold text-lg tracking-tight">
              HirePortal
            </span>
          </Link>
          <button
            className="lg:hidden text-white/80 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User info in sidebar */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                className={`w-10 h-10 rounded-full object-cover ring-2 ${theme.ring}`}
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full ${theme.primary} flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow`}
              >
                {getInitial(displayName)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {displayName}
              </p>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${theme.badgeBg} ${theme.badgeText} mt-0.5`}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${theme.dot} mr-1 align-middle`} />
                {theme.label}
              </span>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ label, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group
                ${isActive(path)
                  ? `${theme.activeLink} font-semibold`
                  : `text-gray-600 ${theme.hoverLink}`
                }
              `}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 ${isActive(path) ? theme.primaryText : "text-gray-400 group-hover:" + theme.primaryText}`}
              />
              {label}
              {isActive(path) && (
                <ChevronRight size={14} className={`ml-auto ${theme.primaryText}`} />
              )}
            </Link>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-red-500 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile only) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900 p-1"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={18} className={logoColor} />
            <span className={`font-bold text-base ${logoColor}`}>HirePortal</span>
          </div>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              className={`w-8 h-8 rounded-full object-cover ring-2 ${theme.ring}`}
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full ${theme.primary} flex items-center justify-center text-white font-bold text-xs`}
            >
              {getInitial(displayName)}
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}