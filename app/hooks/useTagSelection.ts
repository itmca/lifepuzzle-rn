import { useCallback, useEffect } from 'react';
import { TagType } from '../types/core/media.type';
import { useSelectionStore } from '../stores/selection.store';

type UseTagSelectionParams = {
  tags: TagType[];
  onTagChange?: (tag: TagType) => void;
};

type UseTagSelectionReturn = {
  selectedTag: TagType | null;
  handleTagPress: (index: number) => void;
};

/**
 * Gallery tag selection logic을 관리하는 custom hook
 *
 * 기능:
 * - Tag 유효성 검증 및 자동 초기화
 * - Tag press 핸들러 제공
 * - 선택된 tag 상태 관리
 */
export const useTagSelection = ({
  tags,
  onTagChange,
}: UseTagSelectionParams): UseTagSelectionReturn => {
  const { selectedTag, setSelectedTag } = useSelectionStore();

  // Validate and initialize selected tag
  useEffect(() => {
    if (!tags.length) {
      return;
    }

    const isSelectedValid = tags.some(tag => tag.key === selectedTag?.key);
    if (!isSelectedValid) {
      setSelectedTag({ ...tags[0] });
    }
  }, [tags, selectedTag?.key, setSelectedTag]);

  const handleTagPress = useCallback(
    (index: number) => {
      if (!tags?.[index]) {
        return;
      }
      const newTag = { ...tags[index] };
      setSelectedTag(newTag);
      onTagChange?.(newTag);
    },
    [setSelectedTag, tags, onTagChange],
  );

  return {
    selectedTag,
    handleTagPress,
  };
};
