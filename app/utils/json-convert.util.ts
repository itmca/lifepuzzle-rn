import dayjs from 'dayjs';

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(Z)?$/;
const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDateString(value: unknown): value is string {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === 'string' &&
    isoDateFormat.test(value)
  );
}

export function isDateFormat(value: unknown): value is string {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === 'string' &&
    dateFormat.test(value)
  );
}

export function convertDateStringToDate<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  for (const key of Object.keys(obj) as (keyof T)[]) {
    const value = obj[key];
    if (isIsoDateString(value)) {
      (obj as any)[key] = dayjs(value).toDate();
    } else if (isDateFormat(value)) {
      (obj as any)[key] = new Date(value);
    } else if (typeof value === 'object' && value !== null) {
      convertDateStringToDate(value);
    }
  }

  return obj;
}
