import React, {useEffect, useState} from 'react';
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
import Sound from 'react-native-sound';
import {toMinuteSeconds} from '../../service/time-display.service';
import {styles} from './styles';
import {View} from 'react-native';

const StoryListPage = (): JSX.Element => {
  const hero = useRecoilValue<HeroType>(heroState);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);

  const [selectedTagKey, setSelectedTagKey] = useState<string>('');

  useEffect(() => {
    setSelectedTagKey(FILTER_KEY_ALL);
  }, [hero.heroNo, heroUpdateObserver, storyListUpdateObserver]);

  const {stories, tags, totalStoryCount, isLoading} = useStories({
    storyFilter: story =>
      selectedTagKey === FILTER_KEY_ALL ||
      story.tags.some(tag => tag.key === selectedTagKey),
  });

  const storyList = stories.map(story => {
    if (story.audios[0] !== undefined) {
      const audioSound = new Sound(story.audios[0], undefined, () => {
        story.recordingTime = toMinuteSeconds(audioSound.getDuration());
      });
    }
    return story;
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
        <View style={styles.customDivider} />
        <ScrollingStoryList stories={storyList} />
      </NoOutLineFullScreenContainer>
    </LoadingContainer>
  );
};

export default StoryListPage;
