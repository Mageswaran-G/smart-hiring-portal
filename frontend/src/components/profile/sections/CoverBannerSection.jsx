import { useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { API } from '../../../services/authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CoverBannerSection({ profile, onProfileRefresh }) {
  const fileRef  = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing,  setRemoving]  = useState(false);
  const [error,     setError]     = useState('');

  const bannerUrl = profile?.coverBanner
    ? (profile.coverBanner.startsWith('http') ? profile.coverBanner : `${API_URL}${profile.coverBanner}`)
    : null;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('banner', file);
      await API.post('/users/upload-banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (onProfileRefresh) onProfileRefresh();
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await API.put('/users/profile', { coverBanner: '' });
      if (onProfileRefresh) onProfileRefresh();
    } catch {
      setError('Could not remove banner.');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative w-full h-40 bg-gradient-to-r from-blue-900 to-blue-700">
        {bannerUrl && (
          <img src={bannerUrl} alt="Cover banner"
            className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-800 text-sm font-semibold rounded-xl cursor-pointer border-none transition">
            <Camera size={15} />
            {uploading ? 'Uploading...' : bannerUrl ? 'Change Banner' : 'Add Banner'}
          </button>
          {bannerUrl && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white text-sm font-semibold rounded-xl cursor-pointer border-none transition">
              <Trash2 size={15} />
              {removing ? 'Removing...' : 'Remove'}
            </button>
          )}
        </div>
        {!bannerUrl && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 pointer-events-none">
            <Camera size={24} className="mb-1" />
            <p className="text-xs font-medium">Hover to add cover banner</p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 px-4 py-2">{error}</p>}
      <input type="file" ref={fileRef} onChange={handleUpload}
        accept=".jpg,.jpeg,.png,.webp" className="hidden" />
      <div className="px-4 py-2 border-t border-gray-50">
        <p className="text-xs text-gray-400">
          Recommended: 1200x300px · JPG, PNG, WEBP · Max 5MB
        </p>
      </div>
    </div>
  );
}
