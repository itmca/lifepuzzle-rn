import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import StoryViewNavigator from '../../navigation/no-tab/StoryViewNavigator';
import {useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {StoryType} from '../../types/story.type';
import {getStoryDisplayTagsDate} from '../../service/story-display.service';
import Text, {SmallText, XSmallText} from '../styled/components/Text';
import Image, {Photo} from '../styled/components/Image';

type props = {
  story: StoryType;
};

const StoryItem = ({story}: props): JSX.Element => {
  const navigation = useNavigation();
  const storyId = useSetRecoilState(SelectedStoryKeyState);

  const moveToStoryDetailPage = (id: StoryType['id']) => {
    storyId(id);
    navigation.navigate('NoTab', StoryViewNavigator);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        moveToStoryDetailPage(story.id);
      }}>
      <View style={styles.thumbnailListItemContainer}>
        <View
          style={{
            width:
              story.photos.length > 0 || story.audios.length > 0
                ? '60%'
                : '100%',
          }}>
          <XSmallText color={'#A9A9A9'} style={{marginBottom: 8}}>
            {getStoryDisplayTagsDate(story)}
          </XSmallText>
          <Text style={styles.listTitle} numberOfLines={1} ellipsizeMode="tail">
            {story.title}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail">
            {story.content}
          </Text>
        </View>
        <View style={styles.thumbnailItemContainer}>
          {story.photos.length > 0 && (
            <Photo
              width={120}
              height={90}
              borderRadius={10}
              backgroundColor="#d9d9d9"
              resizeMode="cover"
              source={{
                uri: story.photos.length > 0 ? story.photos[0] : null,
              }}
            />
          )}
          {story.audios.length > 0 && (
            <View style={styles.thumbnailRecordItemContainer}>
              <View style={styles.recordIconContainer}>
                <Image
                  width={30}
                  height={30}
                  source={require('../../assets/images/record-icon.png')}
                />
                <SmallText color={'#FFFFFF'}>{story.recordingTime}</SmallText>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryItem;
