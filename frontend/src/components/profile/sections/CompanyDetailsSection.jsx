import { useState } from 'react';
import { getTheme } from '../../../utils/theme';

export default function CompanyDetailsSection({ profile, onSave }) {
  const theme = getTheme('company');
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    companyName:        profile?.companyName        || '',
    companyWebsite:     profile?.companyWebsite     || '',
    industry:           profile?.industry           || '',
    companySize:        profile?.companySize        || '',
    foundedYear:        profile?.foundedYear        || '',
    companyCity:        profile?.companyCity        || '',
    companyState:       profile?.companyState       || '',
    companyCountry:     profile?.companyCountry     || '',
    companyDescription: profile?.companyDescription || '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Block keys that are not numbers (for number-only fields)
  const allowNumbersOnly = e => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowed.includes(e.key)) return; // allow control keys
    if (!/^\d$/.test(e.key)) e.preventDefault(); // block anything not a digit
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setEditing(false);
  };

  const inputClass = `w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none ${theme.focus}`;

  // ✅ Field config — added type and onKeyDown for number fields
  const fields = [
    { label: 'Company Name',  name: 'companyName',    placeholder: 'Your company name' },
    { label: 'Website',       name: 'companyWebsite', placeholder: 'https://yourcompany.com' },
    { label: 'Industry',      name: 'industry',       placeholder: 'e.g. Software' },
    { label: 'Company Size',  name: 'companySize',    placeholder: 'e.g. 10-50 employees' },
    {
      label: 'Founded Year',
      name: 'foundedYear',
      placeholder: 'e.g. 2020',
      type: 'number',           // ✅ number input type
      onKeyDown: allowNumbersOnly, // ✅ block letters
    },
    { label: 'City',    name: 'companyCity',    placeholder: 'e.g. Chennai' },
    { label: 'State',   name: 'companyState',   placeholder: 'e.g. Tamil Nadu' },
    { label: 'Country', name: 'companyCountry', placeholder: 'e.g. India' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">Company Details</h2>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Company Name',  value: profile?.companyName },
            { label: 'Website',       value: profile?.companyWebsite },
            { label: 'Industry',      value: profile?.industry },
            { label: 'Company Size',  value: profile?.companySize },
            { label: 'Founded Year',  value: profile?.foundedYear },
            { label: 'City',          value: profile?.companyCity },
            { label: 'State',         value: profile?.companyState },
            { label: 'Country',       value: profile?.companyCountry },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
              <p
  className={`text-sm text-gray-800 mt-0.5 ${
    label === 'Website' ? 'break-all' : ''
  }`}
>
  {value || <em className="text-gray-300">Not set</em>}
</p>
            </div>
          ))}
          <div className="col-span-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">About Company</p>
            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
              {profile?.companyDescription || <em className="text-gray-300">Not set</em>}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {fields.map(({ label, name, placeholder, type = 'text', onKeyDown }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                type={type}
                onKeyDown={onKeyDown}
                //  Hide the number up/down arrows (spinner)
                className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">About Company</label>
            <textarea name="companyDescription" value={form.companyDescription} onChange={handleChange}
              rows={3} placeholder="Describe your company..." className={`${inputClass} resize-y`} />
          </div>
          <div className="col-span-2 flex gap-2 justify-end mt-2">
            <button onClick={() => setEditing(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
