import { MessageCircle, X } from 'lucide-react';

const PRIMARY_GRADIENT =
  'linear-gradient(135deg, #ea580c, #f97316)';

export default function FloatingButton({
  open,
  onToggle,
}) {
  return (
    <button
      type="button"
      className={!open ? 'hirebot-float' : ''}
      onClick={onToggle}
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: PRIMARY_GRADIENT,
        border: 'none',
        cursor: open ? 'default' : 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(234,88,12,.4)',
        marginLeft: 'auto',
      }}
    >
      {open ? (
        <X size={22} color="#fff" />
      ) : (
        <MessageCircle size={22} color="#fff" />
      )}
    </button>
  );
}