import { COLORS } from '../../theme/adminTheme';
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Search, ChevronLeft, ChevronRight, XCircle, CheckCircle, Clock } from "lucide-react";
import { getAllJobs, closeJob, deleteJob  } from "../../services/adminService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import PageContainer from '../../components/ui/PageContainer';
import FilterTabs from '../../components/ui/FilterTabs';
import DataTable from '../../components/ui/DataTable';

const ITEMS_PER_PAGE = 10;
const C = { purple: COLORS.primary, purpleLight: "#ede9fe" };

export default function AdminJobsPage() {
  
  
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [page, setPage]       = useState(1);
  
  
  
  const queryClient = useQueryClient();

  const { data: res, isLoading: loading } = useQuery({
    queryKey: ['adminJobs', search, filter, page],
    queryFn:  () => getAllJobs({ search, filter, page, limit: ITEMS_PER_PAGE }),
  });

  const jobs  = res?.data?.jobs  || [];
  const total = res?.data?.total || 0;
  const stats = res?.data?.stats || { active: 0, closed: 0, expired: 0 };

  useEffect(() => { setPage(1); }, [search, filter]);

  const handleClose = async (id) => {
    try {
      await closeJob(id);
      toast.success("Job closed successfully");
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    } catch {
      toast.error('Delete failed');
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const statusBadge = (job) => {
    if (job.status === 'expired')
      return { label: 'Expired', bg: COLORS.warningBg, color: COLORS.warningText };
    if (job.status === 'closed')
      return { label: 'Closed',  bg: COLORS.dangerBg, color: COLORS.dangerText };
    return { label: 'Active', bg: '#dcfce7', color: '#16a34a' };
  };

  return (
    <DashboardLayout>
      <PageContainer>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
            Jobs Moderation
          </h1>
          <p style={{ color: COLORS.gray500, marginTop: 4, fontSize: 14 }}>
            Monitor, close, and moderate all jobs on the platform
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Jobs", value: total,          color: C.purple  },
            { label: "Active",     value: stats.active,   color: COLORS.successText },
            { label: "Closed",     value: stats.closed,   color: COLORS.dangerText },
            { label: "Expired",    value: stats.expired,  color: COLORS.warningText },
          ].map(stat => (
            <div key={stat.label} style={{ background: "white", borderRadius: 12,
              padding: "16px 20px", border: `1px solid ${COLORS.gray100}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ background: "white", borderRadius: 12, padding: "16px 20px",
          border: `1px solid ${COLORS.gray100}`, marginBottom: 16,
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%",
              transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search by job title or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", paddingLeft: 36, paddingRight: 12,
                paddingTop: 8, paddingBottom: 8, border: `1px solid ${COLORS.gray200}`,
                borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <FilterTabs
            tabs={["all", "active", "closed", "expired"]}
            active={filter}
            onChange={setFilter}
          />
        </div>

        {/* Table */}
        <DataTable
          columns={[
            { key: "job",     label: "Job",     width: "2.5fr" },
            { key: "company", label: "Company", width: "1.5fr" },
            { key: "type",    label: "Type",    width: "1fr"   },
            { key: "status",  label: "Status",  width: "1fr"   },
            { key: "action",  label: "Action",  width: "1fr"   },
          ]}
          rows={jobs}
          loading={loading}
          emptyIcon={<Briefcase size={40} />}
          emptyTitle="No jobs found"
          emptySubtitle="No jobs match your current filter"
          
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          renderRow={(job) => [
            /* Job Title */
            <div key="job">
              <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray900 }}>
                {job.title}
              </div>
              <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 2 }}>
                {job.location || "Remote"} · Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>,

            /* Company */
            <div key="company" style={{ fontSize: 13, color: COLORS.gray700 }}>
              {job.postedBy?.companyName || job.postedBy?.name || "—"}
            </div>,

            /* Type */
            <div key="type">
              <Badge variant="primary">{job.jobType || "Full-time"}</Badge>
            </div>,

            /* Status */
            <div key="status">
              {(() => {
                const badge = statusBadge(job);
                return (
                  <span style={{ background: badge.bg, color: badge.color,
                    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {badge.label}
                  </span>
                );
              })()}
            </div>,

            /* Action */
            <div key="action" style={{ display: "flex", gap: 6 }}>
              {job.isActive && (
                <button onClick={() => handleClose(job._id)} style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: "pointer", border: "none",
                  background: COLORS.dangerBg, color: COLORS.dangerText,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <XCircle size={12} /> Close
                </button>
              )}
              <Button variant="danger" size="sm" onClick={() => handleDeleteJob(job._id)}>
                Delete
              </Button>
            </div>,
          ]}
        />

        
      </PageContainer>
    </DashboardLayout>
  );
}