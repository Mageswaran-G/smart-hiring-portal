// ScoreBadge.jsx — Reusable score badge — Tailwind version

import { Sparkles } from 'lucide-react';
import { getScoreMeta } from '../../utils/matchScore';

export default function ScoreBadge({ score }) {
  const { color, bg } = getScoreMeta(score);
  return (
    <div
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ background: bg, color }}
    >
      <Sparkles size={11} />
      {score}% Match
    </div>
  );
}