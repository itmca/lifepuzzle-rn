import { useCallback } from 'react';
import {
  useStoryVoiceUpsert,
  useStoryVoiceDelete,
} from '../../../../services/story/story.mutation';
import {
  showErrorToast,
  showToast,
} from '../../../../components/ui/feedback/Toast';
import { logger } from '../../../../utils/logger.util';
import { GalleryType } from '../../../../types/core/media.type';
import { HeroType } from '../../../../types/core/hero.type';

type UseStoryVoiceParams = {
  currentGalleryItem: GalleryType | undefined;
  currentHero: HeroType | undefined;
};

type UseStoryVoiceReturn = {
  handleVoiceSave: (voiceUri: string) => void;
  handleVoiceDelete: () => void;
  isVoiceLoading: boolean;
};

/**
 * 음성 녹음 관련 로직을 관리하는 Custom Hook
 *
 * @description
 * StoryDetailPage에서 음성 저장/삭제 로직을 분리하여
 * 코드 응집도를 높이고 재사용 가능하도록 구현
 *
 * @example
 * const { handleVoiceSave, handleVoiceDelete, isVoiceLoading } =
 *   useStoryVoice({
 *     currentGalleryItem,
 *     currentHero,
 *   });
 */
export const useStoryVoice = ({
  currentGalleryItem,
  currentHero,
}: UseStoryVoiceParams): UseStoryVoiceReturn => {
  // Story Voice Upsert API
  const { saveVoice, isSaving } = useStoryVoiceUpsert({
    onSuccess: () => {
      showToast('음성이 저장되었습니다');
    },
    onError: message => {
      showErrorToast(message);
    },
  });

  // Story Voice Delete API
  const { deleteVoice, isDeleting } = useStoryVoiceDelete({
    onSuccess: () => {
      showToast('음성이 삭제되었습니다');
    },
    onError: message => {
      showErrorToast(message);
    },
  });

  /**
   * 음성 저장 핸들러
   */
  const handleVoiceSave = useCallback(
    (voiceUri: string) => {
      if (!currentHero || !currentGalleryItem) {
        logger.error('handleVoiceSave: Missing required data', {
          hasHero: !!currentHero,
          hasGalleryItem: !!currentGalleryItem,
          voiceUri,
        });
        showErrorToast('저장할 수 없습니다');
        return;
      }
      saveVoice(currentHero.id, currentGalleryItem.id, voiceUri);
    },
    [currentHero, currentGalleryItem, saveVoice],
  );

  /**
   * 음성 삭제 핸들러
   */
  const handleVoiceDelete = useCallback(() => {
    if (!currentHero || !currentGalleryItem) {
      logger.error('handleVoiceDelete: Missing required data', {
        hasHero: !!currentHero,
        hasGalleryItem: !!currentGalleryItem,
      });
      showErrorToast('삭제할 수 없습니다');
      return;
    }
    deleteVoice(currentHero.id, currentGalleryItem.id);
  }, [currentHero, currentGalleryItem, deleteVoice]);

  return {
    handleVoiceSave,
    handleVoiceDelete,
    isVoiceLoading: isSaving || isDeleting,
  };
};
