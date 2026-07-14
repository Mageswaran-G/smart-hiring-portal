import SafeAvatar from '../../../../components/ui/SafeAvatar';

export default function CompanyAvatar({ profile, size = 60 }) {
  const letter = profile?.companyName || profile?.name || 'C';

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Gradient glow ring */}
      <div style={{
        width: size + 8,
        height: size + 8,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #60a5fa, #1e3a5f, #0f172a)',
        padding: 3,
        boxShadow: '0 0 24px rgba(30,58,95,0.5), 0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <SafeAvatar
          src={profile?.photo}
          name={letter}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          fallbackStyle={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e40af, #1e3a5f)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: size * 0.38,
          }}
        />
      </div>

     
    </div>
  );
}
