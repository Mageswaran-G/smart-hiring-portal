import { useState } from 'react';
import { API } from '../../../services/authService';
import toast from 'react-hot-toast';
import ConfirmModal from '../../ui/ConfirmModal';
import { FileText } from 'lucide-react';

export default function SingleResumeSection({
  profile,
  isCandidate,
  onProfileRefresh,
}) {
  if (!isCandidate) return null;

  const resume = profile?.resume;

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
  });


  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('resume', file);

      await API.post('/users/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resume uploaded successfully');

      if (onProfileRefresh) {
        await onProfileRefresh();
      }

    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to upload resume'
      );
    }

    e.target.value = '';
  };

  const handleDelete = async () => {
    setConfirmModal({ isOpen: false });

    try {
      await API.delete('/users/resume');

      toast.success('Resume deleted');

      if (onProfileRefresh) {
        await onProfileRefresh();
      }

    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to delete resume'
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Resume
          </h3>

          <p className="text-sm text-gray-500">
            Upload and manage your latest resume.
          </p>
        </div>
      </div>

      {resume?.url ? (
        <>
          <div className="rounded-xl border bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">
                  {resume.originalName || 'Resume.pdf'}
                </p>

                <p className="text-sm text-gray-500">
                  PDF / DOC Resume
                </p>
              </div>

              <a
                href={resume.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-100"
              >
                View
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            <label className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer">
              Replace Resume
              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
              />
            </label>

            <button
              onClick={() => setConfirmModal({ isOpen: true })}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              Delete Resume
            </button>
          </div>
        </>
      ) : (
        <label className="inline-block px-4 py-2 rounded bg-blue-600 text-white cursor-pointer">
          Upload Resume
          <input
            hidden
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
          />
        </label>
      )}
      </div>

      <ConfirmModal
      isOpen={confirmModal.isOpen}
      title="Delete Resume"
      message="Are you sure you want to delete your resume? This action cannot be undone."
      confirmText="Delete"
      confirmVariant="danger"
      onConfirm={handleDelete}
      onCancel={() => setConfirmModal({ isOpen: false })}
      />
    </>
  );
}
