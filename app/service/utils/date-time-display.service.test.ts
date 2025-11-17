import { toInternationalAge, toMmSs } from './date-time.service';

test.each([1, 11, 21, 31, 41, 59])(
  '60초 미만의 숫자가 주어지는 경우에도 00:으로 시작한다.',
  seconds => {
    const minuteSeconds = toMmSs(seconds);

    expect(minuteSeconds).toMatch(/^00:\d+/);
  },
);

test.each([60, 120, 180, 600, 1200, 6000])(
  '60의 배수가 주어지면 초는 00으로 표시된다.',
  seconds => {
    const minuteSeconds = toMmSs(seconds);

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
])(
  '최소 99분 까지는 분초로 정상 변환한다.',
  (seconds: number, expected: string) => {
    const minuteSeconds = toMmSs(seconds);

    expect(minuteSeconds).toBe(expected);
  },
);

describe('toInternationalAge', () => {
  const mockCurrentDate = (year: number, month: number, day: number) => {
    jest.useFakeTimers().setSystemTime(new Date(year, month - 1, day));
  };

  afterEach(() => {
    jest.useRealTimers(); // 테스트마다 원래 시간으로 복원
  });

  it('생일이 이미 지난 경우 정확한 나이를 반환한다', () => {
    mockCurrentDate(2025, 5, 17); // 현재 날짜: 2025-05-17
    const birthDate = new Date(2000, 4, 16); // 생일: 2000-05-16
    expect(toInternationalAge(birthDate)).toBe(25);
  });

  it('생일이 오늘인 경우 정확한 나이를 반환한다', () => {
    mockCurrentDate(2025, 5, 17);
    const birthDate = new Date(2000, 4, 17); // 생일: 2000-05-17
    expect(toInternationalAge(birthDate)).toBe(25);
  });

  it('생일이 아직 안 지난 경우 나이에서 1을 뺀 값을 반환한다', () => {
    mockCurrentDate(2025, 5, 17);
    const birthDate = new Date(2000, 4, 18); // 생일: 2000-05-18
    expect(toInternationalAge(birthDate)).toBe(24);
  });

  it('태어난 해가 올해인 경우 0세를 반환한다', () => {
    mockCurrentDate(2025, 5, 17);
    const birthDate = new Date(2025, 0, 1);
    expect(toInternationalAge(birthDate)).toBe(0);
  });
});
