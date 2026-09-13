// Redesigned palette (superseding the original prototype's bright-pink
// tokens, by explicit user request): warm ivory/charcoal base with a single
// refined dusty-rose accent — a quieter, more editorial "premium minimal"
// look. Every screen reads colors exclusively through these tokens, so this
// file is the single place that changes the app's whole visual identity.

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
  bg: '#161217', surface: '#221D23', text: '#F7F1EC', muted: '#AFA69C', mutedFaint: '#786F68',
  accent: '#E2A0AE', accentSoft: 'rgba(226,160,174,0.16)', accentDeep: '#E2A0AE',
  navy: '#3A323A', navySoft: '#453C45', navyLight: '#F7F1EC',
  border: '#332C33', track: '#3A323A', navBg: 'rgba(22,18,23,0.88)',
  shadowCard: '0 10px 28px rgba(0,0,0,0.5)', shadowSm: '0 4px 14px rgba(0,0,0,0.42)',
  btnBg: '#E2A0AE', btnText: '#161217',
  btnSecondaryBg: '#3A323A', btnSecondaryText: '#F7F1EC',
  success: '#67B694', successSoft: 'rgba(103,182,148,0.16)',
  warning: '#E0AE63', warningSoft: 'rgba(224,174,99,0.16)',
  error: '#E29199', errorSoft: 'rgba(226,145,153,0.16)',
  info: '#8FA9CC', infoSoft: 'rgba(143,169,204,0.16)',
};

export const lightTheme: ThemeTokens = {
  bg: '#FAF6F0', surface: '#FFFFFF', text: '#211D22', muted: '#8B8478', mutedFaint: '#B7AFA0',
  accent: '#B4667A', accentSoft: '#F3E3E6', accentDeep: '#8C4B5C',
  navy: '#211D22', navySoft: '#3A333B', navyLight: '#F3EFE9',
  border: '#ECE4D8', track: '#F1E6E2', navBg: 'rgba(255,255,255,0.88)',
  shadowCard: '0 10px 30px rgba(33,29,34,0.08)', shadowSm: '0 4px 14px rgba(33,29,34,0.06)',
  btnBg: '#B4667A', btnText: '#FFFFFF',
  btnSecondaryBg: '#211D22', btnSecondaryText: '#FAF6F0',
  success: '#4C9172', successSoft: '#E4F1EA',
  warning: '#C08A3E', warningSoft: '#F7EDDD',
  error: '#B85B62', errorSoft: '#F6E5E5',
  info: '#5E7FA6', infoSoft: '#E7EDF5',
};

export function getTheme(dark: boolean): ThemeTokens {
  return dark ? darkTheme : lightTheme;
}
