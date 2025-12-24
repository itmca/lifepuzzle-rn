import { useCallback } from 'react';
import { useUpdateGalleryDateAndAge } from '../../../../services/gallery/gallery.mutation';
import {
  showErrorToast,
  showToast,
} from '../../../../components/ui/feedback/Toast';
import { logger } from '../../../../utils/logger.util';
import { GalleryType, AgeType } from '../../../../types/core/media.type';
import { useMediaStore } from '../../../../stores/media.store';

type UseStoryDateAgeParams = {
  currentGalleryItem: GalleryType | undefined;
};

type UseStoryDateAgeReturn = {
  handleDateAgeConfirm: (date: Date, ageGroup: AgeType) => Promise<void>;
  isUpdating: boolean;
};

/**
 * Gallery 날짜 및 나이대 업데이트 로직을 관리하는 Custom Hook
 *
 * @description
 * StoryDetailPage에서 날짜/나이대 업데이트 로직을 분리하여
 * 코드 응집도를 높이고 재사용 가능하도록 구현
 *
 * @example
 * const { handleDateAgeConfirm, isUpdating } = useStoryDateAge({
 *   currentGalleryItem,
 * });
 *
 * // 사용
 * await handleDateAgeConfirm(new Date(), 'BABY');
 */
export const useStoryDateAge = ({
  currentGalleryItem,
}: UseStoryDateAgeParams): UseStoryDateAgeReturn => {
  const updateGalleryDateAndTag = useMediaStore(
    state => state.updateGalleryDateAndTag,
  );

  // Gallery 날짜/나이대 업데이트 mutation
  const { updateDateAndAge, isPending: isUpdating } =
    useUpdateGalleryDateAndAge({
      onSuccess: () => {
        showToast('날짜 및 나이대가 변경되었습니다');
      },
      onError: message => {
        showErrorToast(message);
      },
    });

  /**
   * 날짜 및 나이대 확인 핸들러
   *
   * @description
   * 두 단계로 업데이트를 수행합니다:
   * 1. API 호출: 서버에 변경사항 저장
   * 2. 로컬 Store 업데이트: UI에 즉시 반영 (낙관적 업데이트)
   *
   * React Query가 자동으로 캐시를 무효화하므로 별도의 refetch는 불필요합니다.
   */
  const handleDateAgeConfirm = useCallback(
    async (date: Date, ageGroup: AgeType) => {
      if (!currentGalleryItem) {
        logger.warn('handleDateAgeConfirm: currentGalleryItem is null', {
          date,
          ageGroup,
        });
        return;
      }

      try {
        // API 호출: 서버에 날짜/나이대 업데이트
        await updateDateAndAge(currentGalleryItem.id, date, ageGroup);

        // 로컬 Store 즉시 업데이트 (낙관적 업데이트)
        // 사용자에게 즉각적인 UI 피드백 제공
        updateGalleryDateAndTag(currentGalleryItem.id, date, ageGroup);
      } catch (error) {
        // Error 토스트는 mutation hook에서 이미 표시됨
        logger.error('Failed to update date and age', {
          error,
          galleryId: currentGalleryItem.id,
          date,
          ageGroup,
        });
      }
    },
    [currentGalleryItem, updateDateAndAge, updateGalleryDateAndTag],
  );

  return {
    handleDateAgeConfirm,
    isUpdating,
  };
};
