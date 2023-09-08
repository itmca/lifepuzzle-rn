import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import React, {useState} from 'react';
import {Alert, Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {FloatingMenu} from '../story/StoryDetailFloatingMenu';
import Icon from 'react-native-vector-icons/Feather';
import {Color} from '../../constants/color.constant';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/selected-story-id.recoil';
import {useDeleteStory} from '../../service/hooks/story.delete.hook';
import {SelectedStoryState} from '../../recoils/selected-story.recoil';
import {
  recordFileState,
  storyDateState,
  storyTextState,
} from '../../recoils/story-writing.recoil';
import {WritingStoryTextInfo} from '../../types/writing-story.type';
import {helpQuestionTextState} from '../../recoils/help-question.recoil';
import Sound from 'react-native-sound';
import {toMinuteSeconds} from '../../service/time-display.service';

type Props = {
  customAction?: Function;
};

const DetailViewHeader = ({customAction}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const selectedStory = useRecoilValue(SelectedStoryState);

  const setQuestion = useSetRecoilState(helpQuestionTextState);
  const setTextInfo = useSetRecoilState<WritingStoryTextInfo | undefined>(
    storyTextState,
  );
  const setDate = useSetRecoilState(storyDateState);
  const setAudio = useSetRecoilState(recordFileState);

  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [deleteStory] = useDeleteStory({storyKey: storyKey});

  const onClickEdit = () => {
    setDate(selectedStory?.date);
    setQuestion(selectedStory?.question ?? '');
    setTextInfo({
      title: selectedStory?.title,
      storyText: selectedStory?.content,
    });

    if (
      selectedStory?.audios !== undefined &&
      selectedStory?.audios.length > 0
    ) {
      Sound.setCategory('Playback');
      const audioSound = new Sound(
        selectedStory.audios[0],
        undefined,
        error => {
          if (error) {
            return;
          }

          setAudio({
            filePath: selectedStory.audios[0],
            recordTime: ':' + toMinuteSeconds(audioSound.getDuration()),
          });
        },
      );
    }

    // TODO 세팅 방법 확인 필요 (PhotoIdentifier 타입)
    // const [photos, setPhotos] = useRecoilState(selectedPhotoState);
    // const [videos, setVideos] = useRecoilState(selectedVideoState);
    // setVideos(selectedStory?.videos);
    // setPhotos(selectedStory?.photos);

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
          if (typeof customAction === 'function') {
            customAction();
          }

          navigation.goBack();
        }}>
        <View style={{marginLeft: -10}}>
          <Icon name={'chevron-left'} size={26} color={Color.FONT_GRAY} />
        </View>
      </Pressable>
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
      <FloatingMenu
        visible={isShowMenu}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
    </TopNavigationContainer>
  );
};

export default DetailViewHeader;
