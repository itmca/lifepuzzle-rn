import {StoryTag, StoryType} from '../../types/story.type';
import {useRecoilValue} from 'recoil';
import {HeroType} from '../../types/hero.type';
import {heroState} from '../../recoils/hero.recoil';
import {useUpdateObserver} from './update.hooks';
import {heroUpdate, storyListUpdate} from '../../recoils/update.recoil';
import {useEffect, useState} from 'react';
import {useAuthAxios} from './network.hook';

type StoryQueryResponse = {
  stories: StoryType[];
  tags: StoryTag[];
};

type Response = {
  stories: StoryType[];
  totalStoryCount: number;
  isLoading: boolean;
};
export const useStories = (): Response => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);
  const [stories, setStories] = useState<StoryType[]>([]);

  const [isLoading, fetchStories] = useAuthAxios<StoryQueryResponse>({
    requestOption: {
      url: '/stories',
      params: {
        heroNo: hero.heroNo,
      },
    },
    onResponseSuccess: ({stories}) => {
      setStories(stories);
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    if (hero.heroNo < 0) {
      return;
    }

    fetchStories({
      params: {
        heroNo: hero.heroNo,
      },
    });
  }, [hero.heroNo, heroUpdateObserver, storyListUpdateObserver]);

  return {
    stories: stories,
    totalStoryCount: stories.length,
    isLoading,
  };
};
