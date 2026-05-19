import { useState } from 'react';

export default function SafeAvatar({
  src,
  name = '',
  alt = '',
  className = '',
  style,
  fallbackClassName = '',
  fallbackStyle,
  textClassName = '',
}) {
  const [failed, setFailed] = useState(false);
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={fallbackClassName || className} style={fallbackStyle || style}>
      <span className={textClassName}>{initial}</span>
    </div>
  );
}
