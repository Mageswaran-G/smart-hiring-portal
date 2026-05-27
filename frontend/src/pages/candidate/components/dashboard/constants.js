export const C = {
  primary:'#ea580c', grad:'linear-gradient(135deg, #7c1d06 0%, #c2410c 35%, #ea580c 65%, #f97316 85%, #fbbf24 100%)',
  gray50:'#f9fafb', gray100:'#f3f4f6', gray200:'#e5e7eb', gray300:'#d1d5db', gray400:'#9ca3af',
  gray500:'#6b7280', gray700:'#374151', gray900:'#111827',
  green:'#059669', red:'#dc2626', blue:'#2563eb', light:'#fff7ed', border:'#fed7aa',
};
export const STATUS_CONFIG = {
  applied:{ label:'Applied', color:'#1d4ed8', bg:'#dbeafe' },
  shortlisted:{ label:'Shortlisted', color:'#065f46', bg:'#d1fae5' },
  interview:{ label:'Interview', color:'#92400e', bg:'#fef3c7' },
  hired:{ label:'Hired', color:'#065f46', bg:'#d1fae5' },
  rejected:{ label:'Rejected', color:'#991b1b', bg:'#fee2e2' },
};
export const timeAgo = (date) => {
  if (!date) return '';
  const d = Math.floor((Date.now() - new Date(date)) / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 30) return d + 'd ago';
  return Math.floor(d / 30) + 'mo ago';
};
