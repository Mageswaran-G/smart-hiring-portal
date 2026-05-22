
// Purple theme — #7c3aed / #5b21b6
// Self-contained: inline ProgressRing, Sparkline, MiniBarChart
// Fully responsive: desktop grid layout + mobile stacked + bottom tab bar

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/authService';
import { API_ENDPOINTS } from '../../constants/api';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';
import AdminRecentUsers from './components/dashboard/AdminRecentUsers';
import StatsGrid from './components/dashboard/StatsGrid';
import PlatformAnalyticsCard from './components/dashboard/PlatformAnalyticsCard';
import ModuleRoadmap from './components/dashboard/ModuleRoadmap';
import ActionCenter from "../../components/admin/ActionCenter";
import LoadingScreen from './components/dashboard/LoadingScreen';
import AdminHero from './components/dashboard/AdminHero';
import DesktopAdminNav from './components/dashboard/DesktopAdminNav';
import MobileAdminLayout from './components/dashboard/MobileAdminLayout';

const C = {
  primary : '#7c3aed',
  grad    : 'linear-gradient(135deg, #1e0b4b 0%, #2e1065 25%, #4c1d95 55%, #6d28d9 80%, #7c3aed 100%)',
  gray50  : '#f9fafb',
  gray100 : '#f3f4f6',
  gray200 : '#e5e7eb',
  gray400 : '#9ca3af',
  gray500 : '#6b7280',
  gray900 : '#111827',
  border  : '#ddd6fe',
};

// ─── Main Component ───────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, user, logoutUser } = useAuth();
  const isMobile = useIsMobile();

  const [activeTab,    setActiveTab]   = useState('overview');
  const [stats,        setStats]       = useState(null);
  const [loading,      setLoading]     = useState(true);

  
  const fetchedRef = useRef(false);

  // ── Fetch stats on mount ─────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const res = await API.get(API_ENDPOINTS.ADMIN_STATS);
        setStats(res.data.data || res.data);
      } catch (err) {
        console.error('AdminDashboard stats error:', err);
        setStats({ totalUsers:0, totalCandidates:0, totalCompanies:0, totalJobs:0, totalApplications:0, hired:0, shortlisted:0, recentUsers:[] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleTab = (key) => {
    if (key === 'companies') {
      navigate('/admin/companies');
      return;
    }
    if (key === 'users') {
      navigate('/admin/users');
      return;
    }
    if (key === 'jobs') {
      navigate('/admin/jobs');
      return;
    }
    if (key === 'analytics') {
      navigate('/admin/analytics');
      return;
    }
    setActiveTab(key);
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate(ROUTES.LOGIN);
  };

  if (loading) return <LoadingScreen />;

  const hireRate   = stats?.totalApplications > 0
    ? Math.round((stats.hired / stats.totalApplications) * 100)
    : 0;

  const adminName  = profile?.name || user?.name || 'Admin';
  const adminEmail = user?.email || profile?.email || 'admin@hireportal.com';

  // ════════════════════════════════════════════════════════════
  // MOBILE LAYOUT
  // ════════════════════════════════════════════════════════════
    if (isMobile) {
    return (
      <MobileAdminLayout
        adminName={adminName}
        adminEmail={adminEmail}
        stats={stats}
        hireRate={hireRate}
        activeTab={activeTab}
        onTab={handleTab}
        onLogout={handleLogout}
      />
    );
  }

  // ════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // ════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight:'100vh', background:C.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>

      {/* ── Desktop Header ── */}
      
        <DesktopAdminNav
          adminName={adminName}
          activeTab={activeTab}
          onTab={handleTab}
          onLogout={handleLogout}
        />

      {/* ── Overview Tab Content — only shows when activeTab is overview ── */}
      {activeTab === 'overview' && <>

      
      {/* ── Desktop Hero ── */}
        <AdminHero
          adminName={adminName}
          adminEmail={adminEmail}
          stats={stats}
          hireRate={hireRate}
          
        />

        <StatsGrid stats={stats} />

        <ActionCenter />  

      {/* ── Desktop Main Content ── */}
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'22px 32px 48px', display:'grid', gridTemplateColumns:'1fr 380px', gap:22 }}>

          {/* Left Column */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <PlatformAnalyticsCard stats={stats} />
            <ModuleRoadmap />
          </div>
        {/* Right Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          

          {/* Recent Signups — extracted component */}
          <AdminRecentUsers recentUsers={stats?.recentUsers || []} />
        </div>
      </main>

      </> }  {/* ── End overview tab ── */}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </div>
  );
}