import React from 'react';
import { FileText } from 'lucide-react';
import { clampPercent } from '../../../utils/scoreColors';

const ATSHeader = ({ score, color, label, wordCount }) => (
  <>
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <FileText size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">ATS Resume Score</h3>
          <p className="text-xs text-gray-500">How ATS-friendly is your resume?</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-4xl font-black ${color.ring}`}>{clampPercent(score)}</p>
        <p className="text-xs text-gray-400">out of 100</p>
      </div>
    </div>
    <div className="mb-5">
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${color.badge}`}>{label}</span>
      <span className="text-xs text-gray-400 ml-2">Resume length: {wordCount} words</span>
    </div>
  </>
);

export default React.memo(ATSHeader);