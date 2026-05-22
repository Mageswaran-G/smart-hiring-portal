import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActionCenter } from "../../services/adminService";
import { COLORS } from '../../theme/adminTheme';

export default function ActionCenter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unverified");
  const navigate = useNavigate();

  useEffect(() => {
    fetchActionCenter();
  }, []);

  const fetchActionCenter = async () => {
    try {
      const res = await getActionCenter();
      setData(res.data);
    } catch (err) {
      console.error("Action center error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Time ago helper — shows "2 days ago" instead of full date
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ color: COLORS.gray500 }}>Loading alerts...</p>
      </div>
    );
  }

  if (!data) return null;

  const { unverifiedCompanies, suspendedUsers, expiredJobs, counts } = data;

  // No alerts — show all clear message
  if (counts.total === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎯 Action Center</h2>
          <span style={styles.clearBadge}>All Clear</span>
        </div>
        <div style={styles.allClear}>
          <div style={{ fontSize: "2.5rem" }}>✅</div>
          <p style={{ color: COLORS.successText, fontWeight: 600, marginTop: 8 }}>
            No pending actions
          </p>
          <p style={{ color: COLORS.gray500, fontSize: "0.875rem" }}>
            Platform is running smoothly
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      key: "unverified",
      label: "Unverified",
      count: counts.unverified,
      color: COLORS.warning,
    },
    {
      key: "suspended",
      label: "Suspended",
      count: counts.suspended,
      color: COLORS.danger,
    },
    {
      key: "expired",
      label: "Expired Jobs",
      count: counts.expired,
      color: COLORS.gray500,
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎯 Action Center</h2>
          <p style={styles.subtitle}>Items that need your attention</p>
        </div>
        <span style={styles.alertBadge}>{counts.total} alerts</span>
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tab,
              borderBottom:
                activeTab === tab.key
                  ? `2px solid ${tab.color}`
                  : "2px solid transparent",
              color: activeTab === tab.key ? tab.color : COLORS.gray500,
              fontWeight: activeTab === tab.key ? 600 : 400,
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                style={{
                  ...styles.tabBadge,
                  background: tab.color,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.content}>

        {/* Unverified Companies */}
        {activeTab === "unverified" && (
          <div>
            {unverifiedCompanies.length === 0 ? (
              <p style={styles.emptyText}>No unverified companies</p>
            ) : (
              unverifiedCompanies.map((company) => (
                <div key={company._id} style={styles.alertItem}>
                  <div style={styles.alertAvatar(COLORS.warning)}>
                    {company.name?.[0]?.toUpperCase() || "C"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={styles.alertName}>{company.name}</p>
                    <p style={styles.alertSub}>{company.email}</p>
                    <p style={styles.alertTime}>
                      Registered {timeAgo(company.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/companies")}
                    style={styles.actionBtn(COLORS.warning)}
                  >
                    Verify →
                  </button>
                </div>
              ))
            )}
            {counts.unverified > 5 && (
              <button
                onClick={() => navigate("/admin/companies")}
                style={styles.viewAllBtn}
              >
                View all {counts.unverified} unverified companies →
              </button>
            )}
          </div>
        )}

        {/* Suspended Users */}
        {activeTab === "suspended" && (
          <div>
            {suspendedUsers.length === 0 ? (
              <p style={styles.emptyText}>No suspended users</p>
            ) : (
              suspendedUsers.map((user) => (
                <div key={user._id} style={styles.alertItem}>
                  <div style={styles.alertAvatar(COLORS.danger)}>
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={styles.alertName}>{user.name}</p>
                    <p style={styles.alertSub}>
                      {user.email} •{" "}
                      <span style={{ textTransform: "capitalize" }}>
                        {user.role}
                      </span>
                    </p>
                    <p style={styles.alertTime}>
                      Suspended {timeAgo(user.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/users")}
                    style={styles.actionBtn(COLORS.danger)}
                  >
                    Review →
                  </button>
                </div>
              ))
            )}
            {counts.suspended > 5 && (
              <button
                onClick={() => navigate("/admin/users")}
                style={styles.viewAllBtn}
              >
                View all {counts.suspended} suspended users →
              </button>
            )}
          </div>
        )}

        {/* Expired Jobs */}
        {activeTab === "expired" && (
          <div>
            {expiredJobs.length === 0 ? (
              <p style={styles.emptyText}>No expired jobs</p>
            ) : (
              expiredJobs.map((job) => (
                <div key={job._id} style={styles.alertItem}>
                  <div style={styles.alertAvatar(COLORS.gray500)}>💼</div>
                  <div style={{ flex: 1 }}>
                    <p style={styles.alertName}>{job.title}</p>
                    <p style={styles.alertSub}>
                      {job.company?.name || "Unknown"} • {job.location}
                    </p>
                    <p style={styles.alertTime}>
                      Expired {timeAgo(job.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/jobs")}
                    style={styles.actionBtn(COLORS.gray500)}
                  >
                    View →
                  </button>
                </div>
              ))
            )}
            {counts.expired > 5 && (
              <button
                onClick={() => navigate("/admin/jobs")}
                style={styles.viewAllBtn}
              >
                View all {counts.expired} expired jobs →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    background: "#fff",
    borderRadius: 12,
    border: `1px solid ${COLORS.gray200}`,
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: COLORS.gray900,
    margin: 0,
  },
  subtitle: {
    fontSize: "0.8rem",
    color: COLORS.gray500,
    margin: "2px 0 0 0",
  },
  alertBadge: {
    background: "#fef3c7",
    color: "#d97706",
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    border: "1px solid #fbbf24",
  },
  clearBadge: {
    background: "#dcfce7",
    color: COLORS.successText,
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
  },
  tabRow: {
    display: "flex",
    gap: "1rem",
    borderBottom: `1px solid ${COLORS.gray200}`,
    marginBottom: "1rem",
  },
  tab: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem 0.25rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.2s",
  },
  tabBadge: {
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 10,
  },
  content: {
    minHeight: 100,
  },
  alertItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 0",
    borderBottom: `1px solid ${COLORS.gray100}`,
  },
  alertAvatar: (color) => ({
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: color + "20",
    color: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.875rem",
    flexShrink: 0,
  }),
  alertName: {
    margin: 0,
    fontWeight: 600,
    fontSize: "0.875rem",
    color: COLORS.gray900,
  },
  alertSub: {
    margin: "2px 0 0 0",
    fontSize: "0.75rem",
    color: COLORS.gray500,
  },
  alertTime: {
    margin: "2px 0 0 0",
    fontSize: "0.7rem",
    color: COLORS.gray400,
  },
  actionBtn: (color) => ({
    background: color + "15",
    color: color,
    border: `1px solid ${color}40`,
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  }),
  viewAllBtn: {
    background: "none",
    border: "none",
    color: COLORS.primary,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.75rem",
    padding: 0,
  },
  allClear: {
    textAlign: "center",
    padding: "2rem",
  },
  emptyText: {
    color: COLORS.gray400,
    fontSize: "0.875rem",
    textAlign: "center",
    padding: "1.5rem",
  },
};