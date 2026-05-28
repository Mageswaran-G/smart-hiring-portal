import React from 'react';
import CardSkeleton from '../ui/CardSkeleton';
import ATSHeader from './ats/ATSHeader';
import ATSBreakdown from './ats/ATSBreakdown';
import ATSSuggestions from './ats/ATSSuggestions';
import { SCORE_COLOR_MAP } from '../../utils/scoreColors';

const ATSScoreCard = ({ data, loading }) => {
  if (loading) return <CardSkeleton lines={4} />;
  if (!data) return null;

  const colors = SCORE_COLOR_MAP[data.color] || SCORE_COLOR_MAP.orange;

  return (
    <div className={`rounded-2xl p-6 border border-gray-100 shadow-sm ${colors.bg}`}>
      <ATSHeader
        score={data.score}
        color={colors}
        label={data.label}
        wordCount={data.wordCount}
      />
      <ATSBreakdown breakdown={data.breakdown} />
      <ATSSuggestions suggestions={data.suggestions} />
    </div>
  );
};

export default React.memo(ATSScoreCard);