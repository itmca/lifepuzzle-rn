import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  SelectedStoryKeyState,
  SelectedStoryState,
} from '../../recoils/story-view.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {StoryType} from '../../types/story.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {NoOutLineScreenContainer} from '../../components/styled/container/ScreenContainer';
import StoryMediaCarousel from '../../components/story/StoryMediaCarousel';
import {Contents} from '../../components/story-list/StoryItemContents';
import {useIsFocused} from '@react-navigation/native';
import {PostStoryKeyState} from '../../recoils/story-write.recoil';

const StoryDetailPage = (): JSX.Element => {
  const isFocused = useIsFocused();
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const postStoryKey = useRecoilValue(PostStoryKeyState);
  const setSelectedStory = useSetRecoilState(SelectedStoryState);
  const [story, setStory] = useState<StoryType>();
  const [storiesLoading, fetchStory] = useAuthAxios<StoryType>({
    requestOption: {
      url:
        (storyKey && `/stories/${storyKey}`) ||
        (postStoryKey && `/stories/${postStoryKey}`),
    },
    onResponseSuccess: data => {
      setStory(data);
      setSelectedStory(data);
    },
    disableInitialRequest: false,
  });

  useEffect(() => {
    setStory(undefined);
    setSelectedStory(undefined);
  }, [storyKey]);

  if (!story) {
    return <></>;
  }

  const isOnlyText =
    story.audios.length < 1 &&
    story.videos.length < 1 &&
    story.photos.length < 1;

  return (
    <LoadingContainer isLoading={storiesLoading}>
      <NoOutLineScreenContainer>
        <ScrollView>
          {!isOnlyText && (
            <StoryMediaCarousel
              story={story}
              listThumbnail={false}
              isFocused={isFocused}
            />
          )}
          <Contents inDetail={true} story={story} />
        </ScrollView>
      </NoOutLineScreenContainer>
    </LoadingContainer>
  );
};
export default StoryDetailPage;
