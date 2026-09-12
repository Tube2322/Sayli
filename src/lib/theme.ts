// Ported verbatim from the original prototype (extracted/English Life.dc.html lines 874-898).
// Do not redesign — these are the exact tokens the approved screens were designed with.

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
  bg: '#10131F', surface: '#1B1F2D', text: '#F7F7FA', muted: '#A7A9B5', mutedFaint: '#747887',
  accent: '#F58BAB', accentSoft: 'rgba(245,139,171,0.16)', accentDeep: '#F58BAB',
  navy: '#343850', navySoft: '#3E4360', navyLight: '#F7F7FA',
  border: '#2A2F42', track: '#343850', navBg: 'rgba(16,19,31,0.88)',
  shadowCard: '0 10px 26px rgba(0,0,0,0.45)', shadowSm: '0 4px 12px rgba(0,0,0,0.4)',
  btnBg: '#F58BAB', btnText: '#10131F',
  btnSecondaryBg: '#343850', btnSecondaryText: '#F7F7FA',
  success: '#4CAF7D', successSoft: 'rgba(76,175,125,0.18)',
  warning: '#E7A83B', warningSoft: 'rgba(231,168,59,0.18)',
  error: '#E28893', errorSoft: 'rgba(226,136,147,0.16)',
  info: '#6B8FD6', infoSoft: 'rgba(107,143,214,0.18)',
};

export const lightTheme: ThemeTokens = {
  bg: '#FFF9FB', surface: '#FFFFFF', text: '#20243A', muted: '#7A7E90', mutedFaint: '#9A9DAC',
  accent: '#F47FA6', accentSoft: '#FCE7EF', accentDeep: '#D85F88',
  navy: '#20243A', navySoft: '#343850', navyLight: '#E9EBF4',
  border: '#E9EBF4', track: '#FCE7EF', navBg: 'rgba(255,255,255,0.88)',
  shadowCard: '0 10px 26px rgba(32,36,58,0.08)', shadowSm: '0 4px 12px rgba(32,36,58,0.08)',
  btnBg: '#F47FA6', btnText: '#FFFFFF',
  btnSecondaryBg: '#20243A', btnSecondaryText: '#FFFFFF',
  success: '#4CAF7D', successSoft: '#E8F6EF',
  warning: '#E7A83B', warningSoft: '#FFF4DC',
  error: '#D96C78', errorSoft: '#FCEBED',
  info: '#6B8FD6', infoSoft: '#EDF2FF',
};

export function getTheme(dark: boolean): ThemeTokens {
  return dark ? darkTheme : lightTheme;
}
