import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {styles} from './styles';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {StoryType} from '../../types/story.type';
import {BasicNavigationProps} from '../../navigation/types';
import {Thumbnail} from './StoryItemThumbnail';
import {Contents} from './StoryItemContents';
import {TextOnlyContents} from './StoryItemWithTextOnly';
import {isLoggedInState} from '../../recoils/auth.recoil';

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

  const isVideo = story.videos.length ? true : false;
  const isPhoto = story.photos.length ? true : false;
  const isAudio = story.audios.length ? true : false;
  const isOnlyText = !isPhoto && !isAudio && !isVideo ? true : false;

  return (
    <View style={styles.container}>
      {isOnlyText ? (
        <TextOnlyContents
          story={story}
          onPress={() => {
            moveToStoryDetailPage(story.id);
          }}
        />
      ) : (
        <View style={styles.thumbnailListItemContainer}>
          <Thumbnail story={story} />
          <Contents
            title={story.title}
            content={story.content}
            onPress={() => {
              moveToStoryDetailPage(story.id);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default StoryItem;
