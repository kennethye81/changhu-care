import { type FC } from 'react';
import {
  IHOMEcare_HOUSE_PATH,
  IHOMEcare_LOGO_STROKE_WIDTH,
  IHOMEcare_LOGO_VIEWBOX,
} from './iHomeCareLogoHouse';

/** iHomeCare Hub brand mark — platform house with overlapping circles inside (white stroke). */
const IHomeCareHubLogoIcon: FC<{ size?: number; className?: string; stroke?: string }> = ({
  size = 40,
  className = '',
  stroke = 'white',
}) => (
  <svg
    width={size}
    height={size}
    viewBox={IHOMEcare_LOGO_VIEWBOX}
    fill="none"
    stroke={stroke}
    strokeWidth={IHOMEcare_LOGO_STROKE_WIDTH}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d={IHOMEcare_HOUSE_PATH} />
    <circle cx="10" cy="13.5" r="2.8" />
    <circle cx="14" cy="13.5" r="2.8" />
  </svg>
);

export default IHomeCareHubLogoIcon;
