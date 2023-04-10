import {useRecoilValue} from 'recoil';
import {writingStoryState} from '../../recoils/story-writing.recoil';
import {AUDIO_TYPE, IMG_TYPE} from '../../constants/upload-file-type.constant';
import {WritingStoryType} from '../../types/writing-story.type';

export const useStoryHttpPayLoad = () => {
  const formData = new FormData();
  const writingStory = useRecoilValue(writingStoryState);

  addImagesInFormData(formData, writingStory);
  addVoiceInFormData(formData, writingStory);
  addStoryinfoInFormData(formData, writingStory);

  return formData;
};

const addImagesInFormData = function (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
) {
  const selectedImages = writingStory?.photos;

  selectedImages?.forEach((image, index) => {
    const uri = image.node.image.uri;
    const type = IMG_TYPE;
    const fileParts = uri?.split('/');
    const fileName = fileParts[fileParts?.length - 1];
    formData.append('photos', {
      uri: uri,
      type: type,
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
  writingStory: WritingStoryType | undefined,
) {
  const stroyInfo = {
    heroNo: writingStory?.heroNo,
    recQuestionNo: writingStory?.recQuestionNo,
    recQuestionModified: writingStory?.recQuestionModified,
    helpQuestionText: writingStory?.helpQuestionText,
    date: writingStory?.date,
    title: writingStory?.title,
    storyText: writingStory?.storyText,
  };

  formData.append('storyInfo', {
    string: JSON.stringify(stroyInfo),
    type: 'application/json',
  });
};
