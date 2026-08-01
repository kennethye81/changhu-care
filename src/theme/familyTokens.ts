/** Shared Family / Hub gold palette — matches FamilyApp inline tokens */
export const FAMILY = {
  primary: '#06B0EF',
  primaryHover: '#FEB903',
  secondary: '#0095D3',
  deep: '#0B3550',
  light: '#99E7FF',
  accent: '#FEB903',
  cream: '#FFFFFF',
  creamMid: '#EBF5F9',
  border: '#E1FCFF',
} as const;

export const FAMILY_GRADIENT = {
  hero: 'from-[#06B0EF] to-[#0095D3]',
  section: 'from-[#0095D3] to-[#0B3550]',
  progress: 'from-[#99E7FF] to-[#06B0EF]',
} as const;

/** Tailwind class bundles shared by Family + Elite mobile apps */
export const FAMILY_CLASS = {
  textPrimary: 'text-[#06B0EF]',
  textSecondary: 'text-[#0095D3]',
  textDeep: 'text-[#0B3550]',
  bgPrimary: 'bg-[#06B0EF]',
  bgPrimaryHover: 'hover:bg-[#FEB903]',
  bgCream: 'bg-[#FFFFFF]',
  bgCreamMid: 'bg-[#EBF5F9]',
  borderGold: 'border-[#E1FCFF]',
  heroGradient: `bg-gradient-to-r ${FAMILY_GRADIENT.hero}`,
  sectionGradient: `bg-gradient-to-r ${FAMILY_GRADIENT.section}`,
  progressGradient: `bg-gradient-to-r ${FAMILY_GRADIENT.progress}`,
} as const;
