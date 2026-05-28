import React from 'react';
import { Lightbulb } from 'lucide-react';

const ATSSuggestions = ({ suggestions }) => {
  if (!suggestions?.length) return null;
  return (
    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={14} className="text-amber-700" />
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
          How to Improve
        </p>
      </div>
      <ul className="space-y-1">
        {suggestions.map((s) => (
          <li key={s.id} className="text-xs text-amber-800">• {s.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(ATSSuggestions);