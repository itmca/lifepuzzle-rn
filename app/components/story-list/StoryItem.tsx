import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {StoryType} from '../../types/story.type';
import {getStoryDisplayDate} from '../../service/story-display.service';
import Text from '../styled/components/Text';
import Image, {Photo} from '../styled/components/Image';
import {BasicNavigationProps} from '../../navigation/types';
import {ContentsOnThumbnail} from './StoryItemContentsOnThumbnail';
import {Thumbnail} from './StoryItemThumbnail';

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

  const isPhoto = story.photos.length ? true : false;
  const isAudio = story.audios.length ? true : false;
  const isOnlyText = !isPhoto && !isAudio ? true : false;
  const date = getStoryDisplayDate(story.date);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        moveToStoryDetailPage(story.id);
      }}>
      {isOnlyText ? (
        <View style={styles.onlyTextItemContainer}>
          <Text
            style={{...styles.itemTitle, marginBottom: 8}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {story.title}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={require('../../assets/images/thumb-up-iso-color.png')}
              style={styles.thumbUpIcon}
            />
            <Text style={styles.questionText}>
              추천질문이 들어오는 영역입니다.
            </Text>
          </View>
          <Text
            style={styles.onlyTextContent}
            numberOfLines={2}
            ellipsizeMode="tail">
            {story.content}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      ) : (
        <View style={styles.thumbnailListItemContainer}>
          <Thumbnail story={story} />
          <View style={styles.contentsContainer}>
            <Text
              style={styles.itemTitle}
              numberOfLines={1}
              ellipsizeMode="tail">
              {story.title}
            </Text>
            <Text
              style={styles.description}
              numberOfLines={1}
              ellipsizeMode="tail">
              {story.content}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default StoryItem;
