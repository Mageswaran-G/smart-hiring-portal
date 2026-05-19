import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateApplicationStatus } from '../../../../services/applicationService';
import { STATUS, STATUS_OPTIONS } from './dashboardUtils';

export default function StatusDropdown({ appId, current, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const s = STATUS[current] || STATUS.applied;

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === current) return;

    setLoading(true);
    onUpdate(appId, newStatus);

    try {
      await updateApplicationStatus(appId, newStatus);
      toast.success('Application status updated');
    } catch (err) {
      onUpdate(appId, current);
      toast.error('Failed to update status');
      console.error('Status update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', outline: 'none', opacity: loading ? 0.6 : 1 }}
    >
      <option value="applied">Applied</option>
      {STATUS_OPTIONS.map(st => (
        <option key={st} value={st}>{STATUS[st].label}</option>
      ))}
    </select>
  );
}
