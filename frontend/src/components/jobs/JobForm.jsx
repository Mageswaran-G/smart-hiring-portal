// JobForm.jsx
// Reusable form for both Create and Edit job
// mode="create" or mode="edit"

import { useState } from 'react';
import Button from '../ui/Button';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '../../constants/jobConstants';

// Empty form — default values
const emptyForm = {
  title: '',
  description: '',
  location: '',
  jobType: '',
  workMode: '',
  experienceLevel: 'fresher',
  openings: 1,
  status: 'draft',
  skillsRequired: '',       // comma-separated string in UI
  requirements: '',         // comma-separated string in UI
  responsibilities: '',     // comma-separated string in UI
  benefits: '',             // comma-separated string in UI
  salary: {
    min: '',
    max: '',
    isDisclosed: false,
    currency: 'INR',
  },
  deadline: '',
};

export default function JobForm({ mode = 'create', initialData = null, onSubmit, loading }) {

  // If edit mode, fill form with existing data
  const [form, setForm] = useState(() => {
    if (mode === 'edit' && initialData) {
      return {
        ...emptyForm,
        ...initialData,
        // Convert arrays to comma-separated strings for editing
        skillsRequired: initialData.skillsRequired?.join(', ') || '',
        requirements: initialData.requirements?.join(', ') || '',
        responsibilities: initialData.responsibilities?.join(', ') || '',
        benefits: initialData.benefits?.join(', ') || '',
        // Format deadline for date input
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split('T')[0]
          : '',
        salary: {
          min: initialData.salary?.min || '',
          max: initialData.salary?.max || '',
          isDisclosed: initialData.salary?.isDisclosed || false,
          currency: initialData.salary?.currency || 'INR',
        },
      };
    }
    return emptyForm;
  });

  const [errors, setErrors] = useState([]);

  // Handle normal field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle salary field change
  const handleSalaryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [name]: type === 'checkbox' ? checked : value,
      }
    }));
  };

  // Convert comma string to array, clean up
  const toArray = (str) =>
    str.split(',').map(s => s.trim()).filter(Boolean);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    // Basic frontend validation
    const errs = [];
    if (!form.title.trim()) errs.push('Title is required');
    if (!form.description.trim()) errs.push('Description is required');
    if (!form.location.trim()) errs.push('Location is required');
    if (!form.jobType) errs.push('Job type is required');
    if (!form.workMode) errs.push('Work mode is required');

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    // Build final data object to send to API
    const finalData = {
      title:            form.title.trim(),
      description:      form.description.trim(),
      location:         form.location.trim(),
      jobType:          form.jobType,
      workMode:         form.workMode,
      experienceLevel:  form.experienceLevel,
      openings:         Number(form.openings) || 1,
      status:           form.status,
      skillsRequired:   toArray(form.skillsRequired),
      requirements:     toArray(form.requirements),
      responsibilities: toArray(form.responsibilities),
      benefits:         toArray(form.benefits),
      salary: {
        min:         Number(form.salary.min) || 0,
        max:         Number(form.salary.max) || 0,
        isDisclosed: form.salary.isDisclosed,
        currency:    form.salary.currency,
      },
    };

    // Only add deadline if provided
    if (form.deadline) finalData.deadline = form.deadline;

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 font-semibold text-sm mb-1">Please fix these errors:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, i) => (
              <li key={i} className="text-red-500 text-sm">{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Row 1 — Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. React Developer Intern"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Row 2 — Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe the role, what they will do..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Row 3 — Location + Job Type + Work Mode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Chennai"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select type</option>
            {JOB_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Work Mode <span className="text-red-500">*</span>
          </label>
          <select
            name="workMode"
            value={form.workMode}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select mode</option>
            {WORK_MODES.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4 — Experience + Openings + Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {EXPERIENCE_LEVELS.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Openings
          </label>
          <input
            type="number"
            name="openings"
            value={form.openings}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Row 5 — Salary */}
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Salary / Stipend (INR)
        </label>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Minimum</label>
            <input
              type="number"
              name="min"
              value={form.salary.min}
              onChange={handleSalaryChange}
              placeholder="e.g. 5000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Maximum</label>
            <input
              type="number"
              name="max"
              value={form.salary.max}
              onChange={handleSalaryChange}
              placeholder="e.g. 10000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            name="isDisclosed"
            checked={form.salary.isDisclosed}
            onChange={handleSalaryChange}
            className="rounded"
          />
          Show salary to candidates
        </label>
      </div>

      {/* Row 6 — Skills + Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Skills Required
          </label>
          <input
            type="text"
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB (comma separated)"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Application Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Row 7 — Requirements */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Requirements
        </label>
        <textarea
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          rows={3}
          placeholder="Bachelor's degree in CS, 1+ year experience (comma separated)"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Row 8 — Responsibilities */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Responsibilities
        </label>
        <textarea
          name="responsibilities"
          value={form.responsibilities}
          onChange={handleChange}
          rows={3}
          placeholder="Build React components, Write APIs (comma separated)"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Row 9 — Benefits */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Benefits
        </label>
        <input
          type="text"
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          placeholder="Health insurance, Work from home, Flexible hours"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit button */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading
            ? 'Saving...'
            : mode === 'create' ? 'Post Job' : 'Save Changes'
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>

    </form>
  );
}