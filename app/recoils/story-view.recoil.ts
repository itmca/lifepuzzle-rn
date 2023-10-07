import {atom} from 'recoil';
import {StoryType} from '../types/story.type';

export const SelectedStoryKeyState = atom<string>({
  key: 'SelectedStoryKeyState',
  default: '',
});
export const SelectedStoryState = atom<StoryType | undefined>({
  key: 'SelectedStoryState',
  default: {
    id: '',
    heroNo: 0,
    title: '',
    content: '',
    question: '',
    photos: [],
    audios: [],
    videos: [],
    tags: [],
    date: new Date(),
    createdAt: new Date(),
  },
});
