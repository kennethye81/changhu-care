/** Map device model → public image path */
export const DEVICE_IMAGE_BY_MODEL: Record<string, string> = {
  'Omron HEM-7361T': '/devices/omron-hem-7361t.png',
  'Nonin Bluetooth 3230': '/devices/nonin-3230.png',
  'Braun BNT400 Bluetooth': '/devices/braun-bnt400.png',
  'SenseLife Pro': '/devices/senselife-pro.png',
  'Accu-Chek Guide': '/devices/accu-chek-guide.png',
  'Philips EverFlo': '/devices/philips-everflo.png',
  'Baxter Sigma Spectrum IQ': '/devices/baxter-sigma-spectrum.webp',
  'FoleyConnect UO-200': '/devices/foleyconnect-uo-200.webp',
  'Omron HN-290T': '/devices/omron-hn-290t.png',
  'MolecuLight i:X': '/devices/moleculight-ix.webp',
  'Roche CoaguChek INRange': '/devices/coaguchek-inrange.webp',
  'Abbott i-STAT Alinity': '/devices/poct-terminal.png',
  'KardiaMobile 6L': '/devices/kardiamobile-6l.webp',
  'GaitKeeper Pro': '/devices/gaitkeeper-pro.webp',
  'ResMed AirSense 11 AutoSet': '/devices/resmed-airsense-11.webp',
  'Abbott i-STAT CG4+': '/devices/poct-terminal.png',
  // 沈国栋 IoT 设备 — Fal.ai 生成
  '智能守护 S2': '/devices/fall-bracelet.png',
  '欧姆龙 HEM-7361T': '/devices/bp-monitor.png',
  '迈德康 防压疮型': '/devices/air-mattress.png',
  '鱼跃 YX301': '/devices/oximeter.png',
  '欧姆龙 MC-682': '/devices/thermometer.png',
  '康护通 CallBell S1': '/devices/call-bell.png',
};

export function deviceImageUrl(model: string): string | undefined {
  const webp = DEVICE_IMAGE_BY_MODEL[model];
  if (!webp) return undefined;
  return webp;
}

/** Prefer webp; UI may fall back to .svg via onError handler */
export function deviceImageFallbackSvg(model: string): string | undefined {
  const image = DEVICE_IMAGE_BY_MODEL[model];
  if (!image) return undefined;
  return image.replace(/\.(webp|png|jpe?g)$/i, '.svg');
}

export function modelToSlug(model: string): string {
  return model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
