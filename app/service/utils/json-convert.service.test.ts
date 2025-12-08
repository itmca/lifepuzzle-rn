import { isDateFormat, isIsoDateString } from './json-convert.service';

test('date 판단 테스트', () => {
  expect(isDateFormat('1970-01-01')).toBe(true);
  expect(isDateFormat('2022-04-05')).toBe(true);
  expect(isDateFormat('2022-04-05abc')).toBe(false);
});

test('isIsoDateString 판단 테스트', () => {
  expect(isIsoDateString('1969-12-31T15:00:00.000')).toBe(true);
  expect(isIsoDateString('1969-12-31T15:00:00.000Z')).toBe(true);
});
