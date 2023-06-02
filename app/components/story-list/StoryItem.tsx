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
import Image, {SmallImage} from '../styled/components/Image';

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
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            style={{
              width:
                story.photos.length > 0 || story.audios.length > 0
                  ? '60%'
                  : '100%',
            }}>
            <XSmallText style={{color: '#A9A9A9', marginBottom: 10}}>
              {getStoryDisplayTagsDate(story)}
            </XSmallText>
            <Text
              fontWeight={700}
              letterSpacing={0.15}
              lineHeight={24}
              numberOfLines={1}
              marginBottom={6}
              color={'#333333'}
              ellipsizeMode="tail">
              {story.title}
            </Text>
            <Text
              style={{fontSize: 14}}
              color={'#A9A9A9'}
              opacity={0.8}
              numberOfLines={2}
              ellipsizeMode="tail">
              {story.content}
            </Text>
          </View>
          <View style={{marginLeft: 'auto'}}>
            {
              <View
                style={{
                  width: 120,
                  height: 90,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {story.audios.length > 0 && (
                  <Image
                    backgroundColor="#d9d9d9"
                    resizeMode="cover"
                    source={{
                      uri: story.photos.length > 0 ? story.photos[0] : null,
                    }}
                  />
                )}
                {story.audios.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      width: 120,
                      height: 90,
                      borderRadius: 10,
                      backgroundColor: '#32C5FF',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                      <Image
                        width={30}
                        height={30}
                        source={require('../../assets/images/record-icon.png')}
                      />
                      <SmallText color={'#FFFFFF'}>00:00</SmallText>
                    </View>
                  </View>
                )}
              </View>
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoryItem;
