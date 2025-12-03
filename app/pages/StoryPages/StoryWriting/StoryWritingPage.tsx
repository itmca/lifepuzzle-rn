import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoryDateInput from './StoryDateInput.tsx';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { useIsStoryUploading } from '../../../service/story/story.write.hook.ts';

import { Color } from '../../../constants/color.constant.ts';
import { AdaptiveImage } from '../../../components/ui/base/ImageBase';
import { useStoryStore } from '../../../stores/story.store';
import { useMediaStore } from '../../../stores/media.store';
import SelectDropdown from 'react-native-select-dropdown';
import { GalleryItem } from '../../../types/core/writing-story.type';
import { SvgIcon } from '../../../components/ui/display/SvgIcon';
import { Title } from '../../../components/ui/base/TextBase';
import { PlainTextInput } from '../../../components/ui/form/TextInput.tsx';
import { VoiceAddButton } from '../../../components/feature/voice/VoiceAddButton';
import TextAreaInput from '../../../components/ui/form/TextAreaInput';
import { ScrollView } from 'react-native-gesture-handler';
import { VoiceBottomSheet } from '../../../components/feature/story/VoiceBottomSheet.tsx';
import { AudioBtn } from '../../../components/feature/story/AudioBtn.tsx';
import { Divider } from '../../../components/ui/base/Divider';
import logger from '../../../utils/logger';

const StoryWritingPage = (): React.ReactElement => {
  // React hooks
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [imageHeight, setImageHeight] = useState<number>(280);

  // 글로벌 상태 관리 (Zustand)
  const writingStory = useStoryStore(state => state.writingStory);
  const setWritingStory = useStoryStore(state => state.setWritingStory);
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);

  // Custom hooks
  const isStoryUploading = useIsStoryUploading();
  const insets = useSafeAreaInsets();

  // Constants
  const MAX_IMAGE_HEIGHT = 280;
  const IMAGE_WIDTH = Dimensions.get('window').width;

  // 이미지 크기를 가져와서 최적의 높이 계산
  useEffect(() => {
    const loadImageDimension = async () => {
      if (!writingStory.gallery || writingStory.gallery.length === 0) {
        return;
      }

      const uri = writingStory.gallery[0].uri;

      try {
        const dimension = await new Promise<{ width: number; height: number }>(
          (resolve, reject) => {
            Image.getSize(
              uri,
              (w, h) => resolve({ width: w, height: h }),
              reject,
            );
          },
        );

        const aspectRatio = dimension.height / dimension.width;
        const calculatedHeight = (IMAGE_WIDTH - 40) * aspectRatio;
        setImageHeight(Math.min(calculatedHeight, MAX_IMAGE_HEIGHT));
      } catch (error) {
        logger.debug('Failed to get image size:', uri, error);
        setImageHeight(MAX_IMAGE_HEIGHT);
      }
    };

    loadImageDimension();
  }, [writingStory.gallery, IMAGE_WIDTH, MAX_IMAGE_HEIGHT]);

  // Early return after all hooks
  if (!writingStory.gallery || writingStory.gallery.length === 0) {
    return <></>;
  }

  const galleryItem = writingStory.gallery[0];
  const currentAgeGroup = ageGroups?.[galleryItem.tagKey];
  const ageGroupStartDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.startYear, 0, 1));
  const ageGroupEndDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.endYear, 11, 31));

  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          backgroundColor: 'transparent',
          flex: 1,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ContentContainer height={'100%'} paddingBottom={15}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingTop: 15,
              }}
              keyboardShouldPersistTaps={'handled'}
            >
              <ContentContainer paddingHorizontal={20}>
                <SelectDropdown
                  data={tags || []}
                  onSelect={(selectedItem, _) => {
                    const gallery: GalleryItem[] =
                      writingStory.gallery?.map(i => ({
                        ...i,
                        tagKey: selectedItem.key,
                      })) ?? [];
                    setWritingStory({ gallery });
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <ContentContainer
                        gap={8}
                        style={{
                          height: 24,
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Title
                          color={
                            selectedItem && selectedItem.label
                              ? Color.GREY_700
                              : Color.GREY_400
                          }
                        >
                          {(selectedItem && selectedItem.label) || '나이대'}
                        </Title>
                        <SvgIcon
                          name={isOpened ? 'chevronUp' : 'chevronDown'}
                        />
                      </ContentContainer>
                    );
                  }}
                  dropdownStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                    width: 70,
                  }}
                  dropdownOverlayColor={'transparent'}
                  renderItem={(item, _index, _isSelected) => {
                    return (
                      <ContentContainer withContentPadding gap={8}>
                        <Title color={Color.GREY_700}>{item.label}</Title>
                      </ContentContainer>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </ContentContainer>

              <ContentContainer
                paddingVertical={4}
                paddingHorizontal={20}
                alignItems="center"
              >
                <View
                  style={{
                    width: IMAGE_WIDTH - 40,
                    height: imageHeight,
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <AdaptiveImage
                    uri={galleryItem.uri}
                    resizeMode="contain"
                    borderRadius={0}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </ContentContainer>

              <ContentContainer
                flex={1}
                paddingHorizontal={20}
                paddingTop={4}
                gap={0}
              >
                <Divider marginVertical={0} paddingHorizontal={16} height={3} />
                <ContentContainer flex={1} paddingTop={24}>
                  <PlainTextInput
                    text={writingStory.title ?? ''}
                    onChangeText={text => {
                      setWritingStory({ title: text });
                    }}
                    placeholder={'제목을 입력해주세요'}
                    validations={[
                      {
                        condition: (text: string) => !!text,
                        errorText: '제목을 입력해주세요',
                      },
                    ]}
                  />
                  <ContentContainer
                    flex={1}
                    minHeight="120px"
                    backgroundColor={Color.GREY}
                  >
                    <TextAreaInput
                      text={writingStory.content ?? ''}
                      onChangeText={text => {
                        setWritingStory({ content: text });
                      }}
                      placeholder={'내용을 입력해주세요'}
                      validations={[
                        {
                          condition: (text: string) => !!text,
                          errorText: '내용을 입력해주세요',
                        },
                      ]}
                    />
                  </ContentContainer>
                </ContentContainer>
              </ContentContainer>

              <ContentContainer
                paddingHorizontal={20}
                paddingTop={24}
                paddingBottom={insets.bottom + 20}
              >
                {writingStory.voice ? (
                  <AudioBtn
                    audioUrl={writingStory.voice}
                    onPlay={() => {
                      setOpenModal(true);
                    }}
                  />
                ) : (
                  <VoiceAddButton
                    onPress={() => {
                      setOpenModal(true);
                    }}
                  />
                )}
                <StoryDateInput
                  startDate={ageGroupStartDate}
                  endDate={ageGroupEndDate}
                  value={''}
                  onChange={(date: Date) => {
                    setWritingStory({ date });
                  }}
                />
              </ContentContainer>
            </ScrollView>
          </ContentContainer>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <VoiceBottomSheet
        opened={openModal}
        editable
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </LoadingContainer>
  );
};

export default StoryWritingPage;
