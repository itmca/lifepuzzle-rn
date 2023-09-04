import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import StoryPhotoCarousel from '../../components/story/StoryPhotoCarousel';
import {styles} from './styles';
import {StoryType} from '../../types/story.type';
import {getStoryDisplayTagsDate} from '../../service/story-display.service';
import {StoryAudioPlayer} from '../../components/story/StoryAudioPlayer';
import {NoOutLineScreenContainer} from '../../components/styled/container/ScreenContainer';
import {useRecoilValue} from 'recoil';
import {DUMMY_STORY_LIST} from '../../constants/dummy-story-list.constant';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import StoryMediaCarousel from '../../components/story/StoryMediaCarousel';
import {Contents} from '../../components/story-list/StoryItemContents';

const StoryDetailPageWithoutLogin = (): JSX.Element => {
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const [story, setStory] = useState<StoryType>();

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
            inDetail={true}
          />
        )}
        <Contents inDetail={true} story={story} />
      </ScrollView>
    </NoOutLineScreenContainer>
  );
};
export default StoryDetailPageWithoutLogin;
