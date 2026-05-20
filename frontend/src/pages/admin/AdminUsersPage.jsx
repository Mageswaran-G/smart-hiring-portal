import { useState, useEffect, useCallback } from "react";
import { Users, Search, ChevronLeft, ChevronRight, ShieldOff, Shield, Trash2, AlertTriangle } from "lucide-react";
import { getAllUsers, suspendUser, deleteUser } from "../../services/adminService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const C = {
  purple: "#7c3aed",
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
      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
            Users Management
          </h1>
          <p style={{ color: "#6b7280", marginTop: 4, fontSize: 14 }}>
            Search, suspend, and manage all platform users
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Users",  value: total,                                              color: C.purple   },
            { label: "Candidates",   value: users.filter(u => u.role === "candidate").length,   color: "#ea580c"  },
            { label: "Companies",    value: users.filter(u => u.role === "company").length,     color: "#1e3a5f"  },
            { label: "Suspended",    value: users.filter(u => u.isSuspended).length,            color: "#dc2626"  },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "white", borderRadius: 12, padding: "16px 20px",
              border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{
          background: "white", borderRadius: 12, padding: "16px 20px",
          border: "1px solid #f3f4f6", marginBottom: 16,
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap"
        }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search by name or email..."
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
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "candidates", "companies", "suspended"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13,
                fontWeight: filter === f ? 600 : 400,
                background: filter === f ? C.purple : "transparent",
                color: filter === f ? "white" : "#6b7280",
                border: filter === f ? "none" : "1px solid #e5e7eb",
                cursor: "pointer", textTransform: "capitalize"
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: "white", borderRadius: 12,
          border: "1px solid #f3f4f6", overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
        }}>
          {/* Table Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr",
            padding: "12px 20px", background: "#f9fafb",
            borderBottom: "1px solid #f3f4f6",
            fontSize: 12, fontWeight: 600, color: "#6b7280",
            textTransform: "uppercase", letterSpacing: "0.05em"
          }}>
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              Loading users...
            </div>
          )}

          {/* Empty */}
          {!loading && users.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              <Users size={40} style={{ margin: "0 auto 12px", color: "#d1d5db" }} />
              <p>No users found</p>
            </div>
          )}

          {/* User Rows */}
          {!loading && users.map((user, idx) => (
            <div key={user._id} style={{
              display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1.5fr",
              padding: "14px 20px",
              borderBottom: idx < users.length - 1 ? "1px solid #f3f4f6" : "none",
              alignItems: "center",
              background: user.isSuspended ? "#fff5f5" : "white"
            }}>

              {/* Name + Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${roleColor(user.role)}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: roleColor(user.role), flexShrink: 0
                }}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ fontSize: 13, color: "#374151" }}>{user.email}</div>

              {/* Role Badge */}
              <div>
                <span style={{
                  background: `${roleColor(user.role)}15`,
                  color: roleColor(user.role),
                  padding: "3px 10px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600, textTransform: "capitalize"
                }}>
                  {user.role}
                </span>
              </div>

              {/* Status */}
              <div>
                {user.isSuspended ? (
                  <span style={{ background: "#fee2e2", color: "#dc2626", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    Suspended
                  </span>
                ) : (
                  <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    Active
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                {/* Suspend Button */}
                <button onClick={() => handleSuspend(user._id, user.isSuspended)} style={{
                  padding: "6px 10px", borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: "pointer", border: "none",
                  background: user.isSuspended ? "#dcfce7" : "#fee2e2",
                  color: user.isSuspended ? "#16a34a" : "#dc2626",
                  display: "flex", alignItems: "center", gap: 4
                }}>
                  {user.isSuspended ? <><Shield size={12} /> Unsuspend</> : <><ShieldOff size={12} /> Suspend</>}
                </button>

                {/* Delete Button */}
                <button onClick={() => setDeleteConfirm(user._id)} style={{
                  padding: "6px 10px", borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: "pointer", border: "none",
                  background: "#f3f4f6", color: "#6b7280",
                  display: "flex", alignItems: "center", gap: 4
                }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 20 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: "white", cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4
            }}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span style={{ fontSize: 14, color: "#6b7280" }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
              padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
              background: "white", cursor: page === totalPages ? "not-allowed" : "pointer",
              opacity: page === totalPages ? 0.5 : 1, display: "flex", alignItems: "center", gap: 4
            }}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
          }}>
            <div style={{ background: "white", borderRadius: 16, padding: 32, maxWidth: 400, width: "90%", textAlign: "center" }}>
              <AlertTriangle size={40} color="#dc2626" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
                Delete User?
              </h3>
              <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>
                This action cannot be undone. The user will be permanently deleted.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => setDeleteConfirm(null)} style={{
                  padding: "10px 24px", borderRadius: 8, border: "1px solid #e5e7eb",
                  background: "white", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}>
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} style={{
                  padding: "10px 24px", borderRadius: 8, border: "none",
                  background: "#dc2626", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}