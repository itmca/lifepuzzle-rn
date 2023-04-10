import {parseISO} from 'date-fns';

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(Z)?$/;
const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

export function isDateFormat(value: any): boolean {
  return value && typeof value === 'string' && dateFormat.test(value);
}

export function convertDateStringToDate(obj: any) {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (isIsoDateString(value)) {
      obj[key] = parseISO(value);
    } else if (isDateFormat(value)) {
      obj[key] = new Date(value);
    } else if (typeof value === 'object') {
      convertDateStringToDate(value);
    }
  }

  return obj;
}
