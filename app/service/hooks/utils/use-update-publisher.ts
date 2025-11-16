import {useCallback} from 'react';

// 업데이트 이벤트 타입 정의
export type UpdateEventType =
  | 'heroUpdate'
  | 'storyUpdate'
  | 'userUpdate'
  | 'galleryUpdate';

// 간단한 이벤트 발행 시스템
class UpdatePublisher {
  private listeners: Map<UpdateEventType, Set<() => void>> = new Map();

  subscribe(event: UpdateEventType, callback: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  publish(event: UpdateEventType) {
    this.listeners.get(event)?.forEach(callback => callback());
  }
}

const updatePublisher = new UpdatePublisher();

/**
 * 업데이트 이벤트를 발행하는 Hook
 */
export const useUpdatePublisher = (eventType: UpdateEventType) => {
  const publish = useCallback(() => {
    updatePublisher.publish(eventType);
  }, [eventType]);

  return publish;
};

/**
 * 업데이트 이벤트를 구독하는 Hook
 */
export const useUpdateSubscriber = (
  eventType: UpdateEventType,
  callback: () => void,
) => {
  const subscribe = useCallback(() => {
    return updatePublisher.subscribe(eventType, callback);
  }, [eventType, callback]);

  return subscribe;
};
