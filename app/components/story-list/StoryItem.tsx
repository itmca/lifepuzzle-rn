import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './styles';
import StoryViewNavigator from '../../navigation/no-tab/StoryViewNavigator';
import {useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {StoryType} from '../../types/story.type';
import {getStoryDisplayTagsDate} from '../../service/story-display.service';
import { SmallText, XSmallText } from "../styled/components/Text";
import { LargeImage } from "../styled/components/Image";

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
        <View style={{flex: 1}}>
          <View>
            <SmallText fontWeight={700} letterSpacing={0.15} marginBottom={13} lineHeight={24}
              numberOfLines={1}
              ellipsizeMode="tail"
              >
              {story.title}
            </SmallText>
            <SmallText opacity={0.8}
              numberOfLines={3}
              ellipsizeMode="tail">
              {story.content}
            </SmallText>
          </View>
        </View>
        {story.photos.length > 0 && (
          <View style={styles.thumbnailBox}>
            <View>
              <LargeImage
                resizeMode="cover"
                source={{
                  uri: story.photos[0],
                }}
              />
            </View>
          </View>
        )}
        <View style={styles.bottomRowBox}>
          <View>
            <XSmallText color={'#979797'}>
              {getStoryDisplayTagsDate(story)}
            </XSmallText>
          </View>
          {story.audios.length > 0 && (
            <View style={styles.micIconBox}>
              <Icon name="mic" size={14} color={'#010440'} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryItem;
