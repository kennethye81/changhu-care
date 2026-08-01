import { useState, type FC } from 'react';
import { resolveStaffAvatarPath, staffInitials } from '../data/avatarRegistry';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

const StaffAvatar: FC<Props> = ({ name, size = 56, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const src = resolveStaffAvatarPath(name);
  const initials = staffInitials(name);

  if (!src || failed) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-[#4DCEFF] to-[#0B3550] flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(10, size * 0.32) }}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full object-cover flex-shrink-0 bg-[#FFFFFF] ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
};

export default StaffAvatar;
