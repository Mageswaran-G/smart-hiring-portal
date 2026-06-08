import { useEffect, useState } from 'react';
import { Calendar, Video, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import SafeAvatar from '../../components/ui/SafeAvatar';
import { getCompanyInterviews, updateInterviewStatus } from '../../services/interviewService';
import toast from 'react-hot-toast';

const MODE_ICON = { online: Video, 'in-person': MapPin, phone: Phone };

const STATUS_STYLE = {
  pending:   { bg: '#fef3c7', color: '#92400e', label: 'Pending'   },
  accepted:  { bg: '#dcfce7', color: '#166534', label: 'Accepted'  },
  rejected:  { bg: '#fee2e2', color: '#991b1b', label: 'Declined'  },
  completed: { bg: '#ede9fe', color: '#5b21b6', label: 'Completed' },
  cancelled: { bg: '#f1f5f9', color: '#475569', label: 'Cancelled' },
};

export default function CompanyInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [updating,   setUpdating]   = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCompanyInterviews();
        setInterviews(data);
      } catch {
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleComplete = async (id) => {
    setUpdating(id);
    try {
      await updateInterviewStatus(id, 'completed');
      setInterviews(prev => prev.map(i => i._id === id ? { ...i, status: 'completed' } : i));
      toast.success('Interview marked as completed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  const handleCancel = async (id) => {
    setUpdating(id);
    try {
      await updateInterviewStatus(id, 'cancelled');
      setInterviews(prev => prev.map(i => i._id === id ? { ...i, status: 'cancelled' } : i));
      toast.success('Interview cancelled');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageHeader title="Scheduled Interviews" subtitle="Manage all interviews you have scheduled" />

        {loading && (
          <div className="flex flex-col gap-4 mt-6">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        )}

        {!loading && interviews.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No interviews scheduled yet</p>
            <p className="text-sm mt-1">Shortlist candidates and schedule interviews from the Applications page</p>
          </div>
        )}

        {!loading && interviews.length > 0 && (
          <div className="flex flex-col gap-4 mt-6">
            {interviews.map(interview => {
              const ModeIcon = MODE_ICON[interview.mode] || Calendar;
              const style = STATUS_STYLE[interview.status] || STATUS_STYLE.pending;
              const isActive = ['pending', 'accepted'].includes(interview.status);

              return (
                <div key={interview._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <SafeAvatar
                        src={interview.candidate?.profilePhoto ? `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${interview.candidate.profilePhoto}` : ''}
                        name={interview.candidate?.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        fallbackClassName="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0"
                        textClassName="text-blue-700 font-bold text-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900">{interview.candidate?.name || 'Candidate'}</p>
                        <p className="text-sm text-gray-500">{interview.job?.title || 'Job'}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            {new Date(interview.scheduledAt).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <ModeIcon size={13} />{interview.mode}
                          </span>
                        </div>
                        {interview.meetingLink && (
                          <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-2">
                            <Video size={12} /> Join Meeting
                          </a>
                        )}
                        {interview.notes && (
                          <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg px-3 py-2">{interview.notes}</p>
                        )}
                      </div>
                    </div>
                    <span style={{ background: style.bg, color: style.color }}
                      className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                      {style.label}
                    </span>
                  </div>

                  {isActive && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button type="button" disabled={updating === interview._id}
                        onClick={() => handleComplete(interview._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition disabled:opacity-50">
                        <CheckCircle size={13} /> Mark Complete
                      </button>
                      <button type="button" disabled={updating === interview._id}
                        onClick={() => handleCancel(interview._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition disabled:opacity-50">
                        <XCircle size={13} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
