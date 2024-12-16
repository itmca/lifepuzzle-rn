import {StoryTag, StoryType} from '../types/story.type';

export const getStoryDisplayTagsDate = (story: StoryType) => {
  return `${getStoryTagsText(story.tags)}ㆍ${getStoryDisplayDate(
    typeof story.date === 'string' ? new Date(story.date) : story.date,
  )}`;
};

export const getStoryDisplayDate = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const getStoryDisplayDotDate = (date: Date) => {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

const getStoryTagsText = (tags: StoryTag[]) => {
  return tags.map(tag => tag.displayName).join(' ');
};

export const toPhotoIdentifier = (uri: string) => ({
  node: {
    type: '',
    group_name: '',
    image: {
      filename: uri.split('/').pop() || '',
      filepath: null,
      extension: null,
      uri: uri,
      height: 0,
      width: 0,
      fileSize: null,
      playableDuration: 0,
      orientation: null,
    },
    timestamp: 0,
    location: null,
  },
});
