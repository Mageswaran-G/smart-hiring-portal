// Reusable admin table with loading, empty state, and pagination
// Usage: <DataTable columns={[]} rows={[]} loading={} emptyIcon={} emptyTitle={} />

import { ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';
import { COLORS } from '../../theme/adminTheme';
import TableLoader from './TableLoader';

export default function DataTable({
  columns = [],        // [{ key, label, width }]
  rows = [],           // array of row data objects
  renderRow,           // function(row, idx) → JSX cells array
  loading = false,
  emptyIcon,           // icon component for empty state
  emptyTitle = "No data found",
  emptySubtitle = "No items match your current filter",
  page = 1,
  totalPages = 1,
  onPageChange,        // function(newPage)
  gridTemplate,        // CSS grid template columns string
}) {
  const template = gridTemplate ||
    columns.map(c => c.width || '1fr').join(' ');
  return (
    <div>
      {/* Table Container */}
      <div style={{
        background: COLORS.white,
        borderRadius: 12,
        border: `1px solid ${COLORS.gray100}`,
        overflowX: "auto",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        marginBottom: 16,
      }}>

        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: template,
          padding: "12px 20px",
          minWidth: 600,
          background: COLORS.gray50,
          borderBottom: `1px solid ${COLORS.gray100}`,
          fontSize: 12,
          fontWeight: 600,
          color: COLORS.gray500,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          {columns.map(col => (
            <span key={col.key}>{col.label}</span>
          ))}
        </div>

        {/* Loading State */}
        {loading && <TableLoader rows={5} />}

        {/* Empty State */}
        {!loading && rows.length === 0 && (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            subtitle={emptySubtitle}
            variant="admin"
          />
        )}

        {/* Rows */}
        {!loading && rows.map((row, idx) => (
          <div
            key={row._id || idx}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.gray50}
            onMouseLeave={e => e.currentTarget.style.background = row.isSuspended ? "#fff5f5" : COLORS.white}
            style={{
              display: "grid",
              gridTemplateColumns: template,
              padding: "14px 20px",
              minWidth: 600,
              borderBottom: idx < rows.length - 1 ? `1px solid ${COLORS.gray100}` : "none",
              alignItems: "center",
              background: row.isSuspended ? "#fff5f5" : COLORS.white,
              transition: "background 0.15s",
              cursor: "default",
            }}
          >
            {renderRow(row, idx)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          marginTop: 8,
        }}>
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${COLORS.gray200}`,
              background: COLORS.white,
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              color: COLORS.gray600,
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <span style={{ fontSize: 14, color: COLORS.gray500 }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${COLORS.gray200}`,
              background: COLORS.white,
              cursor: page === totalPages ? "not-allowed" : "pointer",
              opacity: page === totalPages ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              color: COLORS.gray600,
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}