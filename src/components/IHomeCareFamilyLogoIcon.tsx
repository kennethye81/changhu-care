import { type FC } from 'react';
import {
  IHOMEcare_HOUSE_PATH,
  IHOMEcare_LOGO_STROKE_WIDTH,
  IHOMEcare_LOGO_VIEWBOX,
} from './iHomeCareLogoHouse';

const HEART_PATH =
  'M12 17.8C9 14.5 7.2 12.8 7.2 10.8C7.2 9 8.8 8 10.5 8.6C11.3 8.9 12 9.8 12 9.8C12 9.8 12.7 8.9 13.5 8.6C15.2 8 16.8 9 16.8 10.8C16.8 12.8 15 14.5 12 17.8Z';

/** iHomeCare Family brand mark — platform house with heart inside (white stroke). */
const IHomeCareFamilyLogoIcon: FC<{ size?: number; className?: string; stroke?: string }> = ({
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
    <path d={HEART_PATH} />
  </svg>
);

export default IHomeCareFamilyLogoIcon;
