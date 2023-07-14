import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {styles} from './styles';
import {useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {StoryType} from '../../types/story.type';
import {BasicNavigationProps} from '../../navigation/types';
import {Thumbnail} from './StoryItemThumbnail';
import {Contents} from './StoryItemContents';
import {TextOnlyContents} from './StoryItemWithTextOnly';

type props = {
  story: StoryType;
};

const StoryItem = ({story}: props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const storyId = useSetRecoilState(SelectedStoryKeyState);

  const moveToStoryDetailPage = (id: StoryType['id']) => {
    storyId(id);
    navigation.push('NoTab', {
      screen: 'StoryViewNavigator',
      params: {
        screen: 'StoryDetail',
      },
    });
  };

  //TODO
  const isVideo = false;

  const isPhoto = story.photos.length ? true : false;
  const isAudio = story.audios.length ? true : false;
  const isOnlyText = !isPhoto && !isAudio && !isVideo ? true : false;

  return (
    <View style={styles.container}>
      {isOnlyText ? (
        <TextOnlyContents story={story} />
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
