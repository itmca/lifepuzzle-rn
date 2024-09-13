import {useRecoilValue} from 'recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {
  AUDIO_TYPE,
  IMG_TYPE,
  VIDEO_TYPE,
} from '../../constants/upload-file-type.constant';
import {WritingStoryType} from '../../types/writing-story.type';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';

export const useStoryHttpPayLoad = () => {
  const formData = new FormData();
  const hero = useRecoilValue(heroState);
  const writingStory = useRecoilValue(writingStoryState);

  addImagesInFormData(formData, writingStory);
  addVoiceInFormData(formData, writingStory);
  addStoryinfoInFormData(formData, hero, writingStory);

  return formData;
};
export const useVoiceHttpPayLoad = () => {
  const formData = new FormData();
  const writingStory = useRecoilValue(writingStoryState);
  addVoiceInFormData(formData, writingStory);
  return formData;
};
const addImagesInFormData = function (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
) {
  const selectedImages = writingStory?.photos;
  const selectedVideos = writingStory?.videos;

  selectedImages?.forEach(image => {
    const uri = image.node.image.uri;
    const fileType = image.node.type;
    const fileName =
      (uri.startsWith('https://lifepuzzle') ? 'lp-media-' : '') +
      image.node.image.filename;
    formData.append('gallery', {
      uri: uri,
      type: fileType === 'image' ? IMG_TYPE : VIDEO_TYPE,
      name: fileName,
    });
  });

  selectedVideos?.forEach(image => {
    const uri = image.node.image.uri;
    const fileName =
      (uri.startsWith('https://lifepuzzle') ? 'lp-media-' : '') +
      image.node.image.filename;
    formData.append('videos', {
      uri: uri,
      type: VIDEO_TYPE,
      name: fileName,
    });
  });
};

const addVoiceInFormData = function (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
) {
  const recordPath = writingStory?.voice;
  const isRecordFile = recordPath != undefined;

  if (isRecordFile) {
    const fileParts = recordPath?.split('/') || [];
    const recordName = fileParts[fileParts?.length - 1];
    const type = AUDIO_TYPE;
    formData.append('voice', {
      uri: recordPath,
      type: type,
      name: recordName,
    });
  }
};

const addStoryinfoInFormData = function (
  formData: FormData,
  hero: HeroType,
  writingStory: WritingStoryType | undefined,
) {
  const stroyInfo = {
    heroNo: hero?.heroNo,
    recQuestionNo: writingStory?.recQuestionNo ?? -1,
    recQuestionModified: false,
    helpQuestionText: writingStory?.helpQuestionText ?? '',
    date: writingStory?.date || new Date(),
    title: writingStory?.title,
    storyText: writingStory?.storyText,
  };
  formData.append('storyInfo', {
    string: JSON.stringify(stroyInfo),
    type: 'application/json',
  });
};
