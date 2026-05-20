import { useState, useEffect, useCallback } from "react";
import { Building2, CheckCircle, XCircle, Search, Shield, ShieldOff, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCompanies, verifyCompany, suspendCompany } from "../../services/adminService";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";

const ITEMS_PER_PAGE = 10;

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | verified | unverified | suspended
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const C = {
    purple: "#7c3aed",
    purpleLight: "#ede9fe",
    purpleDark: "#5b21b6",
  };

  // Fetch companies from backend
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllCompanies({
        search,
        filter,
        page,
        limit: ITEMS_PER_PAGE,
      });
      setCompanies(res.data?.companies || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const handleVerify = async (id, isVerified) => {
    try {
      await verifyCompany(id);
      toast.success(isVerified ? "Company unverified" : "Company verified ✓");
      fetchCompanies();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleSuspend = async (id, isSuspended) => {
    try {
      await suspendCompany(id);
      toast.success(isSuspended ? "Company unsuspended" : "Company suspended");
      fetchCompanies();
    } catch {
      toast.error("Action failed");
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
        <div style={{ 
            padding: "16px 12px", 
            maxWidth: 1200, 
            margin: "0 auto", 
            boxSizing: "border-box",
            width: "100%",
            overflowX: "hidden"
        }}>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Companies Management
        </h1>
        <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>
          Verify, suspend, and manage all registered companies
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Companies", value: total, color: C.purple },
          { label: "Verified", value: companies.filter(c => c.isVerified).length, color: "#059669" },
          { label: "Unverified", value: companies.filter(c => !c.isVerified).length, color: "#d97706" },
          { label: "Suspended", value: companies.filter(c => c.isSuspended).length, color: "#dc2626" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "white", borderRadius: 12, padding: "16px 20px",
            border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div style={{
        background: "white", borderRadius: 12, padding: "16px 20px",
        border: "1px solid #f3f4f6", marginBottom: 16,
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"
      }}>
        {/* Search Input */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            type="text"
            placeholder="Search companies by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", paddingLeft: 36, paddingRight: 12,
              paddingTop: 8, paddingBottom: 8,
              border: "1px solid #e5e7eb", borderRadius: 8,
              fontSize: 14, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "verified", "unverified", "suspended"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13,
                fontWeight: filter === f ? 600 : 400,
                background: filter === f ? C.purple : "transparent",
                color: filter === f ? "white" : "#6b7280",
                border: filter === f ? "none" : "1px solid #e5e7eb",
                cursor: "pointer", textTransform: "capitalize"
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Table */}
      <div style={{
        background: "white", borderRadius: 12,
        border: "1px solid #f3f4f6", overflowX: "auto",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
        }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.5fr",
          padding: "12px 20px",
          minWidth: 700,
          background: "#f9fafb",
          borderBottom: "1px solid #f3f4f6",
          fontSize: 12, fontWeight: 600, color: "#6b7280",
          textTransform: "uppercase", letterSpacing: "0.05em"
        }}>
          <span>Company</span>
          <span>Email</span>
          <span>Status</span>
          <span>Verified</span>
          <span>Actions</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
            Loading companies...
          </div>
        )}

        {/* Empty State */}
        {!loading && companies.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
            <Building2 size={40} style={{ margin: "0 auto 12px", color: "#d1d5db" }} />
            <p>No companies found</p>
          </div>
        )}

        {/* Company Rows */}
        {!loading && companies.map((company, idx) => (
          <div
            key={company._id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.5fr",
              padding: "14px 20px",
              minWidth: 700,
              borderBottom: idx < companies.length - 1 ? "1px solid #f3f4f6" : "none",
              alignItems: "center",
              background: company.isSuspended ? "#fff5f5" : "white",
              transition: "background 0.2s"
            }}
          >
            {/* Company Name + Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: C.purpleLight, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: C.purple
              }}>
                {company.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                  {company.name}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  Joined {new Date(company.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ fontSize: 13, color: "#374151" }}>{company.email}</div>

            {/* Suspend Status */}
            <div>
              {company.isSuspended ? (
                <span style={{
                  background: "#fee2e2", color: "#dc2626",
                  padding: "3px 10px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600
                }}>Suspended</span>
              ) : (
                <span style={{
                  background: "#dcfce7", color: "#16a34a",
                  padding: "3px 10px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600
                }}>Active</span>
              )}
            </div>

            {/* Verify Status */}
            <div>
              {company.isVerified ? (
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#059669", fontSize: 13 }}>
                  <CheckCircle size={14} /> Verified
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", fontSize: 13 }}>
                  <XCircle size={14} /> Unverified
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {/* Verify Button */}
              <button
                onClick={() => handleVerify(company._id, company.isVerified)}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: "pointer", border: "none",
                  background: company.isVerified ? "#fef3c7" : C.purpleLight,
                  color: company.isVerified ? "#92400e" : C.purple
                }}
              >
                {company.isVerified ? "Unverify" : "Verify"}
              </button>

              {/* Suspend Button */}
              <button
                onClick={() => handleSuspend(company._id, company.isSuspended)}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: "pointer", border: "none",
                  background: company.isSuspended ? "#dcfce7" : "#fee2e2",
                  color: company.isSuspended ? "#16a34a" : "#dc2626",
                  display: "flex", alignItems: "center", gap: 4
                }}
              >
                {company.isSuspended ? (
                  <><Shield size={12} /> Unsuspend</>
                ) : (
                  <><ShieldOff size={12} /> Suspend</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", justifyContent: "center",
          alignItems: "center", gap: 12, marginTop: 20
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: "white", cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <span style={{ fontSize: 14, color: "#6b7280" }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: "white", cursor: page === totalPages ? "not-allowed" : "pointer",
              opacity: page === totalPages ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}