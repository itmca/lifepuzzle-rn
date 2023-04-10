import {StoryTag, StoryType} from '../types/story.type';

export const getStoryDisplayTagsDate = (story: StoryType) => {
  return `${getStoryTagsText(story.tags)}ㆍ${getStoryDisplayDate(
    typeof story.date === 'string' ? new Date(story.date) : story.date,
  )}`;
};

const getStoryDisplayDate = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const getStoryTagsText = (tags: StoryTag[]) => {
  return tags.map(tag => tag.displayName).join(' ');
};
