import {useEffect, useState} from 'react';
import {StoryType} from '../../types/story.type';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {useRecoilValue} from 'recoil';
import {DUMMY_STORY_LIST} from '../../constants/dummy-story-list.constant';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {useIsFocused} from '@react-navigation/native';
import {ScrollContentContainer} from '../../components/styled/container/ContentContainer.tsx';

const StoryDetailPageWithoutLogin = (): JSX.Element => {
  const isFocused = useIsFocused();
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

  return (
    <ScreenContainer>
      <ScrollContentContainer>
        {/* {!isOnlyText && (
          <StoryMediaCarousel
            story={story}
            isFocused={isFocused}
            carouselWidth={Dimensions.get('window').width}
            carouselHeight={200}
          />
        )}
        <StoryItemContents inDetail={true} story={story} /> */}
      </ScrollContentContainer>
    </ScreenContainer>
  );
};
export default StoryDetailPageWithoutLogin;
