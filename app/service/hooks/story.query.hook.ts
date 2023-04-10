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

type Props = {
  storyFilter: (story: StoryType) => boolean;
};

type Response = {
  stories: StoryType[];
  tags: StoryTag[];
  totalStoryCount: number;
  isLoading: boolean;
};
export const useStories = ({storyFilter}: Props): Response => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);
  const [stories, setStories] = useState<StoryType[]>([]);
  const [tags, setTags] = useState<StoryTag[]>([]);

  const [isLoading, fetchStories] = useAuthAxios<StoryQueryResponse>({
    requestOption: {
      url: '/stories',
      params: {
        heroNo: hero.heroNo,
      },
    },
    onResponseSuccess: ({stories, tags}) => {
      setStories(stories);
      setTags(tags);
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
    stories: stories.filter(storyFilter),
    tags,
    totalStoryCount: stories.length,
    isLoading,
  };
};
