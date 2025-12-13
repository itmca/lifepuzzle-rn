import { useEffect, useRef } from 'react';
import logger from '../logger.util';

/**
 * 컴포넌트 렌더링을 추적하는 Hook
 *
 * @example
 * ```typescript
 * const HomePage = () => {
 *   useRenderLog('HomePage', { hero, galleryCount: gallery?.length });
 *   // ...
 * };
 * ```
 *
 * @param componentName - 컴포넌트 이름
 * @param props - 추적할 props/state (선택사항)
 */
export const useRenderLog = (
  componentName: string,
  props?: Record<string, any>,
) => {
  const renderCount = useRef<number>(0);
  const prevProps = useRef<Record<string, any> | undefined>(undefined);

  renderCount.current += 1;

  useEffect(() => {
    // Props 변경사항 감지
    const changedProps: string[] = [];
    if (props && prevProps.current) {
      Object.keys(props).forEach(key => {
        if (props[key] !== prevProps.current?.[key]) {
          changedProps.push(key);
        }
      });
    }

    // 렌더링 로그 출력
    const logMessage = [
      `[RENDER #${renderCount.current}]`,
      componentName,
      changedProps.length > 0 ? `(changed: ${changedProps.join(', ')})` : '',
    ]
      .filter(Boolean)
      .join(' ');

    logger.debug(logMessage, props || {});

    // Props 저장
    if (props) {
      prevProps.current = props;
    }
  });
};

/**
 * 컴포넌트 마운트/언마운트를 추적하는 Hook
 *
 * @example
 * ```typescript
 * const Gallery = () => {
 *   useLifecycleLog('Gallery');
 *   // ...
 * };
 * ```
 */
export const useLifecycleLog = (componentName: string) => {
  useEffect(() => {
    logger.debug(`[MOUNT] ${componentName}`);

    return () => {
      logger.debug(`[UNMOUNT] ${componentName}`);
    };
  }, [componentName]);
};

/**
 * 특정 값의 변경을 추적하는 Hook
 *
 * @example
 * ```typescript
 * useWhyDidYouUpdate('HomePage', { hero, gallery, selectedTag });
 * ```
 */
export const useWhyDidYouUpdate = (
  name: string,
  props: Record<string, any>,
) => {
  const previousProps = useRef<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach(key => {
        if (previousProps.current?.[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current?.[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        logger.debug(`[WHY-UPDATE] ${name}`, changedProps);
      }
    }

    previousProps.current = props;
  }, [name, props]);
};

/**
 * 렌더링 성능을 측정하는 Hook
 *
 * @example
 * ```typescript
 * const HomePage = () => {
 *   useRenderPerformance('HomePage');
 *   // ...
 * };
 * ```
 */
export const useRenderPerformance = (componentName: string) => {
  const startTime = useRef<number | undefined>(undefined);
  const renderCount = useRef<number>(0);

  // 렌더링 시작 시간 기록
  startTime.current = performance.now();

  useEffect(() => {
    if (startTime.current) {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;

      renderCount.current += 1;

      // 렌더링 시간이 16ms (60fps) 이상이면 경고
      if (renderTime > 16) {
        logger.warn(
          `[SLOW-RENDER #${renderCount.current}] ${componentName}: ${renderTime.toFixed(2)}ms`,
        );
      } else {
        logger.debug(
          `[RENDER-TIME #${renderCount.current}] ${componentName}: ${renderTime.toFixed(2)}ms`,
        );
      }
    }
  }, [componentName]);
};
