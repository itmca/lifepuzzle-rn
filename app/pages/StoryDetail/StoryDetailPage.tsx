import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
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

const StoryDetailPage = (): JSX.Element => {
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const [_, setSelectedStory] = useRecoilState(SelectedStoryState);
  const [story, setStory] = useState<StoryType>();
  const [storiesLoading, fetchStory] = useAuthAxios<StoryType>({
    requestOption: {
      url: `/stories/${storyKey}`,
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

    fetchStory({
      url: `/stories/${storyKey}`,
    });
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
            <StoryMediaCarousel listThumbnail={false} story={story} />
          )}
          <Contents inDetail={true} story={story} />
        </ScrollView>
      </NoOutLineScreenContainer>
    </LoadingContainer>
  );
};
export default StoryDetailPage;
