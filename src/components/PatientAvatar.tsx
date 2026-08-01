import { type FC, useMemo, useState } from 'react';
import { PATIENTS_FULL } from '../data/patients';

const AVATAR_COLORS = [
  '#006F80', '#2563eb', '#7c3aed', '#db2777', '#ea580c',
  '#ca8a04', '#059669', '#0891b2', '#4f46e5', '#be123c',
  '#0f766e', '#1d4ed8', '#6d28d9', '#c026d3', '#d97706',
  '#15803d', '#0369a1', '#4338ca',
];

function getSrc(patientId: number): string {
  return `/avatars/patient-${patientId}.png`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getColorForPatient(patientId: number, name: string): string {
  const seed = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), patientId * 17);
  return AVATAR_COLORS[Math.abs(seed) % AVATAR_COLORS.length];
}

interface Props {
  patientId: number;
  size?: number;
  className?: string;
}

const PatientAvatar: FC<Props> = ({ patientId, size = 40, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  const patient = useMemo(
    () => PATIENTS_FULL.find(p => p.id === patientId),
    [patientId],
  );

  const displayName = patient?.name ?? `Patient ${patientId}`;
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const bgColor = useMemo(
    () => getColorForPatient(patientId, displayName),
    [patientId, displayName],
  );

  const sharedClass = `rounded-full object-cover flex-shrink-0 ${className}`;
  const sharedStyle = { width: size, height: size };

  if (imgFailed) {
    return (
      <div
        role="img"
        aria-label={displayName}
        className={`${sharedClass} flex items-center justify-center text-white font-bold select-none`}
        style={{ ...sharedStyle, backgroundColor: bgColor, fontSize: Math.max(10, Math.round(size * 0.34)) }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={getSrc(patientId)}
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

export default PatientAvatar;
