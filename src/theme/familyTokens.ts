/** Shared Family / Hub gold palette — matches FamilyApp inline tokens */
export const FAMILY = {
  primary: '#C49A6C',
  primaryHover: '#B8860B',
  secondary: '#9C7A4E',
  deep: '#7A5C32',
  light: '#D4A87C',
  accent: '#E8C97A',
  cream: '#FDF5E8',
  creamMid: '#F5E6D0',
  border: '#E8D5B8',
} as const;

export const FAMILY_GRADIENT = {
  hero: 'from-[#C49A6C] to-[#9C7A4E]',
  section: 'from-[#9C7A4E] to-[#7A5C32]',
  progress: 'from-[#D4A87C] to-[#C49A6C]',
} as const;

/** Tailwind class bundles shared by Family + Elite mobile apps */
export const FAMILY_CLASS = {
  textPrimary: 'text-[#C49A6C]',
  textSecondary: 'text-[#9C7A4E]',
  textDeep: 'text-[#7A5C32]',
  bgPrimary: 'bg-[#C49A6C]',
  bgPrimaryHover: 'hover:bg-[#B8860B]',
  bgCream: 'bg-[#FDF5E8]',
  bgCreamMid: 'bg-[#F5E6D0]',
  borderGold: 'border-[#E8D5B8]',
  heroGradient: `bg-gradient-to-r ${FAMILY_GRADIENT.hero}`,
  sectionGradient: `bg-gradient-to-r ${FAMILY_GRADIENT.section}`,
  progressGradient: `bg-gradient-to-r ${FAMILY_GRADIENT.progress}`,
} as const;
