import { API } from '../../../services/authService';
import toast from 'react-hot-toast';

export default function SingleResumeSection({
  profile,
  isCandidate,
  onProfileRefresh,
}) {
  if (!isCandidate) return null;

  const resume = profile?.resume;

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
    if (!confirm('Delete your resume?')) return;

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
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          Resume
        </h3>
      </div>

      {resume?.url ? (
        <>
          <a
            href={resume.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {resume.originalName || 'View Resume'}
          </a>

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
              onClick={handleDelete}
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
  );
}
