import { SizeValue } from '../../types/ui/style.type';

export const formatSize = (
  value: SizeValue | undefined,
  defaultValue: string,
): string => {
  if (value === undefined) return defaultValue;
  if (typeof value === 'number') return `${value}px`;
  return value;
};
