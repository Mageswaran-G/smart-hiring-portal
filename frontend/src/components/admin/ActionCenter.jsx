import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, CheckCircle } from "lucide-react";
import { getActionCenter } from "../../services/adminService";
import { COLORS } from '../../theme/adminTheme';
import { ROUTES } from '../../constants/routes';

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
          <h2 style={styles.title}><Target size={16} style={{ display:'inline', marginRight:6, verticalAlign:'middle' }} />Action Center</h2>
          <span style={styles.clearBadge}>All Clear</span>
        </div>
        <div style={styles.allClear}>
          <CheckCircle size={36} color={COLORS.successText} style={{ margin:'0 auto' }} />
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
          <h2 style={styles.title}><Target size={16} style={{ display:'inline', marginRight:6, verticalAlign:'middle' }} />Action Center</h2>
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
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? tab.color : COLORS.gray500,
              fontWeight: activeTab === tab.key ? 700 : 500,
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
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
                    onClick={() => navigate(ROUTES.ADMIN_COMPANIES)}
                    style={styles.actionBtn(COLORS.warning)}
                  >
                    Verify →
                  </button>
                </div>
              ))
            )}
            {counts.unverified > 5 && (
              <button
                onClick={() => navigate(ROUTES.ADMIN_COMPANIES)}
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
                    onClick={() => navigate(ROUTES.ADMIN_USERS)}
                    style={styles.actionBtn(COLORS.danger)}
                  >
                    Review →
                  </button>
                </div>
              ))
            )}
            {counts.suspended > 5 && (
              <button
                onClick={() => navigate(ROUTES.ADMIN_USERS)}
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
                      {job.postedBy?.companyName || job.postedBy?.name || "Unknown"} • {job.location}
                    </p>
                    <p style={styles.alertTime}>
                      Expired {timeAgo(job.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(ROUTES.ADMIN_JOBS)}
                    style={styles.actionBtn(COLORS.gray500)}
                  >
                    View →
                  </button>
                </div>
              ))
            )}
            {counts.expired > 5 && (
              <button
                onClick={() => navigate(ROUTES.ADMIN_JOBS)}
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
    borderRadius: 20,
    border: '1px solid rgba(0,0,0,0.06)',
    padding: "24px 28px",
    marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: 800,
    color: COLORS.gray900,
    margin: 0,
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray400,
    margin: "3px 0 0 0",
    fontWeight: 500,
  },
  alertBadge: {
    background: '#fef3c7',
    color: '#d97706',
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 12px",
    borderRadius: 10,
    border: '1px solid #fcd34d',
  },
  clearBadge: {
    background: '#f0fdf4',
    color: COLORS.successText,
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 12px",
    borderRadius: 10,
    border: '1px solid #bbf7d0',
  },
  tabRow: {
    display: "flex",
    gap: 4,
    marginBottom: 16,
    background: 'rgba(0,0,0,0.04)',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "7px 14px",
    fontSize: 13,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.15s ease",
    fontWeight: 500,
  },
  tabBadge: {
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 8,
  },
  content: {
    minHeight: 80,
  },
  alertItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 0",
    borderBottom: `1px solid rgba(0,0,0,0.05)`,
  },
  alertAvatar: (color) => ({
    width: 40,
    height: 40,
    borderRadius: 12,
    background: color + "15",
    color: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
    border: `1px solid ${color}25`,
  }),
  alertName: {
    margin: 0,
    fontWeight: 700,
    fontSize: 14,
    color: COLORS.gray900,
  },
  alertSub: {
    margin: "2px 0 0 0",
    fontSize: 12,
    color: COLORS.gray500,
  },
  alertTime: {
    margin: "2px 0 0 0",
    fontSize: 11,
    color: COLORS.gray400,
  },
  actionBtn: (color) => ({
    background: color + "12",
    color: color,
    border: `1px solid ${color}30`,
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: 'all 0.15s ease',
  }),
  viewAllBtn: {
    background: "none",
    border: "none",
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 12,
    padding: 0,
  },
  allClear: {
    textAlign: "center",
    padding: "28px",
  },
  emptyText: {
    color: COLORS.gray400,
    fontSize: 13,
    textAlign: "center",
    padding: "20px",
  },
};