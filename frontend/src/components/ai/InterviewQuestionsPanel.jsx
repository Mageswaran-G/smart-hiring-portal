// InterviewQuestionsPanel.jsx
// AI generated interview questions for company/recruiter

import { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { generateInterviewQuestions } from '../../services/aiService';
import toast from 'react-hot-toast';

const TYPE_STYLES = {
  Technical:      'bg-blue-50 text-blue-700',
  Behavioural:    'bg-purple-50 text-purple-700',
  Leadership:     'bg-amber-50 text-amber-700',
  'Problem Solving': 'bg-green-50 text-green-700',
  Learning:       'bg-teal-50 text-teal-700',
};

export default function InterviewQuestionsPanel({ jobId }) {
  const [questions, setQuestions]   = useState([]);
  const [loading,   setLoading]     = useState(false);
  const [generated, setGenerated]   = useState(false);
  const [collapsed, setCollapsed]   = useState(false);

  const handleGenerate = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const data = await generateInterviewQuestions(jobId);
      setQuestions(data.questions || []);
      setGenerated(true);
      setCollapsed(false);
    } catch (err) {
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <h2 className="font-bold text-base text-gray-900">
              AI Interview Questions
            </h2>
            <p className="text-xs text-gray-400">
              Generated based on job skills and level
            </p>
          </div>
        </div>

        {/* Toggle collapse if generated */}
        {generated && (
          <button
            type="button"
            onClick={() => setCollapsed(prev => !prev)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
            />
          </button>
        )}
      </div>

      {/* Generate button */}
      {!generated && (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Sparkles size={14} />
          {loading ? 'Generating...' : 'Generate Interview Questions'}
        </button>
      )}

      {/* Regenerate button */}
      {generated && !collapsed && (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mb-4 text-xs text-blue-600 hover:text-blue-800 font-semibold underline disabled:opacity-50"
        >
          {loading ? 'Regenerating...' : 'Regenerate'}
        </button>
      )}

      {/* Questions list */}
      <div className={`overflow-hidden transition-all duration-300 ${generated && !collapsed ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-gray-400">Q{i + 1}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_STYLES[q.type] || 'bg-gray-100 text-gray-600'}`}>
                  {q.type}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {q.question}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}