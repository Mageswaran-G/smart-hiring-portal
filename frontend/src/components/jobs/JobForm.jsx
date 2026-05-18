// JobForm.jsx
// Reusable form for both Create and Edit job
// mode="create" or mode="edit"
// Production-grade: inline field-level validation with red borders + error messages

import { useState } from 'react';
import Button from '../ui/Button';
import { JOB_TYPES, WORK_MODES, EXPERIENCE_LEVELS } from '../../constants/jobConstants';
import RichTextEditor from '../ui/RichTextEditor';

// ─── Empty form default values ────────────────────────────────
const emptyForm = {
  title:            '',
  description:      '',
  location:         '',
  jobType:          '',
  workMode:         '',
  experienceLevel:  'fresher',
  openings:         1,
  status:           'draft',
  skillsRequired:   '',
  requirements:     '',
  responsibilities: '',
  benefits:         '',
  salary: {
    min:         '',
    max:         '',
    isDisclosed: false,
    currency:    'INR',
  },
  deadline: '',
};

// ─── Helper: strip HTML tags from rich text ───────────────────
// RichTextEditor stores HTML like <p>Hello</p>
// We need plain text length to validate description
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// ─── Helper: today's date as YYYY-MM-DD string ───────────────
// Used to check if deadline is in the past
const todayStr = () => new Date().toISOString().split('T')[0];

// ─── Main component ───────────────────────────────────────────
export default function JobForm({ mode = 'create', initialData = null, onSubmit, loading }) {

  // ── Form state ──────────────────────────────────────────────
  const [form, setForm] = useState(() => {
    if (mode === 'edit' && initialData) {
      return {
        ...emptyForm,
        ...initialData,
        skillsRequired:   initialData.skillsRequired?.join(', ')   || '',
        requirements:     initialData.requirements?.join(', ')     || '',
        responsibilities: initialData.responsibilities?.join(', ') || '',
        benefits:         initialData.benefits?.join(', ')         || '',
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split('T')[0]
          : '',
        salary: {
          min:         initialData.salary?.min         || '',
          max:         initialData.salary?.max         || '',
          isDisclosed: initialData.salary?.isDisclosed || false,
          currency:    initialData.salary?.currency    || 'INR',
        },
      };
    }
    return emptyForm;
  });

  // ── Field errors state ──────────────────────────────────────
  // Each key = field name, value = error message string
  // Example: { title: 'Title is required', deadline: 'Must be a future date' }
  // Empty string '' means no error for that field
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Clear one field's error when user starts typing ─────────
  const clearError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  // ── Handle normal field change ───────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearError(name);  // clear error for this field as user types
  };

  // ── Handle salary field change ───────────────────────────────
  const handleSalaryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [name]: type === 'checkbox' ? checked : value,
      }
    }));
    // Clear salary errors when user changes either salary field
    clearError('salaryMin');
    clearError('salaryMax');
  };

  // ── Handle description change (from RichTextEditor) ──────────
  const handleDescriptionChange = (html) => {
    setForm(prev => ({ ...prev, description: html }));
    clearError('description');
  };

  // ── Convert comma-separated string to array ──────────────────
  const toArray = (str) =>
    str.split(',').map(s => s.trim()).filter(Boolean);

  // ─────────────────────────────────────────────────────────────
  // VALIDATE function
  // Checks all fields. Returns errors object.
  // Empty object {} means no errors — form is valid.
  //
  // Simple explanation:
  //   We check each rule one by one.
  //   If a rule fails, we add an error message for that field.
  //   At the end, if errs is empty = all good.
  //   If errs has any key = something is wrong.
  // ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    // ── Title ──────────────────────────────────────────────────
    if (!form.title.trim()) {
      errs.title = 'Job title is required';
    } else if (form.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    } else if (form.title.trim().length > 100) {
      errs.title = 'Title must be less than 100 characters';
    }

    // ── Description ────────────────────────────────────────────
    // Strip HTML tags first — only count visible text
    const descText = stripHtml(form.description);
    if (!descText) {
      errs.description = 'Job description is required';
    } else if (descText.length < 20) {
      errs.description = 'Description must be at least 20 characters';
    }

    // ── Location ───────────────────────────────────────────────
    if (!form.location.trim()) {
      errs.location = 'Location is required';
    }

    // ── Job Type ───────────────────────────────────────────────
    if (!form.jobType) {
      errs.jobType = 'Please select a job type';
    }

    // ── Work Mode ──────────────────────────────────────────────
    if (!form.workMode) {
      errs.workMode = 'Please select a work mode';
    }

    // ── Openings ───────────────────────────────────────────────
    const openingsNum = Number(form.openings);
    if (!form.openings || openingsNum < 1) {
      errs.openings = 'At least 1 opening is required';
    } else if (openingsNum > 100) {
      errs.openings = 'Cannot have more than 100 openings';
    }

    // ── Salary ─────────────────────────────────────────────────
    // Only validate if user entered a salary value
    const salMin = Number(form.salary.min);
    const salMax = Number(form.salary.max);

    if (form.salary.min !== '' && salMin < 0) {
      errs.salaryMin = 'Minimum salary cannot be negative';
    }
    if (form.salary.max !== '' && salMax < 0) {
      errs.salaryMax = 'Maximum salary cannot be negative';
    }
    if (form.salary.min !== '' && form.salary.max !== '' && salMin > salMax) {
      // Both entered but min is more than max — that is wrong
      errs.salaryMin = 'Minimum salary cannot be more than maximum';
    }

    // ── Deadline ───────────────────────────────────────────────
    // Only validate if user entered a deadline
    if (form.deadline) {
      const today = todayStr();
      if (form.deadline < today) {
        // Deadline is in the past — that makes no sense
        errs.deadline = 'Deadline cannot be in the past';
      }
    }

    return errs;
  };

  // ─────────────────────────────────────────────────────────────
  // Handle form submit
  // ─────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    // Run all validation checks
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      // Errors found — show them on each field, stop submit
      setFieldErrors(errs);

      // Scroll to first error smoothly
      // Small delay so React renders errors first
      setTimeout(() => {
        const firstError = document.querySelector('.field-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);

      return; // stop here — do not call onSubmit
    }

    // No errors — clear any old errors and submit
    setFieldErrors({});

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

    if (form.deadline) finalData.deadline = form.deadline;

    onSubmit(finalData);
  };

  // ─────────────────────────────────────────────────────────────
  // Helper: get input class
  // Adds red border when that field has an error
  // ─────────────────────────────────────────────────────────────
  const inputClass = (fieldName) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
      fieldErrors[fieldName]
        ? 'border-red-400 focus:ring-red-300 bg-red-50'   // ← red when error
        : 'border-gray-200 focus:ring-blue-500'            // ← normal
    }`;

  const selectClass = (fieldName) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white ${
      fieldErrors[fieldName]
        ? 'border-red-400 focus:ring-red-300 bg-red-50'
        : 'border-gray-200 focus:ring-blue-500'
    }`;

  // ─────────────────────────────────────────────────────────────
  // Helper: show error message below a field
  // Only shows when that field has an error
  // ─────────────────────────────────────────────────────────────
  const ErrorMsg = ({ field }) =>
    fieldErrors[field] ? (
      <p className="field-error text-red-500 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span> {fieldErrors[field]}
      </p>
    ) : null;

  // ─────────────────────────────────────────────────────────────
  // COUNT how many errors exist (for submit button hint)
  // ─────────────────────────────────────────────────────────────
  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Summary banner — shows when form was submitted with errors ── */}
      {errorCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
          <div>
            <p className="text-red-700 font-semibold text-sm">
              Please fix {errorCount} error{errorCount > 1 ? 's' : ''} before submitting
            </p>
            <p className="text-red-500 text-xs mt-0.5">
              Fields with errors are highlighted in red below
            </p>
          </div>
        </div>
      )}

      {/* ── Row 1: Job Title ── */}
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
          className={inputClass('title')}
        />
        {/* Inline error message for this field */}
        <ErrorMsg field="title" />
        {/* Character count hint — shown when no error */}
        {!fieldErrors.title && form.title.length > 0 && (
          <p className="text-xs text-gray-400 mt-1 text-right">
            {form.title.length}/100
          </p>
        )}
      </div>

      {/* ── Row 2: Description ── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        {/* Red border wrapper when description has error */}
        <div className={`rounded-xl overflow-hidden ${
          fieldErrors.description ? 'ring-2 ring-red-400' : ''
        }`}>
          <RichTextEditor
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="Describe the role, responsibilities and what you are looking for..."
          />
        </div>
        <ErrorMsg field="description" />
        {!fieldErrors.description && stripHtml(form.description).length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {stripHtml(form.description).length} characters
          </p>
        )}
      </div>

      {/* ── Row 3: Location + Job Type + Work Mode ── */}
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
            className={inputClass('location')}
          />
          <ErrorMsg field="location" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className={selectClass('jobType')}
          >
            <option value="">Select type</option>
            {JOB_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <ErrorMsg field="jobType" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Work Mode <span className="text-red-500">*</span>
          </label>
          <select
            name="workMode"
            value={form.workMode}
            onChange={handleChange}
            className={selectClass('workMode')}
          >
            <option value="">Select mode</option>
            {WORK_MODES.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <ErrorMsg field="workMode" />
        </div>
      </div>

      {/* ── Row 4: Experience + Openings + Status ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            className={selectClass('experienceLevel')}
          >
            {EXPERIENCE_LEVELS.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Openings <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="openings"
            value={form.openings}
            onChange={handleChange}
            min="1"
            max="100"
            className={inputClass('openings')}
          />
          <ErrorMsg field="openings" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={selectClass('status')}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* ── Row 5: Salary ── */}
      <div className="bg-gray-50 rounded-xl p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Salary / Stipend (INR)
          <span className="text-gray-400 font-normal ml-1">— optional</span>
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
              min="0"
              className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white ${
                fieldErrors.salaryMin
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            />
            <ErrorMsg field="salaryMin" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Maximum</label>
            <input
              type="number"
              name="max"
              value={form.salary.max}
              onChange={handleSalaryChange}
              placeholder="e.g. 10000"
              min="0"
              className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white ${
                fieldErrors.salaryMax
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            />
            <ErrorMsg field="salaryMax" />
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

      {/* ── Row 6: Skills + Deadline ── */}
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
            className={inputClass('skillsRequired')}
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
            min={todayStr()}  /* ← prevents selecting past dates from calendar */
            className={inputClass('deadline')}
          />
          <ErrorMsg field="deadline" />
          {!fieldErrors.deadline && (
            <p className="text-xs text-gray-400 mt-1">Leave empty for no deadline</p>
          )}
        </div>
      </div>

      {/* ── Row 7: Requirements ── */}
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
          className={`${inputClass('requirements')} resize-none`}
        />
      </div>

      {/* ── Row 8: Responsibilities ── */}
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
          className={`${inputClass('responsibilities')} resize-none`}
        />
      </div>

      {/* ── Row 9: Benefits ── */}
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
          className={inputClass('benefits')}
        />
      </div>

      {/* ── Submit buttons ── */}
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