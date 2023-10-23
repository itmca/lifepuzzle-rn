import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import React, {useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {FloatingMenu} from '../story/StoryDetailFloatingMenu';
import Icon from 'react-native-vector-icons/Feather';
import {Color} from '../../constants/color.constant';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  SelectedStoryKeyState,
  SelectedStoryState,
} from '../../recoils/story-view.recoil';
import {useDeleteStory} from '../../service/hooks/story.delete.hook';
import {
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';

type Props = {
  customAction?: Function;
  displayRight?: boolean;
};

const DetailViewHeader = ({
  displayRight = true,
  customAction,
}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const selectedStory = useRecoilValue(SelectedStoryState);

  const postStoryKey = useRecoilValue(PostStoryKeyState);

  const setWritingStory = useSetRecoilState(writingStoryState);

  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [deleteStory] = useDeleteStory({storyKey: storyKey});

  const onClickEdit = () => {
    const toPhotoIdentifier = (uri: string) => ({
      node: {
        type: '',
        group_name: '',
        image: {
          filename: uri.split('/').pop() || '',
          filepath: null,
          extension: null,
          uri: uri,
          height: 0,
          width: 0,
          fileSize: null,
          playableDuration: 0,
          orientation: null,
        },
        timestamp: 0,
        location: null,
      },
    });

    const currentPhotos = selectedStory?.photos.map(toPhotoIdentifier);
    const currentVideos = selectedStory?.videos.map(toPhotoIdentifier);

    setWritingStory({
      date: selectedStory?.date,
      helpQuestionText: selectedStory?.question ?? '',
      title: selectedStory?.title,
      storyText: selectedStory?.content,
      photos: currentPhotos ? currentPhotos : [],
      videos: currentVideos ? currentVideos : [],
      voice: selectedStory?.audios[0],
    });

    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });

    setIsShowMenu(false);
  };

  const onClickDelete = () => {
    Alert.alert('', '삭제하시겠습니까?', [
      {
        text: '확인',
        onPress: () => {
          deleteStory();
        },
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  };

  return (
    <TopNavigationContainer>
      <Pressable
        onPress={() => {
          if (postStoryKey) {
            navigation.reset({
              index: 0,
              routes: [{name: 'HomeTab', params: {screen: 'Home'}}],
            });
            return;
          }

          if (typeof customAction === 'function') {
            customAction();
          }

          navigation.goBack();
        }}>
        <View style={{marginLeft: -10}}>
          <Icon name={'chevron-left'} size={26} color={Color.FONT_GRAY} />
        </View>
      </Pressable>
      {displayRight && (
        <Pressable
          style={{marginLeft: 'auto'}}
          onPress={() => {
            setIsShowMenu(isShowMenu ? false : true);
          }}>
          <Icon
            name="more-vertical"
            size={23}
            color={Color.FONT_GRAY}
            style={{marginRight: -5}}
          />
        </Pressable>
      )}
      <FloatingMenu
        visible={isShowMenu}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
    </TopNavigationContainer>
  );
};

export default DetailViewHeader;
