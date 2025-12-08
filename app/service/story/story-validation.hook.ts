import { Alert } from 'react-native';
import { WritingStoryType } from '../../types/core/writing-story.type';

export const useStoryValidation = () => {
  const validateStoryContent = (
    writingStory: WritingStoryType | undefined,
  ): boolean => {
    if (
      !writingStory?.title &&
      !writingStory?.content &&
      !writingStory?.voice
    ) {
      Alert.alert('제목, 글, 음성 중 하나는 입력되어야 합니다.');
      return false;
    }

    if (writingStory?.title && writingStory.title.length > 20) {
      Alert.alert('제목은 20자 이내로 입력해주세요.');
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
