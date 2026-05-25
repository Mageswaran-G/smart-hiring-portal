// Reusable AI match score card for candidates

export default function MatchScoreCard({ matchScore, loading }) {

  if (loading) {
    return (
      <div style={{ background: "#f9fafb", borderRadius: 20, border: "1px solid #e5e7eb", padding: "20px 28px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid #16a34a", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <span style={{ color: "#6b7280", fontSize: 14 }}>Calculating your match score...</span>
      </div>
    );
  }

  if (!matchScore) return null;

  const scoreColor = matchScore.score >= 70 ? "#16a34a" : matchScore.score >= 40 ? "#d97706" : "#dc2626";
  const scoreLabel = matchScore.score >= 70 ? "Strong match! 🎉" : matchScore.score >= 40 ? "Moderate match" : matchScore.score > 0 ? "Weak match — consider upskilling" : "No strong skill match found";

  return (
    <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderRadius: 20, border: "1px solid #bbf7d0", padding: "24px 28px" }}>

      {/* Score circle + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: scoreColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>{matchScore.score}%</span>
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, color: "#111827", margin: 0 }}>Your Match Score</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{scoreLabel}</p>
        </div>
      </div>

      {/* Matched Skills */}
      {matchScore.matchedSkills?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Matched Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {matchScore.matchedSkills.map((s, i) => (
              <span key={i} style={{ background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {matchScore.missingSkills?.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Missing Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {matchScore.missingSkills.map((s, i) => (
              <span key={i} style={{ background: "#fef2f2", color: "#dc2626", padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gap Suggestions */}
      {matchScore.suggestions?.length > 0 && (
        <div style={{ marginTop: 12, padding: "12px 16px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Skill Gap — Suggested Learning</p>
          {matchScore.suggestions.map((s, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#b45309", margin: "0 0 3px" }}>Learn {s.skill}:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {s.resources.map((r, j) => (
                  <span key={j} style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}