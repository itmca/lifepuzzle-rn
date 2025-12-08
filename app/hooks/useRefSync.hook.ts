import { useEffect, useRef } from 'react';

/**
 * 값을 ref와 동기화하는 hook
 * 값이 변경될 때마다 ref.current를 업데이트합니다.
 * 이를 통해 최신 값을 참조하면서도 리렌더링을 트리거하지 않습니다.
 *
 * @template T 동기화할 값의 타입
 * @param value 동기화할 값
 * @returns 동기화된 ref
 *
 * @example
 * const onSuccessRef = useRefSync(onSuccess);
 * // onSuccessRef.current는 항상 최신 onSuccess를 참조
 */
export const useRefSync = <T>(value: T): React.MutableRefObject<T> => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};
