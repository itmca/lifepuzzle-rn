import { LocalStorage, ValueType } from './local-storage.service';

const TEST_KEY = 'test-key';

test('LocalStorage는 string을 넣고 뺄 수 있다.', () => {
  const STRING_VALUE = 'string-value';
  LocalStorage.set(TEST_KEY, STRING_VALUE);

  const value = LocalStorage.get(TEST_KEY, 'string');

  expect(value).toBe(STRING_VALUE);
});

test.each([-9999, -10, -1, 0, 1, 10, 9999])(
  'LocalStorage는 숫자(+,-,0)를 넣고 뺄 수 있다.',
  numberValue => {
    LocalStorage.set(TEST_KEY, numberValue);

    const value = LocalStorage.get(TEST_KEY, 'number');

    expect(value).toBe(numberValue);
  },
);

test.each([true, false])(
  'LocalStorage는 boolean을 넣고 뺄 수 있다.',
  boolValue => {
    LocalStorage.set(TEST_KEY, boolValue);

    const value = LocalStorage.get(TEST_KEY, 'boolean');

    expect(value).toBe(boolValue);
  },
);

test('LocalStorage는 json을 넣고 뺄 수 있다.', () => {
  LocalStorage.set(
    TEST_KEY,
    JSON.stringify({
      str: 'string-value',
      numeric: 1.2,
      integer: 1,
      boolean: true,
    }),
  );

  const value = LocalStorage.get(TEST_KEY, 'json');

  expect(value).toStrictEqual({
    str: 'string-value',
    numeric: 1.2,
    integer: 1,
    boolean: true,
  });
});

test.each(['string', 'number', 'boolean', 'json'])(
  '키가 저장이 안되어 있을 때는 undefined를 반환한다',
  valueType => {
    // given
    const notStoredKey = 'not-stored-key';

    // when
    const value = LocalStorage.get(notStoredKey, <ValueType>valueType);

    // then
    expect(value).toBeUndefined();
  },
);

test.each([
  ['{"test":1}', 'json'],
  ['string-value', 'string'],
  [1234, 'number'],
  [true, 'boolean'],
])(
  'delete 후에는 동일한 키로 조회 시 undefined를 반환한다',
  (value, valueType) => {
    // given
    const deleteKey = 'delete-key';
    LocalStorage.set(deleteKey, value);

    // when
    const findValue = LocalStorage.get(deleteKey, <ValueType>valueType);

    // then
    expect(findValue).not.toBeUndefined();
  },
);
