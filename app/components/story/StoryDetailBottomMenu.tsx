import {
  Alert,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Color} from '../../constants/color.constant';
import MediumText from '../styled/components/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useSetRecoilState, useRecoilValue, useRecoilState} from 'recoil';
import {BasicNavigationProps} from '../../navigation/types';
import {
  SelectedStoryKeyState,
  SelectedStoryState,
} from '../../recoils/story-view.recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {useDeleteStory} from '../../service/hooks/story.delete.hook';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Divider} from 'react-native-paper';
import {toPhotoIdentifier} from '../../service/story-display.service';

type Props = {
  type: 'story' | 'photo';
};

export const StoryDetailMenu = ({type = 'story'}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const setWritingStory = useSetRecoilState(writingStoryState);
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const isStory = type === 'story';
  const [selectedStory, setSelectedStory] = useRecoilState(SelectedStoryState);

  const [deleteStory] = useDeleteStory({storyKey: storyKey});

  const onClickEdit = () => {
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
  };
  const onClickDelete = () => {
    Alert.alert('', '사진에 연결된 이야기를 삭제하시겠습니까?', [
      {
        text: '삭제',
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
  const onClickPhotoDelete = () => {
    let msg = isStory
      ? '연결된 이야기도 함께 삭제가 됩니다. 사진을 삭제하시겠습니까?'
      : '사진을 삭제하시겠습니까?';
    Alert.alert('', msg, [
      {
        text: '삭제',
        onPress: () => {
          //TODO 사진 삭제
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
    <ContentContainer withScreenPadding gap={16}>
      {isStory && (
        <ContentContainer gap={0}>
          <TouchableOpacity onPress={onClickEdit}>
            <ContentContainer
              height={'56px'}
              useHorizontalLayout
              gap={0}
              backgroundColor={Color.LIGHT_GRAY}
              justifyContent={'left'}
              paddingVertical={12}
              paddingHorizontal={16}
              borderTopRadius={8}>
              <Icon size={18} name={'edit'} color={Color.LIGHT_BLACK} />
              <ContentContainer paddingHorizontal={16} withNoBackground>
                <MediumText color={Color.LIGHT_BLACK} bold>
                  이야기 수정하기
                </MediumText>
              </ContentContainer>
            </ContentContainer>
          </TouchableOpacity>
          <Divider
            theme={{colors: {outlineVariant: Color.WHITE}}}
            bold></Divider>
          <TouchableOpacity onPress={onClickDelete}>
            <ContentContainer
              height={'56px'}
              useHorizontalLayout
              gap={0}
              backgroundColor={Color.LIGHT_GRAY}
              justifyContent={'left'}
              paddingVertical={12}
              paddingHorizontal={16}
              borderBottomRadius={8}>
              <Icon size={18} name={'delete'} color={Color.LIGHT_BLACK} />
              <ContentContainer paddingHorizontal={16} withNoBackground>
                <MediumText color={Color.LIGHT_BLACK} bold>
                  이야기 삭제하기
                </MediumText>
              </ContentContainer>
            </ContentContainer>
          </TouchableOpacity>
        </ContentContainer>
      )}
      <TouchableOpacity onPress={onClickPhotoDelete}>
        <ContentContainer
          height={'56px'}
          useHorizontalLayout
          gap={0}
          backgroundColor={Color.LIGHT_GRAY}
          justifyContent={'left'}
          paddingVertical={12}
          paddingHorizontal={16}
          borderRadius={8}
          borderBottomRadius={8}>
          <Icon size={18} name={'delete'} color={Color.LIGHT_BLACK} />
          <ContentContainer paddingHorizontal={16} withNoBackground>
            <MediumText color={Color.LIGHT_BLACK} bold>
              사진 삭제하기
            </MediumText>
          </ContentContainer>
        </ContentContainer>
      </TouchableOpacity>
    </ContentContainer>
  );
};
