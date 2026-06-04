// Main entry point
// Mobile and Desktop layouts extracted to components/dashboard/

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications, getMyApplicationTrend } from '../../services/applicationService';
import { getSavedJobIds } from '../../services/savedJobService';
import { getAllJobs } from '../../services/jobService';
import { ROUTES } from '../../constants/routes';
import useIsMobile from '../../hooks/useIsMobile';
import { calcProfileStrength } from '../../utils/profileStrength';
import LoadingScreen from './components/dashboard/LoadingScreen';
import MobileDashboard from './components/dashboard/MobileDashboard';
import DesktopDashboard from "./components/dashboard/DesktopDashboard";
import HireBot from "../../components/chat/HireBot";

export default function CandidateDashboard() {
  const navigate  = useNavigate();
  const { profile, logoutUser } = useAuth();
  const isMobile  = useIsMobile();

  const [activeTab,    setActiveTab]    = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedCount,   setSavedCount]   = useState(0);
  const [jobs,         setJobs]         = useState([]);
  const [appTrendData, setAppTrendData] = useState([0,0,0,0,0,0,0]);
  const [loading,      setLoading]      = useState(true);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const [apps, savedIds, jobsRes, trendRes] = await Promise.all([
          getMyApplications(),
          getSavedJobIds(),
          getAllJobs({ limit: 4 }),
          getMyApplicationTrend(),
        ]);
        setApplications(Array.isArray(apps) ? apps : []);
        setSavedCount(Array.isArray(savedIds) ? savedIds.length : 0);
        const jArr = Array.isArray(jobsRes) ? jobsRes : (jobsRes?.jobs || jobsRes?.data || []);
        setJobs(jArr);
        const trendArr = trendRes?.data?.trend;
        if (Array.isArray(trendArr) && trendArr.length === 7) setAppTrendData(trendArr);
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleTab = (key) => {
    if (key === 'jobs')    { navigate(ROUTES.PUBLIC_JOBS);            return; }
    if (key === 'saved')   { navigate(ROUTES.SAVED_JOBS);             return; }
    if (key === 'apps')    { navigate(ROUTES.CANDIDATE_APPLICATIONS); return; }
    if (key === 'profile') { navigate(ROUTES.PROFILE);                return; }
    setActiveTab(key);
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate(ROUTES.LOGIN);
  };

  // Derived stats
  const completion  = calcProfileStrength(profile);
  const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
  const hired       = applications.filter(a => a.status === 'hired').length;

  // Sparkline trends — appTrend is real 7-day data from backend
  const appTrend   = appTrendData;
  const savedTrend = [0, 0, 0, 0, 0, 0, savedCount];
  const shortTrend = [0, 0, 0, 0, 0, 0, shortlisted];
  const hiredTrend = [0, 0, 0, 0, 0, 0, hired];

  if (loading) return <LoadingScreen />;

  const sharedProps = {
    profile, applications, savedCount,
    shortlisted, hired, completion, jobs,
    appTrend, savedTrend, shortTrend, hiredTrend,
  };

  if (isMobile) {
    return (
      <>
        <MobileDashboard
          {...sharedProps}
          activeTab={activeTab}
          handleTab={handleTab}
          handleLogout={handleLogout}
        />
        <HireBot />
      </>
    );
  }

  return (
    <>
      <DesktopDashboard {...sharedProps} />
      <HireBot />
    </>
  );
}