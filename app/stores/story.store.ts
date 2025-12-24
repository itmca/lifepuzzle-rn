import { create } from 'zustand';
import { WritingStoryType } from '../types/core/writing-story.type';

interface StoryState {
  selectedStoryKey: string;
  writingStory: WritingStoryType;
  setSelectedStoryKey: (key: string) => void;
  resetSelectedStoryKey: () => void;
  setWritingStory: (story: WritingStoryType) => void;
  resetWritingStory: () => void;
}

export const useStoryStore = create<StoryState>(set => ({
  selectedStoryKey: '',
  writingStory: {},

  setSelectedStoryKey: selectedStoryKey => set({ selectedStoryKey }),

  resetSelectedStoryKey: () => set({ selectedStoryKey: '' }),

  setWritingStory: writingStory =>
    set(state => ({
      writingStory: { ...state.writingStory, ...writingStory },
    })),

  resetWritingStory: () => set({ writingStory: {} }),
}));
