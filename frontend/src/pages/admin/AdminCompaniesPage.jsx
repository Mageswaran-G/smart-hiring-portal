import { COLORS, TYPOGRAPHY, SPACING } from '../../theme/adminTheme';
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import SearchInput from '../../components/ui/SearchInput';

const ITEMS_PER_PAGE = 10;

export default function AdminCompaniesPage() {
  
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | verified | unverified | suspended
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: res, isLoading: loading } = useQuery({
    queryKey: ['adminCompanies', search, filter, page],
    queryFn: () => getAllCompanies({ search, filter, page, limit: ITEMS_PER_PAGE }),
  });

  const companies = res?.data?.companies || [];
  const total     = res?.data?.total     || 0;

  const C = {
    purple: COLORS.primary,
    purpleLight: "#ede9fe",
    purpleDark: "#5b21b6",
  };

  

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const handleVerify = async (id, isVerified) => {
    queryClient.setQueryData(
      ['adminCompanies', search, filter, page],
      (old) => {
        if (!old?.data?.companies) return old;
        return {
          ...old,
          data: {
            ...old.data,
            companies: old.data.companies.map(c =>
              c._id === id ? { ...c, isVerified: !c.isVerified } : c
            )
          }
        };
      }
    );
    try {
      await verifyCompany(id);
      toast.success(isVerified ? "Company unverified" : "Company verified ✓");
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
    } catch {
      toast.error("Action failed");
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
    }
  };

  const handleSuspend = async (id, isSuspended) => {
    queryClient.setQueryData(
      ['adminCompanies', search, filter, page],
      (old) => {
        if (!old?.data?.companies) return old;
        return {
          ...old,
          data: {
            ...old.data,
            companies: old.data.companies.map(c =>
              c._id === id ? { ...c, isSuspended: !c.isSuspended } : c
            )
          }
        };
      }
    );
    try {
      await suspendCompany(id);
      toast.success(isSuspended ? "Company unsuspended" : "Company suspended");
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
    } catch {
      toast.error("Action failed");
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
        <PageContainer>
      {/* Page Header */}
      <div style={{ marginBottom: SPACING.section }}>
        <h1 style={{ ...TYPOGRAPHY.h2, margin: 0 }}>
          Companies Management
        </h1>
        <p style={{ color: COLORS.gray500, marginTop: 4, fontSize: 14 }}>
          Verify, suspend, and manage all registered companies
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: SPACING.section }}>
        {[
          { label: "Total Companies", value: total, color: C.purple },
          { label: "Verified", value: companies.filter(c => c.isVerified).length, color: COLORS.successText },
          { label: "Unverified", value: companies.filter(c => !c.isVerified).length, color: COLORS.warningText },
          { label: "Suspended", value: companies.filter(c => c.isSuspended).length, color: COLORS.dangerText },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "white", borderRadius: 16, padding: "16px 20px",
            border: `1px solid ${COLORS.gray100}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, letterSpacing: "-0.5px" }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div style={{
        background: "white", borderRadius: 16, padding: "16px 20px",
        border: `1px solid ${COLORS.gray100}`, marginBottom: SPACING.cardSm,
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"
      }}>
        {/* Search Input */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by job title or location..."
        />

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
          { key: "company",  label: "Company",  width: "180px" },
          { key: "email",    label: "Email",    width: "160px" },
          { key: "status",   label: "Status",   width: "90px"  },
          { key: "verified", label: "Verified", width: "100px" },
          { key: "actions",  label: "Actions",  width: "160px" },
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