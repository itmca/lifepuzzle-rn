import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Dimensions, View} from 'react-native';
import {styles} from '../../components/story-list/styles';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {StoryType} from '../../types/story.type';
import {BasicNavigationProps} from '../../navigation/types';
import {Contents} from '../../components/story-list/StoryItemContents';
import {isLoggedInState} from '../../recoils/auth.recoil';
import StoryMediaCarousel from '../../components/story/StoryMediaCarousel';

type props = {
  story: StoryType;
};

const StoryItem = ({story}: props): JSX.Element => {
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
    <View style={styles.container}>
      <View style={styles.thumbnailListItemContainer}>
        {!isOnlyText && (
          <StoryMediaCarousel
            carouselWidth={Dimensions.get('window').width - 34}
            listThumbnail={true}
            story={story}
          />
        )}
        <Contents
          story={story}
          onPress={() => {
            moveToStoryDetailPage(story.id);
          }}
        />
      </View>
    </View>
  );
};

export default StoryItem;
