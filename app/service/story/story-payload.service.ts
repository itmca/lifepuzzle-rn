import {AUDIO_TYPE} from '../../constants/upload-file-type.constant';
import {WritingStoryType} from '../../types/core/writing-story.type';
import {HeroType} from '../../types/core/hero.type';
import {PayloadBuilder} from '../utils/payload-builder.service';

export class StoryPayloadService {
  static createStoryFormData(
    writingStory: WritingStoryType | undefined,
    currentHero: HeroType,
  ): FormData {
    const formData = PayloadBuilder.createFormData();

    this.addVoice(formData, writingStory);
    this.addStoryData(formData, writingStory, currentHero);

    return formData;
  }

  private static addVoice(
    formData: FormData,
    writingStory: WritingStoryType | undefined,
  ): void {
    if (writingStory?.voice) {
      PayloadBuilder.addVoiceToFormData(
        formData,
        'voice',
        writingStory.voice,
        AUDIO_TYPE,
      );
    }
  }

  private static addStoryData(
    formData: FormData,
    writingStory: WritingStoryType | undefined,
    hero: HeroType,
  ): void {
    const story = {
      heroId: hero.heroNo,
      title: writingStory?.title,
      content: writingStory?.content,
      date: writingStory?.date || new Date(),
      galleryIds: writingStory?.gallery?.map(item => item.id),
    };

    PayloadBuilder.addJsonToFormData(formData, 'story', story);
  }
}
