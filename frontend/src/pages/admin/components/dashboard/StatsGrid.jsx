
// Shows the 4 stat cards: Total Users, Companies, Jobs, Applications

import { Users, Briefcase, BarChart3, FileText } from 'lucide-react';

// Sparkline = the small line chart at the bottom of each card
const Sparkline = ({ color }) => {
  const points = [3, 7, 5, 9, 6, 11, 8, 14, 10, 16];
  const max = Math.max(...points);
  const w = 120, h = 40;

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - (p / max) * h;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Each stat card config
const getCards = (stats) => [
  {
    label: 'Total Users',
    value: stats?.totalUsers ?? '—',
    sub: `${stats?.totalCandidates ?? 0} candidates`,
    icon: Users,
    color: '#7c3aed',
    sparkColor: '#7c3aed',
  },
  {
    label: 'Companies',
    value: stats?.totalCompanies ?? '—',
    sub: 'registered',
    icon: Briefcase,
    color: '#0891b2',
    sparkColor: '#0891b2',
  },
  {
    label: 'Jobs Posted',
    value: stats?.totalJobs ?? '—',
    sub: 'all time',
    icon: BarChart3,
    color: '#7c3aed',
    sparkColor: '#a78bfa',
  },
  {
    label: 'Applications',
    value: stats?.totalApplications ?? '—',
    sub: `${stats?.totalHired ?? 0} hired`,
    icon: FileText,
    color: '#059669',
    sparkColor: '#059669',
  },
];

const StatsGrid = ({ stats }) => {
  const cards = getCards(stats);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 20,
      marginBottom: 28,
    }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} style={{
            background: '#fff',
            borderRadius: 16,
            padding: '22px 24px 16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            {/* Top row: label + icon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
                {card.label}
              </span>
              <div style={{
                background: card.color + '18',
                borderRadius: 10,
                padding: 8,
                display: 'flex',
              }}>
                <Icon size={18} color={card.color} />
              </div>
            </div>

            {/* Big number */}
            <div style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
              {card.value}
            </div>

            {/* Sub text */}
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{card.sub}</div>

            {/* Sparkline chart */}
            <div style={{ marginTop: 8 }}>
              <Sparkline color={card.sparkColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;