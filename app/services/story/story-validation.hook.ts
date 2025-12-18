import { Alert } from 'react-native';
import { WritingStoryType } from '../../types/core/writing-story.type.ts';

export const useStoryValidation = () => {
  const validateStoryContent = (
    writingStory: WritingStoryType | undefined,
  ): boolean => {
    if (!writingStory?.content && !writingStory?.voice) {
      Alert.alert('글, 음성 중 하나는 입력되어야 합니다.');
      return false;
    }

    if (writingStory?.content && writingStory.content.length > 1000) {
      Alert.alert('내용은 1000자 이내로 입력해주세요.');
      return false;
    }

    return true;
  };

  return {
    validateStoryContent,
  };
};
