import { type FC } from 'react';

const LOGO_ASPECT = 800 / 317;

/** Official YDCare brand mark — 800×317 PNG with transparency */
const YDCareLogo: FC<{ className?: string; height?: number }> = ({ className = '', height = 44 }) => (
  <img
    src="/ydcare-logo.png"
    alt="YDCare 易得康 NF GROUP"
    width={Math.round(height * LOGO_ASPECT)}
    height={height}
    decoding="async"
    draggable={false}
    className={`block select-none ${className}`}
    style={{ width: Math.round(height * LOGO_ASPECT), height }}
  />
);

export default YDCareLogo;
