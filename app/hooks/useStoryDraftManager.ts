import { useCallback, useState } from 'react';
import { GalleryType } from '../types/core/media.type';

/**
 * Story draft 상태 관리를 위한 custom hook
 *
 * 사용자가 작성 중인 story content를 임시 저장(draft)하고 관리합니다.
 * 갤러리 아이템 전환 시 작성 중이던 내용을 보존하고 복원할 수 있습니다.
 *
 * @example
 * const { content, setContent, saveDraft, loadContentForGallery, removeDraft } = useStoryDraftManager();
 *
 * // 갤러리 아이템 변경 시
 * const { content: loadedContent, isEditing } = loadContentForGallery(newGalleryItem);
 * setContent(loadedContent);
 */
export const useStoryDraftManager = () => {
  const [draftContents, setDraftContents] = useState<Map<number, string>>(
    new Map(),
  );
  const [content, setContent] = useState<string>('');

  /**
   * Draft 저장
   * @param galleryId 갤러리 아이템 ID
   * @param content 저장할 content
   */
  const saveDraft = useCallback((galleryId: number, content: string) => {
    setDraftContents(prev => {
      const next = new Map(prev);
      next.set(galleryId, content);
      return next;
    });
  }, []);

  /**
   * Draft 제거
   * @param galleryId 갤러리 아이템 ID
   */
  const removeDraft = useCallback((galleryId: number) => {
    setDraftContents(prev => {
      const next = new Map(prev);
      next.delete(galleryId);
      return next;
    });
  }, []);

  /**
   * 갤러리 아이템에 맞는 content 로드
   *
   * 우선순위:
   * 1. Draft content (작성 중이던 내용)
   * 2. Saved content (저장된 story)
   * 3. 빈 문자열 (새로 작성)
   *
   * @param galleryItem 로드할 갤러리 아이템
   * @returns content와 편집 모드 여부
   */
  const loadContentForGallery = useCallback(
    (galleryItem: GalleryType) => {
      const draftContent = draftContents.get(galleryItem.id);
      const savedContent = galleryItem.story?.content;

      if (draftContent !== undefined) {
        // Draft가 있으면 draft 사용하고 editing 모드로
        return { content: draftContent, isEditing: true };
      } else if (savedContent) {
        // 저장된 content가 있으면 사용하고 viewing 모드로
        return { content: savedContent, isEditing: false };
      } else {
        // 둘 다 없으면 빈 content로 editing 모드
        return { content: '', isEditing: true };
      }
    },
    [draftContents],
  );

  /**
   * 현재 갤러리 아이템의 변경사항이 있는지 확인
   * @param galleryId 갤러리 아이템 ID
   * @param currentContent 현재 content
   * @param savedContent 저장된 content
   * @returns 변경사항 여부
   */
  const hasChanges = useCallback(
    (galleryId: number, currentContent: string, savedContent?: string) => {
      return currentContent !== (savedContent ?? '');
    },
    [],
  );

  return {
    draftContents,
    content,
    setContent,
    saveDraft,
    removeDraft,
    loadContentForGallery,
    hasChanges,
  };
};
