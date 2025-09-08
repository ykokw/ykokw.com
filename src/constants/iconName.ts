// NOTE: icon names must be sorted alphabetically
const iconNames = [
  "calendar_today",
  "open_in_new",
  "tag",
] as const;
// icon names must be unique
export const iconNameSet = new Set(iconNames);

export type IconName = typeof iconNames[number];
