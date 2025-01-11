import {useRecoilValue} from 'recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {AUDIO_TYPE} from '../../constants/upload-file-type.constant';
import {WritingStoryType} from '../../types/writing-story.type';

export const useStoryHttpPayLoad = () => {
  const formData = new FormData();
  const writingStory = useRecoilValue(writingStoryState);

  addVoiceToFormData(formData, writingStory);
  addJsonBodyToFormData(formData, writingStory);

  return formData;
};

const addVoiceToFormData = function (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
) {
  const recordPath = writingStory?.voice;
  const isRecordFile = recordPath !== undefined;

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

const addJsonBodyToFormData = function (
  formData: FormData,
  writingStory: WritingStoryType | undefined,
) {
  const story = {
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
