// Gen-Z minimal palette (superseding the earlier dusty-rose "editorial"
// theme, by explicit user request): crisp white base, near-black text, and a
// single vivid indigo-violet accent — clean, high-contrast, app-native
// rather than decorative. Every screen reads colors exclusively through
// these tokens, so this file is the single place that changes the app's
// whole visual identity.

export type ThemeTokens = {
  bg: string; surface: string; text: string; muted: string; mutedFaint: string;
  accent: string; accentSoft: string; accentDeep: string;
  navy: string; navySoft: string; navyLight: string;
  border: string; track: string; navBg: string;
  shadowCard: string; shadowSm: string;
  btnBg: string; btnText: string;
  btnSecondaryBg: string; btnSecondaryText: string;
  success: string; successSoft: string;
  warning: string; warningSoft: string;
  error: string; errorSoft: string;
  info: string; infoSoft: string;
};

export const darkTheme: ThemeTokens = {
  bg: '#0D0C11', surface: '#16151C', text: '#F5F3FA', muted: '#9A96AC', mutedFaint: '#57536A',
  accent: '#A78BFA', accentSoft: 'rgba(167,139,250,0.16)', accentDeep: '#A78BFA',
  navy: '#232030', navySoft: '#2C2838', navyLight: '#F5F3FA',
  border: '#232030', track: '#1E1B27', navBg: 'rgba(13,12,17,0.88)',
  shadowCard: '0 10px 28px rgba(0,0,0,0.5)', shadowSm: '0 4px 14px rgba(0,0,0,0.4)',
  btnBg: '#A78BFA', btnText: '#0D0C11',
  btnSecondaryBg: '#232030', btnSecondaryText: '#F5F3FA',
  success: '#4ADE9A', successSoft: 'rgba(74,222,154,0.16)',
  warning: '#FBBF5C', warningSoft: 'rgba(251,191,92,0.16)',
  error: '#FF7B93', errorSoft: 'rgba(255,123,147,0.16)',
  info: '#7DA6FF', infoSoft: 'rgba(125,166,255,0.16)',
};

export const lightTheme: ThemeTokens = {
  bg: '#F7F6FB', surface: '#FFFFFF', text: '#16151A', muted: '#8D8A99', mutedFaint: '#C7C4D1',
  accent: '#7C5CFC', accentSoft: '#F1EDFF', accentDeep: '#5B3DF0',
  navy: '#16151A', navySoft: '#332F44', navyLight: '#FFFFFF',
  border: '#ECEAF3', track: '#F1EFF7', navBg: 'rgba(255,255,255,0.88)',
  shadowCard: '0 10px 30px rgba(70,50,150,0.08)', shadowSm: '0 4px 14px rgba(70,50,150,0.06)',
  btnBg: '#7C5CFC', btnText: '#FFFFFF',
  btnSecondaryBg: '#16151A', btnSecondaryText: '#FFFFFF',
  success: '#21C48A', successSoft: '#E3FBF1',
  warning: '#F5A623', warningSoft: '#FFF3DF',
  error: '#FF5C7A', errorSoft: '#FFE7EC',
  info: '#4D8DFF', infoSoft: '#E8F0FF',
};

export function getTheme(dark: boolean): ThemeTokens {
  return dark ? darkTheme : lightTheme;
}
