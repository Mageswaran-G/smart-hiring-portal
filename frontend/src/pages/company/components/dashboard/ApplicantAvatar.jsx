import { C } from './dashboardTheme';
import SafeAvatar from '../../../../components/ui/SafeAvatar';

export default function ApplicantAvatar({ candidate, size = 34, border = 'none' }) {
  const photo = candidate?.photo || candidate?.profilePhoto;

  return (
    <SafeAvatar
      src={photo}
      name={candidate?.name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border }}
      fallbackStyle={{ width: size, height: size, borderRadius: '50%', background: `${C.primary}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, fontWeight: 800, fontSize: 13, flexShrink: 0, border }}
    />
  );
}
