import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {useRecoilValue} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {StoryType} from '../../types/story.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {NoOutLineScreenContainer} from '../../components/styled/container/ScreenContainer';
import StoryMediaCarousel from '../../components/story/StoryMediaCarousel';
import {Contents} from '../../components/story-list/StoryItemContents';

const StoryDetailPage = (): JSX.Element => {
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const [story, setStory] = useState<StoryType>();
  const [storiesLoading, fetchStory] = useAuthAxios<StoryType>({
    requestOption: {
      url: `/stories/${storyKey}`,
    },
    onResponseSuccess: setStory,
    disableInitialRequest: false,
  });

  useEffect(() => {
    setStory(undefined);

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
            <StoryMediaCarousel
              listThumbnail={false}
              story={story}
              inDetail={true}
            />
          )}
          <Contents inDetail={true} story={story} />
        </ScrollView>
      </NoOutLineScreenContainer>
    </LoadingContainer>
  );
};
export default StoryDetailPage;
