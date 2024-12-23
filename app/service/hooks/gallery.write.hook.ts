import {WritingStoryType} from '../../types/writing-story.type.ts';
import {
  IMG_TYPE,
  VIDEO_TYPE,
} from '../../constants/upload-file-type.constant.ts';

// TODO(border-line): 사진 업로드 기능을 위한 기반 코드로 복사해 두었으며 사진 업로드 기능 구현하면서 제거
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
