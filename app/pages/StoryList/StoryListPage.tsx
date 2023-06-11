import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import ScrollingStoryList from '../../components/story-list/ScrollingStoryList';
import HeroStoryOverview from '../../components/story-list/HeroStoryOverview';
import {Divider} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useStories} from '../../service/hooks/story.query.hook';
import {useUpdateObserver} from '../../service/hooks/update.hooks';
import {heroUpdate, storyListUpdate} from '../../recoils/update.recoil';
import {FILTER_KEY_ALL} from '../../constants/filter.contant';
import {NoOutLineFullScreenContainer} from '../../components/styled/container/ScreenContainer';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

type Props = {
  route: any;
};

const StoryListPage = ({route}: Props): JSX.Element => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);
  const navigation = useNavigation<BasicNavigationProps>();

  const [selectedTagKey, setSelectedTagKey] = useState<string>('');

  useEffect(() => {
    setSelectedTagKey(FILTER_KEY_ALL);
  }, [hero.heroNo, heroUpdateObserver, storyListUpdateObserver]);

  const {stories, tags, totalStoryCount, isLoading} = useStories({
    storyFilter: story =>
      selectedTagKey === FILTER_KEY_ALL ||
      story.tags.some(tag => tag.key === selectedTagKey),
  });

  return (
    <LoadingContainer isLoading={isLoading}>
      <NoOutLineFullScreenContainer>
        <HeroStoryOverview
          hero={hero}
          storyCount={totalStoryCount}
          tags={tags}
          onSelect={setSelectedTagKey}
        />
        <Divider />
        <ScrollingStoryList stories={stories} />
      </NoOutLineFullScreenContainer>
    </LoadingContainer>
  );
};

export default StoryListPage;
