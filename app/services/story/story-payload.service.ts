import { AUDIO_TYPE } from '../../constants/upload-file-type.constant.ts';
import { WritingStoryType } from '../../types/core/writing-story.type.ts';
import { HeroType } from '../../types/core/hero.type.ts';
import { PayloadBuilder } from '../../utils/payload-builder.util.ts';

const addVoice = (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
): void => {
  if (writingStory?.voice) {
    PayloadBuilder.addVoiceToFormData(
      formData,
      'voice',
      writingStory.voice,
      AUDIO_TYPE,
    );
  }
};

const addStoryData = (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
  hero: HeroType,
): void => {
  const story = {
    heroId: hero.id,
    title: writingStory?.title,
    content: writingStory?.content,
    date: writingStory?.date || new Date(),
    galleryIds: writingStory?.gallery?.map(item => item.id),
  };

  PayloadBuilder.addJsonToFormData(formData, 'story', story);
};

export const StoryPayloadService = {
  createStoryFormData(
    writingStory: WritingStoryType | undefined,
    currentHero: HeroType,
  ): FormData {
    const formData = PayloadBuilder.createFormData();

    addVoice(formData, writingStory);
    addStoryData(formData, writingStory, currentHero);

    return formData;
  },
} as const;
