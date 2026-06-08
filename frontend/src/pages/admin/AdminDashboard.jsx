// Self-contained: inline ProgressRing, Sparkline, MiniBarChart
// Fully responsive: desktop grid layout + mobile stacked + bottom tab bar

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, GRADIENTS } from '../../theme/adminTheme';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/authService';
import { getAIHealthMetrics, getAdminAnalytics } from '../../services/adminService';
import { API_ENDPOINTS } from '../../constants/api';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';
import AdminRecentUsers from './components/dashboard/AdminRecentUsers';
import StatsGrid from './components/dashboard/StatsGrid';
import PlatformAnalyticsCard from './components/dashboard/PlatformAnalyticsCard';
import ActionCenter from "../../components/admin/ActionCenter";
import LoadingScreen from './components/dashboard/LoadingScreen';
import AdminHero from './components/dashboard/AdminHero';
import DesktopAdminNav from './components/dashboard/DesktopAdminNav';
import MobileAdminLayout from './components/dashboard/MobileAdminLayout';
import AIHealthCard from './components/dashboard/AIHealthCard';

// ─── Main Component ───────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, user, logoutUser } = useAuth();
  const isMobile = useIsMobile();

  const [activeTab,    setActiveTab]   = useState('overview');
  const [stats,        setStats]       = useState(null);
  const [loading,      setLoading]     = useState(true);
  const [aiHealth,     setAiHealth]    = useState(null);

  
  const fetchedRef = useRef(false);

  // ── Fetch stats on mount ─────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const [statsRes, analyticsRes, aiRes] = await Promise.all([
          API.get(API_ENDPOINTS.ADMIN_STATS),
          getAdminAnalytics(),
          getAIHealthMetrics(),
        ]);
        const statsData = statsRes.data.data || statsRes.data;
        const analyticsData = analyticsRes?.data || {};
        setStats({ ...statsData, userGrowth: analyticsData.userGrowth || [] });
        setAiHealth(aiRes.data);
      } catch (err) {
        
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
    if (key === 'hirebot') { navigate(ROUTES.ADMIN_CHAT); return; }
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
    <div style={{ minHeight:'100vh', background: COLORS.gray50, fontFamily:'system-ui,-apple-system,sans-serif' }}>

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
        <div style={{ height: 8 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <ActionCenter />

          <div style={{ marginTop: 20 }}>
            <AIHealthCard data={aiHealth} />
          </div>
        </div>

      {/* ── Desktop Main Content ── */}
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'28px 32px 60px', display:'grid', gridTemplateColumns:'1fr 380px', gap:24 }}>

          {/* Left Column */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <PlatformAnalyticsCard stats={stats} />
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