import { COLORS } from '../../theme/adminTheme';
import { useState, useEffect, useCallback } from "react";
import { Building2, CheckCircle, XCircle, Search, Shield, ShieldOff, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCompanies, verifyCompany, suspendCompany } from "../../services/adminService";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import PageContainer from '../../components/ui/PageContainer';
import FilterTabs from '../../components/ui/FilterTabs';
import DataTable from '../../components/ui/DataTable';

const ITEMS_PER_PAGE = 10;

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | verified | unverified | suspended
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const C = {
    purple: COLORS.primary,
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
        <PageContainer>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
          Companies Management
        </h1>
        <p style={{ color: COLORS.gray500, marginTop: 4, fontSize: 14 }}>
          Verify, suspend, and manage all registered companies
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Companies", value: total, color: C.purple },
          { label: "Verified", value: companies.filter(c => c.isVerified).length, color: COLORS.successText },
          { label: "Unverified", value: companies.filter(c => !c.isVerified).length, color: COLORS.warningText },
          { label: "Suspended", value: companies.filter(c => c.isSuspended).length, color: COLORS.dangerText },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "white", borderRadius: 12, padding: "16px 20px",
            border: `1px solid ${COLORS.gray100}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div style={{
        background: "white", borderRadius: 12, padding: "16px 20px",
        border: `1px solid ${COLORS.gray100}`, marginBottom: 16,
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
              border: `1px solid ${COLORS.gray200}`, borderRadius: 8,
              fontSize: 14, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        {/* Filter Buttons */}
        <FilterTabs
          tabs={["all", "verified", "unverified", "suspended"]}
          active={filter}
          onChange={setFilter}
        />
      </div>

      {/* Companies Table */}
      <DataTable
        columns={[
          { key: "company",  label: "Company",  width: "2fr"   },
          { key: "email",    label: "Email",    width: "1.5fr" },
          { key: "status",   label: "Status",   width: "1fr"   },
          { key: "verified", label: "Verified", width: "1fr"   },
          { key: "actions",  label: "Actions",  width: "1.5fr" },
        ]}
        rows={companies}
        loading={loading}
        emptyIcon={<Building2 size={40} />}
        emptyTitle="No companies found"
        emptySubtitle="No companies match your current filter"
        
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        renderRow={(company) => [

          /* Company */
          <div key="company" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `${COLORS.primary}14`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: COLORS.primary
            }}>
              {company.name?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray900 }}>
                {company.name}
              </div>
              <div style={{ fontSize: 12, color: COLORS.gray400 }}>
                Joined {new Date(company.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>,

          /* Email */
          <div key="email" style={{ fontSize: 13, color: COLORS.gray700 }}>
            {company.email}
          </div>,

          /* Status */
          <div key="status">
            {company.isSuspended ? (
              <span style={{ background: COLORS.dangerBg, color: COLORS.dangerText,
                padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                Suspended
              </span>
            ) : (
              <span style={{ background: COLORS.successBg, color: COLORS.successText,
                padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                Active
              </span>
            )}
          </div>,

          /* Verified */
          <div key="verified">
            {company.isVerified ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4,
                color: COLORS.successText, fontSize: 13 }}>
                <CheckCircle size={14} /> Verified
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 4,
                color: COLORS.gray400, fontSize: 13 }}>
                <XCircle size={14} /> Unverified
              </span>
            )}
          </div>,

          /* Actions */
          <div key="actions" style={{ display: "flex", gap: 8 }}>
            <Button
              variant={company.isVerified ? "outline" : "primary"}
              size="sm"
              onClick={() => handleVerify(company._id, company.isVerified)}
            >
              {company.isVerified ? "Unverify" : "Verify"}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleSuspend(company._id, company.isSuspended)}
            >
              {company.isSuspended ? "Unsuspend" : "Suspend"}
            </Button>
          </div>,
        ]}
      />

      
    </PageContainer>

    </DashboardLayout>
  );
}