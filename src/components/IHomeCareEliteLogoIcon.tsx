import { type FC } from 'react';
import {
  IHOMEcare_HOUSE_PATH,
  IHOMEcare_LOGO_STROKE_WIDTH,
  IHOMEcare_LOGO_VIEWBOX,
} from './iHomeCareLogoHouse';

/** iHomeCare Elite brand mark — platform house with Star of Life inside (white stroke). */
const STAR_ANGLES = [0, 60, 120, 180, 240, 300] as const;
const STAR_CX = 12;
const STAR_CY = 13.5;
const STAR_INNER = 1.1;
const STAR_OUTER = 4.6;

const IHomeCareEliteLogoIcon: FC<{ size?: number; className?: string; stroke?: string }> = ({
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
    {STAR_ANGLES.map(deg => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return (
        <line
          key={deg}
          x1={STAR_CX + Math.cos(rad) * STAR_INNER}
          y1={STAR_CY + Math.sin(rad) * STAR_INNER}
          x2={STAR_CX + Math.cos(rad) * STAR_OUTER}
          y2={STAR_CY + Math.sin(rad) * STAR_OUTER}
        />
      );
    })}
  </svg>
);

export default IHomeCareEliteLogoIcon;
