import SafeAvatar from '../../../../components/ui/SafeAvatar';

export default function CompanyAvatar({ profile, size = 60, border = '3px solid rgba(255,255,255,0.4)' }) {
  return (
    <SafeAvatar
      src={profile?.photo}
      name={profile?.companyName || profile?.name || 'C'}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border, flexShrink: 0 }}
      fallbackStyle={{ width: size, height: size, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: size * 0.38, border, flexShrink: 0, letterSpacing: '-1px' }}
    />
  );
}
