import {useRecoilValue} from 'recoil';
import {writingStoryState} from '../../recoils/content/story.recoil';
import {AUDIO_TYPE} from '../../constants/upload-file-type.constant';
import {WritingStoryType} from '../../types/writing-story.type';
import {HeroType} from '../../types/hero.type.ts';
import {heroState} from '../../recoils/content/hero.recoil.ts';

export const useStoryHttpPayLoad = () => {
  const formData = new FormData();
  const writingStory = useRecoilValue(writingStoryState);
  const currentHero = useRecoilValue<HeroType>(heroState);

  addVoiceToFormData(formData, writingStory);
  addJsonBodyToFormData(formData, writingStory, currentHero);

  return formData;
};

const addVoiceToFormData = function (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
) {
  if (writingStory?.voice === undefined) {
    return;
  }
  const voiceUrl = writingStory?.voice;

  const fileParts = voiceUrl.split('/');
  const recordName = fileParts[fileParts.length - 1];
  formData.append('voice', {
    uri: voiceUrl,
    type: AUDIO_TYPE,
    name: recordName,
  });
};

const addJsonBodyToFormData = function (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
  hero: HeroType,
) {
  const story = {
    heroId: hero.heroNo,
    title: writingStory?.title,
    content: writingStory?.content,
    date: writingStory?.date || new Date(),
    galleryIds: writingStory?.gallery?.map(item => item.id),
  };

  formData.append('story', {
    string: JSON.stringify(story),
    type: 'application/json',
  });
};
