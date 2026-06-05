import { useEffect, useState } from 'react';
import { Calendar, Video, MapPin, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import { getMyInterviews, updateInterviewStatus } from '../../services/interviewService';
import toast from 'react-hot-toast';

const MODE_ICON = { online: Video, 'in-person': MapPin, phone: Phone };

const STATUS_STYLE = {
  pending:   { bg: '#fef3c7', color: '#92400e', label: 'Pending'   },
  accepted:  { bg: '#dcfce7', color: '#166534', label: 'Accepted'  },
  rejected:  { bg: '#fee2e2', color: '#991b1b', label: 'Declined'  },
  completed: { bg: '#ede9fe', color: '#5b21b6', label: 'Completed' },
  cancelled: { bg: '#f1f5f9', color: '#475569', label: 'Cancelled' },
};

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [updating,   setUpdating]   = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyInterviews();
        setInterviews(data);
      } catch {
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateInterviewStatus(id, status);
      setInterviews(prev => prev.map(i => i._id === id ? { ...i, status } : i));
      toast.success(`Interview ${status}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <PageHeader title="My Interviews" subtitle="View and manage your scheduled interviews" />

        {loading && (
          <div className="flex flex-col gap-4 mt-6">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        )}

        {!loading && interviews.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No interviews scheduled yet</p>
          </div>
        )}

        {!loading && interviews.length > 0 && (
          <div className="flex flex-col gap-4 mt-6">
            {interviews.map(interview => {
              const ModeIcon = MODE_ICON[interview.mode] || Calendar;
              const style = STATUS_STYLE[interview.status] || STATUS_STYLE.pending;
              const isPending = interview.status === 'pending';

              return (
                <div key={interview._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{interview.job?.title || 'Job'}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{interview.company?.companyName || 'Company'}</p>

                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {new Date(interview.scheduledAt).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ModeIcon size={13} />
                          {interview.mode}
                        </span>
                      </div>

                      {interview.meetingLink && (
                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mt-2">
                          <Video size={12} /> Join Meeting
                        </a>
                      )}
                      {interview.location && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <MapPin size={12} />{interview.location}
                        </p>
                      )}
                      {interview.notes && (
                        <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg px-3 py-2">{interview.notes}</p>
                      )}
                    </div>

                    <span style={{ background: style.bg, color: style.color }}
                      className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                      {style.label}
                    </span>
                  </div>

                  {isPending && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button type="button" disabled={updating === interview._id}
                        onClick={() => handleStatus(interview._id, 'accepted')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition disabled:opacity-50">
                        <CheckCircle size={13} /> Accept
                      </button>
                      <button type="button" disabled={updating === interview._id}
                        onClick={() => handleStatus(interview._id, 'rejected')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition disabled:opacity-50">
                        <XCircle size={13} /> Decline
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
