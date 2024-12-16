import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, Image, Keyboard, Pressable} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  SelectedStoryKeyState,
  SelectedStoryState,
} from '../../recoils/story-view.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {StoryType} from '../../types/story.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {StoryMediaCarousel} from '../../components/story/StoryMediaCarousel';
import {StoryItemContents} from '../../components/story-list/StoryItemContents';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {useUpdateObserver} from '../../service/hooks/update.hooks';
import {storyListUpdate} from '../../recoils/update.recoil';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import BottomSheet from '../../components/styled/components/BottomSheet';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Color} from '../../constants/color.constant.ts';
import {StoryDetailMenu} from '../../components/story/StoryDetailBottomMenu.tsx';
import Title, {
  MediumTitle,
  XSmallTitle,
} from '../../components/styled/components/Title.tsx';
import {max} from 'lodash';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {toPhotoIdentifier} from '../../service/story-display.service.ts';

const StoryDetailPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const setWritingStory = useSetRecoilState(writingStoryState);
  const isFocused = useIsFocused();
  const storyKey = useRecoilValue(SelectedStoryKeyState);
  const postStoryKey = useRecoilValue(PostStoryKeyState);
  const isStory = storyKey ? true : false;
  const [selectedStory, setSelectedStory] = useRecoilState(SelectedStoryState);
  const [story, setStory] = useState<StoryType>();

  const storyListUpdateObserver = useUpdateObserver(storyListUpdate);
  //bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [isStory ? '35%' : '15%'], []);
  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const [storiesLoading, fetchStory] = useAuthAxios<StoryType>({
    requestOption: {
      url:
        (storyKey && `/stories/${storyKey}`) ||
        (postStoryKey && `/stories/${postStoryKey}`),
    },
    onResponseSuccess: data => {
      setStory(data);
      setSelectedStory(data);
    },
    disableInitialRequest: false,
  });

  useEffect(() => {
    setStory(undefined);
    setSelectedStory(undefined);
  }, [storyKey]);

  useEffect(() => {
    if (storyKey) {
      fetchStory({
        url: `/stories/${storyKey}`,
      });
    }
  }, [storyListUpdateObserver]);

  if (!story) {
    return <></>;
  }
  const onClickWrite = () => {
    setWritingStory({
      date: selectedStory?.date,
      photos: selectedStory?.photos.map(toPhotoIdentifier) || [],
      videos: selectedStory?.videos.map(toPhotoIdentifier) || [],
    });

    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
    //닫기
  };

  const isOnlyText =
    story.audios.length < 1 &&
    story.videos.length < 1 &&
    story.photos.length < 1;

  return (
    <LoadingContainer isLoading={storiesLoading}>
      <BottomSheetModalProvider>
        <ScreenContainer>
          <ScrollContentContainer gap={16}>
            <ContentContainer
              useHorizontalLayout
              paddingHorizontal={16}
              alignItems="flex-end"
              height={Dimensions.get('window').height * 0.1 + 'px' ?? '10%'}>
              <MediumTitle>10세 미만</MediumTitle>
              <Pressable
                style={{marginLeft: 'auto'}}
                onPress={handlePresentModalPress}>
                <Icon
                  name="more-horiz"
                  size={23}
                  color={Color.FONT_GRAY}
                  style={{marginRight: -5}}
                />
              </Pressable>
            </ContentContainer>

            {!isOnlyText && (
              <ContentContainer
                backgroundColor={Color.BLACK}
                style={{
                  height: Dimensions.get('window').height * 0.55 + 'px',
                }}>
                <StoryMediaCarousel
                  story={story}
                  isFocused={isFocused}
                  carouselWidth={Dimensions.get('window').width}
                  carouselHeight={
                    200
                    // Image.resolveAssetSource({uri: story.photos[0]}).height
                  }
                />
              </ContentContainer>
            )}
            <ContentContainer paddingHorizontal={16} paddingBottom={10}>
              {isStory ? (
                <StoryItemContents inDetail={true} story={story} />
              ) : (
                <Pressable onPress={onClickWrite}>
                  <ContentContainer
                    useHorizontalLayout
                    justifyContent={'flex-start'}
                    paddingHorizontal={16}
                    gap={2.5}
                    width={'165px'}
                    height={'48px'}
                    borderRadius={32}
                    backgroundColor={Color.PRIMARY_LIGHT}
                    withUpperShadow>
                    <Icon
                      size={20}
                      name={'add-circle'}
                      color={Color.WHITE}
                      style={{margin: 2}}
                    />
                    <XSmallTitle color={Color.WHITE}>
                      이야기 작성하기
                    </XSmallTitle>
                  </ContentContainer>
                </Pressable>
              )}
            </ContentContainer>
          </ScrollContentContainer>
        </ScreenContainer>
        <BottomSheet
          ref={bottomSheetModalRef}
          index={1}
          onDismiss={handleClosePress}
          snapPoints={snapPoints}>
          <StoryDetailMenu type={isStory ? 'story' : 'photo'} />
        </BottomSheet>
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};
export default StoryDetailPage;
