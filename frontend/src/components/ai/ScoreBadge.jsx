// Reusable score badge used across all AI components

import { Sparkles } from 'lucide-react';
import { getScoreMeta } from '../../utils/matchScore';

export default function ScoreBadge({ score }) {
  const { color, bg } = getScoreMeta(score);
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: bg,
      color,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700
    }}>
      <Sparkles size={11} />
      {score}% Match
    </div>
  );
}