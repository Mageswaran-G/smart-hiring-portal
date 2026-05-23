import { COLORS } from '../../theme/adminTheme';
import { useState, useEffect, useCallback } from "react";
import { Users, Search, ChevronLeft, ChevronRight, ShieldOff, Shield, Trash2, AlertTriangle } from "lucide-react";
import { getAllUsers, suspendUser, deleteUser } from "../../services/adminService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import PageContainer from '../../components/ui/PageContainer';
import FilterTabs from '../../components/ui/FilterTabs';
import DataTable from '../../components/ui/DataTable';
import SearchInput from '../../components/ui/SearchInput';
import Modal from '../../components/ui/Modal';

const ITEMS_PER_PAGE = 10;

const C = {
  purple: COLORS.primary,
  purpleLight: "#ede9fe",
};

export default function AdminUsersPage() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // user id to delete

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers({ search, filter, page, limit: ITEMS_PER_PAGE });
      setUsers(res.data?.users || []);
      setTotal(res.data?.total || 0);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, filter]);

  const handleSuspend = async (id, isSuspended) => {
    try {
      await suspendUser(id);
      toast.success(isSuspended ? "User unsuspended" : "User suspended");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setDeleteConfirm(null);
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const roleColor = (role) =>
    role === "candidate" ? "#ea580c" : role === "company" ? "#1e3a5f" : C.purple;

  return (
    <DashboardLayout>
        <PageContainer>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: COLORS.gray900, margin: 0 }}>
            Users Management
          </h1>
          <p style={{ color: COLORS.gray500, marginTop: 4, fontSize: 14 }}>
            Search, suspend, and manage all platform users
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Users",  value: total,                                              color: C.purple   },
            { label: "Candidates",   value: users.filter(u => u.role === "candidate").length,   color: "#ea580c"  },
            { label: "Companies",    value: users.filter(u => u.role === "company").length,     color: "#1e3a5f"  },
            { label: "Suspended",    value: users.filter(u => u.isSuspended).length,            color: COLORS.dangerText  },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "white", borderRadius: 12, padding: "16px 20px",
              border: `1px solid ${COLORS.gray100}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: COLORS.gray500, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{
          background: "white", borderRadius: 12, padding: "16px 20px",
          border: `1px solid ${COLORS.gray100}`, marginBottom: 16,
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"
        }}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by job title or location..."
          />
          <FilterTabs
            tabs={["all", "candidates", "companies", "suspended"]}
            active={filter}
            onChange={setFilter}
          />
        </div>
        {/* Table */}
        <DataTable
          columns={[
            { key: "user",    label: "User",    width: "2fr"   },
            { key: "email",   label: "Email",   width: "2fr"   },
            { key: "role",    label: "Role",    width: "1fr"   },
            { key: "status",  label: "Status",  width: "1fr"   },
            { key: "actions", label: "Actions", width: "1.5fr" },
          ]}
          rows={users}
          loading={loading}
          emptyIcon={<Users size={40} />}
          emptyTitle="No users found"
          emptySubtitle="No users match your current filter"
          
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          renderRow={(user) => [

            /* User */
            <div key="user" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: `${roleColor(user.role)}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: roleColor(user.role), flexShrink: 0
              }}>
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.gray900 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: COLORS.gray400 }}>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>,

            /* Email */
            <div key="email" style={{ fontSize: 13, color: COLORS.gray700 }}>
              {user.email}
            </div>,

            /* Role */
            <div key="role">
              <span style={{
                background: `${roleColor(user.role)}15`,
                color: roleColor(user.role),
                padding: "3px 10px", borderRadius: 20,
                fontSize: 12, fontWeight: 600, textTransform: "capitalize"
              }}>
                {user.role}
              </span>
            </div>,

            /* Status */
            <div key="status">
              {user.isSuspended ? (
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

            /* Actions */
            <div key="actions" style={{ display: "flex", gap: 8 }}>
              <Button variant="outline" size="sm"
                onClick={() => handleSuspend(user._id, user.isSuspended)}>
                {user.isSuspended ? "Unsuspend" : "Suspend"}
              </Button>
              <Button variant="danger" size="sm"
                onClick={() => setDeleteConfirm(user._id)}>
                Delete
              </Button>
            </div>,
          ]}
        />

        

        {/* Delete Confirmation Modal */}
        <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <AlertTriangle size={40} color={COLORS.dangerText}
            style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700,
            color: COLORS.gray900, margin: "0 0 8px" }}>
            Delete User?
          </h3>
          <p style={{ color: COLORS.gray500, fontSize: 14, margin: "0 0 24px" }}>
            This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>
              Yes, Delete
            </Button>
          </div>
        </Modal>

      </PageContainer>
    </DashboardLayout>
  );
}