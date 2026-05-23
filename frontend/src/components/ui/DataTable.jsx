import { ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';
import TableLoader from './TableLoader';
import { COLORS } from '../../theme/adminTheme';

export default function DataTable({
  columns = [],
  rows = [],
  renderRow,
  loading = false,
  emptyIcon,
  emptyTitle = "No data found",
  emptySubtitle = "No items match your current filter",
  page = 1,
  totalPages = 1,
  onPageChange,
  gridTemplate,
}) {
  const template = gridTemplate ||
    columns.map(c => c.width || '1fr').join(' ');

  return (
    <div>
      <div style={{
        background: COLORS.white,
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        overflowX: "auto",
        marginBottom: 16,
        overflow: "hidden",
      }}>

        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: template,
          padding: "12px 24px",
          minWidth: 600,
          background: 'linear-gradient(to bottom, #fafafa, #f5f5f5)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          fontSize: 11,
          fontWeight: 700,
          color: COLORS.gray400,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {columns.map(col => (
            <span key={col.key}>{col.label}</span>
          ))}
        </div>

        {loading && <TableLoader rows={5} />}

        {!loading && rows.length === 0 && (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            subtitle={emptySubtitle}
            variant="admin"
          />
        )}

        {!loading && rows.map((row, idx) => (
          <div
            key={row._id || idx}
            className="admin-table-row"
            onMouseEnter={e => e.currentTarget.style.background = '#f8f7ff'}
            onMouseLeave={e => e.currentTarget.style.background = row.isSuspended ? '#fff5f5' : COLORS.white}
            style={{
              display: "grid",
              gridTemplateColumns: template,
              padding: "16px 24px",
              minWidth: 600,
              borderBottom: idx < rows.length - 1 ? '1px solid rgba(0,0,0,0.05)' : "none",
              alignItems: "center",
              background: row.isSuspended ? '#fff5f5' : COLORS.white,
              transition: "background 0.15s ease",
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
          gap: 8,
          marginTop: 16,
        }}>
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.08)',
              background: COLORS.white,
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.gray600,
              transition: "all 0.15s ease",
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <ChevronLeft size={15} /> Prev
          </button>

          <div style={{
            padding: "8px 20px",
            borderRadius: 10,
            background: `${COLORS.primary}10`,
            border: `1px solid ${COLORS.primary}25`,
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.primary,
          }}>
            {page} / {totalPages}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.08)',
              background: COLORS.white,
              cursor: page === totalPages ? "not-allowed" : "pointer",
              opacity: page === totalPages ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.gray600,
              transition: "all 0.15s ease",
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}