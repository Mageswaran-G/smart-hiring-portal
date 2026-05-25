import { getScoreMeta } from '../../utils/matchScore';

export default function CandidateRankCard({ ranking, loading }) {
  return (
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "14px 20px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" }}>
        <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>AI Candidate Ranking</p>
        <p style={{ fontSize: 12, margin: 0, opacity: 0.8 }}>Sorted by skill match score</p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>
          Calculating rankings...
        </div>
      )}

      {/* Candidate rows */}
      {!loading && ranking.map((r, i) => (
        <div key={r.applicationId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f3f4f6" }}>

          {/* Rank number */}
          <span style={{ fontWeight: 800, fontSize: 14, color: "#7c3aed", minWidth: 24 }}>#{i + 1}</span>

          {/* Avatar */}
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#7c3aed", fontSize: 14 }}>
            {r.candidate.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name + email */}
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: 0 }}>{r.candidate.name}</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{r.candidate.email}</p>
          </div>

          {/* Score badge */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              background: getScoreMeta(r.score).bg,
              color: getScoreMeta(r.score).color,
              padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:700
            }}>
              {r.score}% Match
            </div>
            <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>
              {r.matchedSkills?.length || 0} skills matched
            </p>
          </div>

        </div>
      ))}

      {/* Empty state */}
      {!loading && ranking.length === 0 && (
        <div style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>
          No applicants yet
        </div>
      )}

    </div>
  );
}