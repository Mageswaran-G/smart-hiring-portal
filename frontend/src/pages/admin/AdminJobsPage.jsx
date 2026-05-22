import { useState, useEffect, useCallback } from "react";
import { Briefcase, Search, ChevronLeft, ChevronRight, XCircle, CheckCircle, Clock } from "lucide-react";
import { getAllJobs, closeJob, deleteJob  } from "../../services/adminService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;
const C = { purple: "#7c3aed", purpleLight: "#ede9fe" };

export default function AdminJobsPage() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);
  const [refresh, setRefresh] = useState(0);
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllJobs({ search, filter, page, limit: ITEMS_PER_PAGE });
      setJobs(res.data?.jobs || []);
      setTotal(res.data?.total || 0);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs, refresh]);
  useEffect(() => { setPage(1); }, [search, filter]);

  const handleClose = async (id) => {
    try {
      await closeJob(id);
      toast.success("Job closed successfully");
      setRefresh(r => r + 1);
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      setRefresh(r => r + 1);
    } catch {
      toast.error('Delete failed');
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const statusBadge = (job) => {
    if (!job.isActive) return { label: "Closed", bg: "#fee2e2", color: "#dc2626" };
    if (job.deadline && new Date(job.deadline) < new Date())
      return { label: "Expired", bg: "#fef3c7", color: "#d97706" };
    return { label: "Active", bg: "#dcfce7", color: "#16a34a" };
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "16px 24px", maxWidth: 1200, margin: "0 auto",
        boxSizing: "border-box", width: "100%", overflowX: "hidden" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
            Jobs Moderation
          </h1>
          <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>
            Monitor, close, and moderate all jobs on the platform
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Jobs", value: total, color: C.purple },
            { label: "Active", value: jobs.filter(j => j.isActive && new Date(j.deadline) >= new Date()).length, color: "#059669" },
            { label: "Closed", value: jobs.filter(j => !j.isActive).length, color: "#dc2626" },
            { label: "Expired", value: jobs.filter(j => j.isActive && new Date(j.deadline) < new Date()).length, color: "#d97706" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "white", borderRadius: 12,
              padding: "16px 20px", border: "1px solid #f3f4f6",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ background: "white", borderRadius: 12, padding: "16px 20px",
          border: "1px solid #f3f4f6", marginBottom: 16,
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
                paddingTop: 8, paddingBottom: 8, border: "1px solid #e5e7eb",
                borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", "active", "closed", "expired"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13,
                fontWeight: filter === f ? 600 : 400,
                background: filter === f ? C.purple : "transparent",
                color: filter === f ? "white" : "#6b7280",
                border: filter === f ? "none" : "1px solid #e5e7eb",
                cursor: "pointer", textTransform: "capitalize"
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #f3f4f6",
          overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr",
            padding: "12px 20px", minWidth: 700, background: "#f9fafb",
            borderBottom: "1px solid #f3f4f6", fontSize: 12, fontWeight: 600,
            color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <span>Job</span>
            <span>Company</span>
            <span>Type</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              Loading jobs...
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              <Briefcase size={40} style={{ margin: "0 auto 12px", color: "#d1d5db" }} />
              <p>No jobs found</p>
            </div>
          )}

          {!loading && jobs.map((job, idx) => {
            const badge = statusBadge(job);
            return (
              <div key={job._id} style={{
                display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr",
                padding: "14px 20px", minWidth: 700,
                borderBottom: idx < jobs.length - 1 ? "1px solid #f3f4f6" : "none",
                alignItems: "center",
                background: !job.isActive ? "#fff5f5" : "white"
              }}>
                {/* Job Title */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                    {job.location || "Remote"} · Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Company */}
                <div style={{ fontSize: 13, color: "#374151" }}>
                  {job.postedBy?.companyName || job.postedBy?.name || "—"}
                </div>

                {/* Job Type */}
                <div>
                  <span style={{ background: C.purpleLight, color: C.purple,
                    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {job.jobType || "Full-time"}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span style={{ background: badge.bg, color: badge.color,
                    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {badge.label}
                  </span>
                </div>

                {/* Action */}
                <div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {job.isActive && (
                      <button onClick={() => handleClose(job._id)} style={{
                        padding: '6px 12px', borderRadius: 6, fontSize: 12,
                        fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: '#fee2e2', color: '#dc2626',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <XCircle size={12} /> Close
                      </button>
                    )}
                    <button onClick={() => handleDeleteJob(job._id)} style={{
                      padding: '6px 12px', borderRadius: 6, fontSize: 12,
                      fontWeight: 600, cursor: 'pointer', border: 'none',
                      background: '#fef3c7', color: '#d97706',
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center",
            alignItems: "center", gap: 12, marginTop: 20 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1} style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                background: "white", cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4
              }}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span style={{ fontSize: 14, color: "#6b7280" }}>
              Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages} style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                background: "white", cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4
              }}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}