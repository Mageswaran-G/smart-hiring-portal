import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getCompanyDashboardStats, getMyJobs, getCompanyTrend } from '../services/jobService';
import { getCompanyApplications } from '../services/applicationService';
import {
  getDashboardTrends,
  getRecentActivity,
  getStatCards,
  getTopJob,
} from '../pages/company/components/dashboard/dashboardUtils';

const EMPTY_STATS = {
  total: 0,
  applications: 0,
  shortlisted: 0,
  hired: 0,
  activeCount: 0,
  reviewing: 0,
};

const mapDashboardStats = (statsData = {}, realTrend) => ({
  total:       statsData.totalJobs   || 0,
  activeCount: statsData.activeJobs  || 0,
  applications:statsData.totalApps   || 0,
  reviewing:   statsData.reviewing   || 0,
  shortlisted: statsData.shortlisted || 0,
  hired:       statsData.hired       || 0,
  appTrend:    Array.isArray(realTrend) && realTrend.length === 7 ? realTrend : [0,0,0,0,0,0,0],
});

export default function useCompanyDashboardData() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardNow] = useState(() => Date.now());

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [statsData, appsData, jobsData, trendRes] = await Promise.all([
          getCompanyDashboardStats(),
          getCompanyApplications(),
          getMyJobs(),
          getCompanyTrend(),
        ]);

        if (!isMounted) return;

        const realTrend = trendRes?.trend;
        setStats(mapDashboardStats(statsData, realTrend));
        setApplications(Array.isArray(appsData) ? appsData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        if (!isMounted) return;
        toast.error('Failed to load dashboard');
        
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusUpdate = useCallback((appId, newStatus) => {
    setApplications(prev => prev.map(app => (
      app._id === appId ? { ...app, status: newStatus } : app
    )));
  }, []);

  const hireRate = useMemo(
    () => stats.applications > 0 ? Math.round((stats.hired / stats.applications) * 100) : 0,
    [stats.applications, stats.hired]
  );
  const topJob = useMemo(() => getTopJob(jobs), [jobs]);
  const recentActivity = useMemo(() => getRecentActivity(applications), [applications]);
  const trends = useMemo(() => getDashboardTrends(stats, stats.appTrend), [stats]);
  const statCards = useMemo(() => getStatCards(stats, trends), [stats, trends]);

  return {
    loading,
    stats,
    jobs,
    applications,
    dashboardNow,
    hireRate,
    topJob,
    recentActivity,
    trends,
    statCards,
    handleStatusUpdate,
  };
}