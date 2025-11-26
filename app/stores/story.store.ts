import { create } from 'zustand';
import { PlayInfo, WritingStoryType } from '../types/core/writing-story.type';

interface StoryState {
  selectedStoryKey: string;
  writingStory: WritingStoryType;
  playInfo: PlayInfo;
  postStoryKey: string;
  setSelectedStoryKey: (key: string) => void;
  resetSelectedStoryKey: () => void;
  setWritingStory: (story: WritingStoryType) => void;
  resetWritingStory: () => void;
  setPlayInfo: (playInfo: PlayInfo) => void;
  resetPlayInfo: () => void;
  setPostStoryKey: (key: string) => void;
}

export const useStoryStore = create<StoryState>(set => ({
  selectedStoryKey: '',
  writingStory: {},
  playInfo: {},
  postStoryKey: '',

  setSelectedStoryKey: selectedStoryKey => set({ selectedStoryKey }),

  resetSelectedStoryKey: () => set({ selectedStoryKey: '' }),

  setWritingStory: writingStory =>
    set(state => ({
      writingStory: { ...state.writingStory, ...writingStory },
    })),

  resetWritingStory: () => set({ writingStory: {} }),

  setPlayInfo: playInfo =>
    set(state => ({
      playInfo: { ...state.playInfo, ...playInfo },
    })),

  resetPlayInfo: () => set({ playInfo: {} }),

  setPostStoryKey: postStoryKey => set({ postStoryKey }),
}));
