import { useState } from 'react';
import { X, Calendar, Link, MapPin, FileText } from 'lucide-react';
import { scheduleInterview } from '../../../../services/interviewService';
import toast from 'react-hot-toast';

export default function ScheduleInterviewModal({ app, onClose, onSuccess }) {
  const [form, setForm] = useState({
    scheduledAt: '',
    mode: 'online',
    meetingLink: '',
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.scheduledAt) { toast.error('Please select interview date and time'); return; }
    if (form.mode === 'online' && !form.meetingLink) { toast.error('Please provide meeting link for online interview'); return; }
    if (form.mode === 'in-person' && !form.location) { toast.error('Please provide location for in-person interview'); return; }

    setLoading(true);
    try {
      await scheduleInterview({
        applicationId: app._id,
        scheduledAt:   form.scheduledAt,
        mode:          form.mode,
        meetingLink:   form.meetingLink,
        location:      form.location,
        notes:         form.notes,
      });
      toast.success('Interview scheduled successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', margin: 0 }}>Schedule Interview</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{app.candidate?.name} — {app.job?.title}</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Date Time */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Date and Time</label>
            <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: '#fff' }} />
          </div>

          {/* Mode */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Interview Mode</label>
            <select name="mode" value={form.mode} onChange={handleChange}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box', color: '#1e293b' }}>
              <option value="online">Online</option>
              <option value="in-person">In Person</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* Meeting Link — online only */}
          {form.mode === 'online' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Meeting Link</label>
              <input type="url" name="meetingLink" value={form.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/..."
                style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: '#fff' }} />
            </div>
          )}

          {/* Location — in-person only */}
          {form.mode === 'in-person' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Office address..."
                style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: '#fff' }} />
            </div>
          )}

          {/* Notes */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any instructions for the candidate..." rows={3}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: '#1e293b', background: '#fff' }} />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 10, background: loading ? '#94a3b8' : '#2563eb', fontSize: 13, fontWeight: 700, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
