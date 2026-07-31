import { type FC, useMemo, useState } from 'react';
import { FAMILY_CONTACT_BY_PATIENT, familyAvatarPath, parseSenderGender } from '../data/chatFamily';

const FEMALE_COLORS = ['#C49A6C', '#BC8F8F', '#CD853F', '#D4A87C', '#DEB887'];
const MALE_COLORS = ['#64748b', '#475569', '#0d9488', '#2563eb', '#7A5C32'];

function getInitials(name: string): string {
  const parts = name.replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'FM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

interface Props {
  patientId: number;
  /** Optional override when message sender differs from default caregiver. */
  senderName?: string;
  size?: number;
  className?: string;
}

const FamilyAvatar: FC<Props> = ({ patientId, senderName, size = 28, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const contact = FAMILY_CONTACT_BY_PATIENT[patientId];
  const displayName = senderName ?? contact?.name ?? `Family ${patientId}`;
  const senderGender = senderName ? parseSenderGender(senderName) : null;
  const gender = senderGender ?? contact?.gender ?? 'F';
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const palette = gender === 'M' ? MALE_COLORS : FEMALE_COLORS;
  const bgColor = palette[patientId % palette.length];
  const sharedClass = `rounded-full object-cover flex-shrink-0 ${className}`;
  const sharedStyle = { width: size, height: size };

  if (imgFailed) {
    return (
      <div
        role="img"
        aria-label={displayName}
        className={`${sharedClass} flex items-center justify-center text-white font-bold select-none`}
        style={{ ...sharedStyle, backgroundColor: bgColor, fontSize: Math.max(8, Math.round(size * 0.34)) }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={familyAvatarPath(patientId)}
      alt={displayName}
      width={size}
      height={size}
      className={sharedClass}
      style={sharedStyle}
      loading="lazy"
      onError={() => setImgFailed(true)}
    />
  );
};

export default FamilyAvatar;
