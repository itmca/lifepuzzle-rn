import { useCallback } from 'react';
import { useStoryContentUpsert } from '../../../../services/story/story.mutation';
import {
  showErrorToast,
  showToast,
} from '../../../../components/ui/feedback/Toast';
import { logger } from '../../../../utils/logger.util';
import { GalleryType } from '../../../../types/core/media.type';
import { HeroType } from '../../../../types/core/hero.type';
import { StoryModelService } from '../../../../services/story/story-model.service';
import { useMediaStore } from '../../../../stores/media.store';

type UseStoryContentParams = {
  currentGalleryItem: GalleryType | undefined;
  currentHero: HeroType | undefined | null;
  content: string;
  onSaveSuccess?: (storyKey: string) => void;
};

type UseStoryContentReturn = {
  handleSave: () => void;
  isSaving: boolean;
};

/**
 * Story 텍스트 내용 저장 로직을 관리하는 Custom Hook
 *
 * @description
 * StoryDetailPage에서 텍스트 저장 로직을 분리하여
 * 코드 응집도를 높이고 재사용 가능하도록 구현
 *
 * @example
 * const { handleSave, isSaving } = useStoryContent({
 *   currentGalleryItem,
 *   currentHero,
 *   content,
 *   onSaveSuccess: (storyKey) => {
 *     removeDraft(currentGalleryItem.id);
 *     setEditingGalleryId(null);
 *   },
 * });
 */
export const useStoryContent = ({
  currentGalleryItem,
  currentHero,
  content,
  onSaveSuccess,
}: UseStoryContentParams): UseStoryContentReturn => {
  const updateGalleryStory = useMediaStore(state => state.updateGalleryStory);

  // Story Content Upsert API
  const { saveContent, isSaving } = useStoryContentUpsert({
    onSuccess: storyKey => {
      // Gallery store 업데이트
      const updatedStory = StoryModelService.createFromGallery(
        storyKey,
        content,
        currentGalleryItem!,
        currentHero!,
      );

      updateGalleryStory(currentGalleryItem!.id, updatedStory);

      // 성공 토스트
      showToast(
        currentGalleryItem?.story?.id
          ? '이야기가 수정되었습니다'
          : '이야기가 저장되었습니다',
      );

      // 외부 콜백 실행
      onSaveSuccess?.(storyKey);
    },
    onError: message => {
      showErrorToast(message);
    },
  });

  /**
   * Story 텍스트 저장 핸들러
   */
  const handleSave = useCallback(() => {
    if (!currentHero || !currentGalleryItem) {
      logger.error('handleSave: Missing required data', {
        hasHero: !!currentHero,
        hasGalleryItem: !!currentGalleryItem,
      });
      showErrorToast('저장할 수 없습니다');
      return;
    }
    saveContent(currentHero.id, currentGalleryItem.id, content);
  }, [currentHero, currentGalleryItem, content, saveContent]);

  return {
    handleSave,
    isSaving,
  };
};
