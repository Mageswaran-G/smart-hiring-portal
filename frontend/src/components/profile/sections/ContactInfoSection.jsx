import { useState } from 'react';
import { Eye, EyeOff, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { getTheme } from '../../../utils/theme';
import useAutoSave from '../../../hooks/useAutoSave';

// ContactInfoSection — phone, email, location, website
// Each field has its own visibility toggle (public or private)

export default function ContactInfoSection({ profile, isCandidate, onSave }) {
  const theme = getTheme(isCandidate ? 'candidate' : 'company');

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    phone:              profile?.phone              || '',
    city:               profile?.city               || '',
    state:              profile?.state              || '',
    country:            profile?.country            || '',
    portfolio:          profile?.portfolio          || '',
    contactVisibility:  profile?.contactVisibility  || 'public',
  });

  const { hasDraft, getDraft, clearDraft, savedAt } = useAutoSave(
    'contact_info',
    form,
    editing
  );

  const handleOpenEdit = () => {
    setEditing(true);
    const draft = getDraft();
    if (draft) setForm(draft);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    clearDraft();
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      phone:             profile?.phone             || '',
      city:              profile?.city              || '',
      state:             profile?.state             || '',
      country:           profile?.country           || '',
      portfolio:         profile?.portfolio         || '',
      contactVisibility: profile?.contactVisibility || 'public',
    });
    clearDraft();
    setEditing(false);
  };

  const isPublic = form.contactVisibility === 'public';
  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-sora font-bold text-gray-900 text-lg">Contact Info</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isPublic ? 'Visible to recruiters' : 'Hidden from public'}
          </p>
        </div>

        {!editing && (
          <div className="flex items-center gap-2">
            {hasDraft && <span className="text-xs text-amber-500">Unsaved draft</span>}
            <button
              onClick={handleOpenEdit}
              className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
              Edit
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="flex flex-col gap-3">

          {/* Visibility badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit text-xs font-semibold ${
            isPublic
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-50 text-gray-500 border border-gray-200'
          }`}>
            {isPublic ? <Eye size={12} /> : <EyeOff size={12} />}
            {isPublic ? 'Contact info is public' : 'Contact info is private'}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-1">
            {[
              { icon: Phone,  label: 'Phone',    value: profile?.phone },
              { icon: Mail,   label: 'Email',    value: profile?.email },
              { icon: MapPin, label: 'Location', value: [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') },
              { icon: Globe,  label: 'Website',  value: profile?.portfolio },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-gray-800 mt-0.5 break-all">
                    {value || <em className="text-gray-300">Not set</em>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {hasDraft && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-xs text-amber-600 font-medium">Draft restored from previous session.</p>
            </div>
          )}

          {/* Visibility toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mb-1">
            <div>
              <p className="text-sm font-semibold text-gray-700">Contact Visibility</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isPublic ? 'Recruiters can see your contact info' : 'Contact info is hidden from public'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setForm({ ...form, contactVisibility: 'public' })}
                className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                  isPublic
                    ? 'bg-green-50 border-green-300 text-green-700 font-semibold'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}>
                <Eye size={11} />
                Public
              </button>
              <button
                onClick={() => setForm({ ...form, contactVisibility: 'private' })}
                className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                  !isPublic
                    ? 'bg-gray-100 border-gray-400 text-gray-700 font-semibold'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}>
                <EyeOff size={11} />
                Private
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className={inputClass} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Chennai" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">State</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="Tamil Nadu" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Country</label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="India" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Website / Portfolio</label>
            <input name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="https://yourwebsite.com" className={inputClass} />
          </div>

          <div className="flex items-center justify-between mt-2">
            {savedAt && (
              <p className="text-xs text-gray-300">
                Draft saved at {savedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={handleCancel} className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}