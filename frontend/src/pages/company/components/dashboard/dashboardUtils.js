import { Briefcase, CheckCircle, FileText, Star } from 'lucide-react';
import { C } from './dashboardTheme';

export const STATUS = {
  applied: { label: 'Applied', color: '#92400e', bg: '#fef3c7' },
  reviewing: { label: 'Reviewing', color: '#1e40af', bg: '#dbeafe' },
  shortlisted: { label: 'Shortlisted', color: '#5b21b6', bg: '#ede9fe' },
  rejected: { label: 'Rejected', color: '#991b1b', bg: '#fee2e2' },
  hired: { label: 'Hired', color: '#065f46', bg: '#d1fae5' },
};

export const STATUS_OPTIONS = ['reviewing', 'shortlisted', 'hired', 'rejected'];

export function timeAgo(date) {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export function getTopJob(jobs) {
  if (!jobs.length) return null;
  return jobs.reduce(
    (best, job) => (job.applicationsCount || 0) > (best.applicationsCount || 0) ? job : best,
    jobs[0]
  );
}

export function getRecentActivity(applications) {
  return applications.slice(0, 5).map(app => ({
    text: `${app.candidate?.name || 'Someone'} applied for ${app.job?.title || 'a job'}`,
    time: timeAgo(app.createdAt),
    color: STATUS[app.status]?.color || C.gray400,
    status: app.status,
  }));
}

export function getDashboardTrends(stats) {
  return {
    appTrend: [3, 5, 4, 8, 7, 9, stats.applications || 0],
    jobTrend: [1, 1, 2, 2, 3, 3, stats.total || 0],
    shortTrend: [0, 1, 1, 2, 3, 3, stats.shortlisted || 0],
    hireTrend: [0, 0, 0, 1, 1, 1, stats.hired || 0],
  };
}

export function getStatCards(stats, trends) {
  const calcPct = (arr) => {
    const curr = arr[arr.length - 1] || 0;
    if (curr === 0) return '0%';
    const prev = arr[arr.length - 2] || 0;
    if (prev === 0) return '+100%';
    const pct = Math.round(((curr - prev) / prev) * 100);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  };

  return [
    { label: 'Total Jobs',    value: stats.total        || 0, sub: 'jobs posted', Icon: Briefcase,    color: C.primary,  trend: trends.jobTrend,   trendPct: calcPct(trends.jobTrend),   id: 'j'  },
    { label: 'Applications',  value: stats.applications || 0, sub: 'received',    Icon: FileText,     color: '#8b5cf6',  trend: trends.appTrend,   trendPct: calcPct(trends.appTrend),   id: 'a'  },
    { label: 'Shortlisted',   value: stats.shortlisted  || 0, sub: 'candidates',  Icon: Star,         color: '#0891b2',  trend: trends.shortTrend, trendPct: calcPct(trends.shortTrend), id: 'sh' },
    { label: 'Hired',         value: stats.hired        || 0, sub: 'this cycle',  Icon: CheckCircle,  color: '#059669',  trend: trends.hireTrend,  trendPct: calcPct(trends.hireTrend),  id: 'h'  },
  ];
}
