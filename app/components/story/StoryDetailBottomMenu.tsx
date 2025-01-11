import {Alert, TouchableOpacity} from 'react-native';
import {Color} from '../../constants/color.constant';
import MediumText from '../styled/components/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useSetRecoilState} from 'recoil';
import {BasicNavigationProps} from '../../navigation/types';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {
  useDeleteGallery,
  useDeleteStory,
} from '../../service/hooks/story.delete.hook';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Divider} from 'react-native-paper';
import {GalleryType} from '../../types/photo.type';

type Props = {
  type: 'story' | 'photo';
  gallery: GalleryType;
};

export const StoryDetailMenu = ({
  type = 'story',
  gallery,
}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const setWritingStory = useSetRecoilState(writingStoryState);
  const isStory = type === 'story';
  const [deleteStory] = useDeleteStory({
    storyKey: gallery.story ? gallery.story.id : -1,
  });
  const [deleteGallery] = useDeleteGallery({galleryId: gallery.id});

  console.log(gallery);
  const onEditStory = () => {
    setWritingStory({
      title: gallery.story?.title ?? '',
      content: gallery.story?.content ?? '',
      date: gallery.story?.date ? new Date(gallery.story?.date) : new Date(),
      gallery: [{id: gallery.id, uri: gallery.url, tagKey: gallery.tag.key}],
      voice:
        gallery.story?.audios && gallery.story?.audios.length > 0
          ? gallery.story?.audios[0]
          : '',
    });

    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
  };
  const onDeleteStory = () => {
    //TODO 이야기 삭제 확인
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
  const onDeleteGallery = () => {
    //TODO 사진 삭제 확인
    let msg = isStory
      ? '연결된 이야기도 함께 삭제가 됩니다. 사진을 삭제하시겠습니까?'
      : '사진을 삭제하시겠습니까?';
    Alert.alert('', msg, [
      {
        text: '삭제',
        onPress: () => {
          deleteGallery();
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
          <TouchableOpacity onPress={onEditStory}>
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
          <Divider theme={{colors: {outlineVariant: Color.WHITE}}} bold />
          <TouchableOpacity onPress={onDeleteStory}>
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
      <TouchableOpacity onPress={onDeleteGallery}>
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
