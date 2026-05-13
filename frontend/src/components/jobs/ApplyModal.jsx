// ApplyModal.jsx
// Modal that appears when candidate clicks Apply Now
// Lets them write a cover letter before submitting

import { useState } from 'react';
import { X, Send, FileText } from 'lucide-react';

export default function ApplyModal({ jobTitle, onConfirm, onClose, loading }) {

  const [coverLetter, setCoverLetter] = useState('');
  const charLimit = 2000;

  const handleSubmit = () => {
    // coverLetter is optional — can submit with empty
    onConfirm(coverLetter.trim());
  };

  return (
    // Backdrop — clicking outside closes modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      {/* Modal box — clicking inside does NOT close */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-sora font-bold text-xl text-gray-900">
              Apply for this Job
            </h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
              <FileText size={13} />
              {jobTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cover letter textarea */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Letter
            <span className="font-normal text-gray-400 ml-1">(optional)</span>
          </label>
          <textarea
            rows={6}
            value={coverLetter}
            onChange={(e) => {
              if (e.target.value.length <= charLimit) {
                setCoverLetter(e.target.value);
              }
            }}
            placeholder="Tell the company why you're a great fit for this role..."
            className="
              w-full border border-gray-200 rounded-xl
              px-4 py-3 text-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-green-500
              placeholder:text-gray-400 resize-none
            "
          />
          {/* Character counter */}
          <p className="text-xs text-gray-400 mt-1 text-right">
            {coverLetter.length}/{charLimit}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              flex-1 border border-gray-200 text-gray-600
              font-semibold py-3 rounded-xl text-sm
              hover:bg-gray-50 transition disabled:opacity-50
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              flex-1 bg-green-600 hover:bg-green-700
              text-white font-semibold
              py-3 rounded-xl text-sm
              flex items-center justify-center gap-2
              transition disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <Send size={15} />
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>

      </div>
    </div>
  );
}