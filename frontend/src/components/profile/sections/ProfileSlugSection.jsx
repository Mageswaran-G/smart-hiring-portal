import { useState, useEffect } from 'react';
import { Link2, Check, X, Loader } from 'lucide-react';
import { getTheme } from '../../../utils/theme';
import { API } from '../../../services/authService';

const SLUG_REGEX = /^[a-z0-9-]{3,50}$/;

export default function ProfileSlugSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');

  const [editing,   setEditing]   = useState(false);
  const [slug,      setSlug]      = useState(profile?.profileSlug || '');
  const [checking,  setChecking]  = useState(false);
  const [available, setAvailable] = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  const baseUrl = window.location.origin;
  const currentSlug = profile?.profileSlug;

  // Format slug — lowercase, replace spaces with hyphens
  const formatSlug = (value) => {
    return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Check availability after user stops typing for 700ms
  useEffect(() => {
    if (!editing) return;
    if (!slug || slug === currentSlug) { setAvailable(null); return; }
    if (!SLUG_REGEX.test(slug)) { setAvailable(null); return; }

    const timer = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await API.get(`/public/check-slug/${slug}`);
        setAvailable(res.data.available);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [slug, editing, currentSlug]);

  const handleChange = (e) => {
    const formatted = formatSlug(e.target.value);
    setSlug(formatted);
    setError('');
    setAvailable(null);
  };

  const handleSave = async () => {
    if (!slug.trim()) { setError('Please enter a URL slug.'); return; }
    if (!SLUG_REGEX.test(slug)) {
      setError('Only lowercase letters, numbers and hyphens allowed. Min 3 characters.');
      return;
    }
    if (available === false) { setError('This URL is already taken. Try another.'); return; }

    setSaving(true);
    await onSave({ profileSlug: slug });
    setSaving(false);
    setEditing(false);
    setAvailable(null);
  };

  const handleCancel = () => {
    setSlug(profile?.profileSlug || '');
    setEditing(false);
    setError('');
    setAvailable(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-sora font-bold text-gray-900 text-lg">Public Profile URL</h2>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            {currentSlug ? 'Change' : 'Set URL'}
          </button>
        )}
      </div>

      {!editing ? (
        <div>
          {currentSlug ? (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1 uppercase font-semibold tracking-wide">
                Your Public Profile Link
              </p>
              <div className="flex items-center gap-2">
                <Link2 size={14} className="text-gray-400 shrink-0" />
                <a
                  href={`${baseUrl}/p/${currentSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium truncate"
                  style={{ color: theme.primary }}>
                  {baseUrl}/p/{currentSlug}
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Anyone can view your profile using this link — no login required.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-400">No public URL set yet.</p>
              <p className="text-xs text-gray-300 mt-1">
                Set a custom URL so recruiters can find you easily.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-400 mb-3">
            Choose a unique URL for your public profile. Only lowercase letters, numbers and hyphens.
          </p>

          <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden mb-2">
            <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-400 whitespace-nowrap border-r border-gray-200">
              {baseUrl}/p/
            </span>
            <input
              value={slug}
              onChange={handleChange}
              placeholder="your-name"
              maxLength={50}
              className="flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none bg-white"
            />
            <div className="px-3 py-2.5">
              {checking && <Loader size={14} className="text-gray-400 animate-spin" />}
              {!checking && available === true  && <Check size={14} className="text-green-500" />}
              {!checking && available === false && <X    size={14} className="text-red-400"   />}
            </div>
          </div>

          {available === true  && <p className="text-xs text-green-600 mb-2">This URL is available.</p>}
          {available === false && <p className="text-xs text-red-500 mb-2">This URL is already taken.</p>}
          {error               && <p className="text-xs text-red-500 mb-2">{error}</p>}

          <div className="flex gap-2 justify-end mt-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || available === false || checking}
              className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {saving ? 'Saving...' : 'Save URL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
