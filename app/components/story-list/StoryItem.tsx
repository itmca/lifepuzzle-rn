import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import StoryViewNavigator from '../../navigation/no-tab/StoryViewNavigator';
import {useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {StoryType} from '../../types/story.type';
import {getStoryDisplayDate} from '../../service/story-display.service';
import Text, {SmallText, XSmallText} from '../styled/components/Text';
import Image, {Photo, SmallImage} from '../styled/components/Image';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';

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

  const isPhoto = story.photos.length ? true : false;
  const isAudio = story.audios.length ? true : false;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        moveToStoryDetailPage(story.id);
      }}>
      {!isPhoto && !isAudio ? (
        <View
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: '#EBEBEB',
            borderRadius: 6,
          }}>
          <HorizontalContentContainer alignItems={'center'}>
            <Text
              style={{...styles.listTitle, marginBottom: 8}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {story.title}
            </Text>
          </HorizontalContentContainer>
          <Text style={styles.questionText}>
            👍 추천질문이 들어오는 영역입니다.
          </Text>
          <Text
            style={styles.onlyTextContent}
            numberOfLines={2}
            ellipsizeMode="tail">
            {story.content}
          </Text>
          <Text style={styles.dateTitle}>
            {getStoryDisplayDate(story.date)}
          </Text>
        </View>
      ) : (
        <View style={styles.thumbnailListItemContainer}>
          <View style={styles.thumbnailItemContainer}>
            <View style={styles.thumbnailRecordItemContainer}>
              {isPhoto && (
                <Photo
                  backgroundColor="#d9d9d9"
                  borderTopLeftRadius={6}
                  borderTopRightRadius={6}
                  resizeMode="cover"
                  source={{
                    uri: story.photos.length > 0 ? story.photos[0] : null,
                  }}
                />
              )}
              {isAudio && (
                <View
                  style={
                    isPhoto
                      ? styles.dissolveView
                      : styles.thumbnailRecordItemContainer
                  }>
                  <Image
                    width={30}
                    height={30}
                    source={require('../../assets/images/recording-icon.png')}
                  />
                  <Text style={styles.thumbnailRecordText}>
                    음성녹음 {story.recordingTime}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              padding: 16,
              gap: 8,
            }}>
            <HorizontalContentContainer alignItems={'center'}>
              <Text
                style={styles.listTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {story.title}
              </Text>
              <Text style={styles.dateTitle}>
                {getStoryDisplayDate(story.date)}
              </Text>
            </HorizontalContentContainer>
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
