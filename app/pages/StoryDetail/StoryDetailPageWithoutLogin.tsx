import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {StoryType} from '../../types/story.type';
import {NoOutLineScreenContainer} from '../../components/styled/container/ScreenContainer';
import {useRecoilValue} from 'recoil';
import {DUMMY_STORY_LIST} from '../../constants/dummy-story-list.constant';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import StoryMediaCarousel from '../../components/story/StoryMediaCarousel';
import {Contents} from '../../components/story-list/StoryItemContents';
import {useFocusEffect} from '@react-navigation/native';

const StoryDetailPageWithoutLogin = (): JSX.Element => {
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const [story, setStory] = useState<StoryType>();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);

      return () => {
        setIsFocused(false);
      };
    }, []),
  );

  useEffect(() => {
    const dummyStory: StoryType[] = DUMMY_STORY_LIST.filter(
      story => story.id === storyKey,
    );

    setStory(dummyStory[0]);
  }, [storyKey]);

  if (!story) {
    return <></>;
  }

  const isOnlyText =
    story.audios.length < 1 &&
    story.videos.length < 1 &&
    story.photos.length < 1;

  return (
    <NoOutLineScreenContainer>
      <ScrollView>
        {!isOnlyText && (
          <StoryMediaCarousel
            listThumbnail={false}
            story={story}
            isFocused={isFocused}
          />
        )}
        <Contents inDetail={true} story={story} />
      </ScrollView>
    </NoOutLineScreenContainer>
  );
};
export default StoryDetailPageWithoutLogin;
