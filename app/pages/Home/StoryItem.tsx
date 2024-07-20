import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {StoryType} from '../../types/story.type';
import {BasicNavigationProps} from '../../navigation/types';
import {StoryItemContents} from '../../components/story-list/StoryItemContents';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {StoryMediaCarousel} from '../../components/story/StoryMediaCarousel';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';

type props = {
  isFocused?: boolean;
  story: StoryType;
};

const StoryItem = ({isFocused, story}: props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const storyId = useSetRecoilState(SelectedStoryKeyState);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const moveToStoryDetailPage = (id: StoryType['id']) => {
    storyId(id);

    navigation.push('NoTab', {
      screen: 'StoryViewNavigator',
      params: {
        screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
      },
    });
  };

  const isOnlyText =
    story.audios.length < 1 &&
    story.videos.length < 1 &&
    story.photos.length < 1;
  return (
    <ContentContainer
      gap={0}
      borderRadius={8}
      withBorder
      style={{overflow: 'hidden'}}>
      {!isOnlyText && (
        <StoryMediaCarousel
          carouselWidth={Dimensions.get('window').width - 42}
          isFocused={isFocused}
          story={story}
          carouselHeight={160}
        />
      )}
      <StoryItemContents
        story={story}
        onPress={() => {
          moveToStoryDetailPage(story.id);
        }}
      />
    </ContentContainer>
  );
};

export default StoryItem;
