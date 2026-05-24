// Shows card layout on mobile instead of table
// Usage: <MobileCardList rows={} renderCard={} loading={} />

import { COLORS } from '../../theme/adminTheme';
import EmptyState from './EmptyState';
import TableLoader from './TableLoader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MobileCardList({
  rows = [],
  renderCard,
  loading = false,
  emptyIcon,
  emptyTitle = "No data found",
  emptySubtitle = "No items match your filter",
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (loading) return <TableLoader rows={4} />;

  if (rows.length === 0) return (
    <EmptyState
      icon={emptyIcon}
      title={emptyTitle}
      subtitle={emptySubtitle}
      variant="admin"
    />
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((row, idx) => (
          <div key={row._id || idx} style={{
            background: COLORS.white,
            borderRadius: 16,
            padding: '14px 16px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {renderCard(row, idx)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', gap: 8, marginTop: 16,
        }}>
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 14px', borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.08)',
              background: COLORS.white,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.4 : 1,
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 13, fontWeight: 500, color: COLORS.gray600,
            }}
          >
            <ChevronLeft size={15} /> Prev
          </button>
          <div style={{
            padding: '8px 16px', borderRadius: 10,
            background: `${COLORS.primary}10`,
            border: `1px solid ${COLORS.primary}25`,
            fontSize: 13, fontWeight: 600, color: COLORS.primary,
          }}>
            {page} / {totalPages}
          </div>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 14px', borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.08)',
              background: COLORS.white,
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.4 : 1,
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 13, fontWeight: 500, color: COLORS.gray600,
            }}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}