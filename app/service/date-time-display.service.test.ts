import {toMinuteSeconds} from './date-time-display.service.ts';

test.each([1, 11, 21, 31, 41, 59])(
  '60초 미만의 숫자가 주어지는 경우에도 00:으로 시작한다.',
  seconds => {
    const minuteSeconds = toMinuteSeconds(seconds);

    expect(minuteSeconds).toMatch(/^00:\d+/);
  },
);

test.each([60, 120, 180, 600, 1200, 6000])(
  '60의 배수가 주어지면 초는 00으로 표시된다.',
  seconds => {
    const minuteSeconds = toMinuteSeconds(seconds);

    expect(minuteSeconds).toMatch(/^\d+:00$/);
  },
);

test.each([
  [1, '00:01'],
  [12, '00:12'],
  [65, '01:05'],
  [754, '12:34'],
  [3599, '59:59'],
  [3600, '60:00'],
  [3943, '65:43'],
  [5999, '99:59'],
])('최소 99분 까지는 분초로 정상 변환한다.', (seconds, expected) => {
  const minuteSeconds = toMinuteSeconds(seconds);

  expect(minuteSeconds).toBe(expected);
});
