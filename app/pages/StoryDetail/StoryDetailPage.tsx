import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  SelectedStoryKeyState,
  SelectedStoryState,
} from '../../recoils/story-view.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {StoryType} from '../../types/story.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {StoryMediaCarousel} from '../../components/story/StoryMediaCarousel';
import {StoryItemContents} from '../../components/story-list/StoryItemContents';
import {useIsFocused} from '@react-navigation/native';
import {PostStoryKeyState} from '../../recoils/story-write.recoil';
import {useUpdateObserver} from '../../service/hooks/update.hooks';
import {storyListUpdate} from '../../recoils/update.recoil';
import {ScrollContentContainer} from '../../components/styled/container/ContentContainer.tsx';

const StoryDetailPage = (): JSX.Element => {
  const isFocused = useIsFocused();
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const postStoryKey = useRecoilValue(PostStoryKeyState);
  const setSelectedStory = useSetRecoilState(SelectedStoryState);
  const [story, setStory] = useState<StoryType>();
  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);

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

  useEffect(() => {
    if (storyKey) {
      fetchStory({
        url: `/stories/${storyKey}`,
      });
    }
  }, [storyListUpdateObserver]);

  if (!story) {
    return <></>;
  }

  const isOnlyText =
    story.audios.length < 1 &&
    story.videos.length < 1 &&
    story.photos.length < 1;

  return (
    <LoadingContainer isLoading={storiesLoading}>
      <ScreenContainer>
        <ScrollContentContainer>
          {!isOnlyText && (
            <StoryMediaCarousel
              story={story}
              isFocused={isFocused}
              carouselWidth={Dimensions.get('window').width}
              carouselHeight={200}
            />
          )}
          <StoryItemContents inDetail={true} story={story} />
        </ScrollContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default StoryDetailPage;
