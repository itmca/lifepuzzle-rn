import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {LegacyBasicTextInput} from '../../components/input/LegacyBasicTextInput.tsx';
import StoryDateInput from './StoryDateInput';
import {useKeyboardVisible} from '../../service/hooks/keyboard';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useIsStoryUploading} from '../../service/hooks/story.write.hook';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {StoryWritingMenu} from '../../components/story/StoryWritingMenu';
import {ScrollView} from 'react-native-gesture-handler';
import {LegacyColor} from '../../constants/color.constant';
import {MediumImage} from '../../components/styled/components/Image.tsx';
import {ageGroupsState} from '../../recoils/photos.recoil.ts';

const StoryWritingMainPage = (): JSX.Element => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const isKeyboardVisible = useKeyboardVisible();
  const isStoryUploading = useIsStoryUploading();
  const ageGroups = useRecoilValue(ageGroupsState);

  if (!writingStory.gallery || writingStory.gallery.length === 0) {
    return <></>;
  }

  const galleryItem = writingStory.gallery[0];
  const currentAgeGroup = ageGroups[galleryItem.tagKey];
  const ageGroupStartDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.startYear, 0, 1));
  const ageGroupEndDate =
    currentAgeGroup && new Date(Date.UTC(currentAgeGroup.endYear, 11, 31));

  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <BottomSheetModalProvider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ContentContainer>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{
                borderTopWidth: 1,
                borderTopColor: LegacyColor.LIGHT_GRAY,
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
              }}>
              <ContentContainer height={'100%'} gap={0}>
                <ContentContainer
                  flex={1}
                  maxHeight={'40%'}
                  backgroundColor={LegacyColor.BLACK}>
                  <MediumImage
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    source={{uri: galleryItem.uri}}
                    resizeMode={'contain'}
                  />
                </ContentContainer>
                <ContentContainer expandToEnd withScreenPadding>
                  <ContentContainer>
                    <StoryDateInput
                      startDate={ageGroupStartDate}
                      endDate={ageGroupEndDate}
                      value={writingStory.date || ageGroupEndDate}
                      onChange={(date: Date) => {
                        setWritingStory({date});
                      }}
                    />
                  </ContentContainer>
                  <ContentContainer>
                    <LegacyBasicTextInput
                      customStyle={{
                        paddingHorizontal: 0,
                        height: 40,
                        lineHeight: 20,
                      }}
                      outlineStyle={{borderWidth: 0}}
                      placeholder="제목을 입력해주세요"
                      text={writingStory.title ?? ''}
                      onChangeText={text => {
                        setWritingStory({title: text});
                      }}
                      mode={'outlined'}
                      underlineColor={'transparent'}
                      activeUnderlineColor={'transparent'}
                      borderColor={'transparent'}
                      backgroundColor={'transparent'}
                      focusedBackgroundColor={'transparent'}
                    />
                  </ContentContainer>
                  <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps={'always'}>
                    <ContentContainer expandToEnd>
                      <LegacyBasicTextInput
                        noPadding
                        customStyle={{
                          flex: 1,
                        }}
                        outlineStyle={{borderWidth: 0}}
                        placeholder="사진과 관련된 이야기를 기록해보세요"
                        text={writingStory.content ?? ''}
                        onChangeText={text => {
                          setWritingStory({content: text});
                        }}
                        multiline={true}
                        mode={'outlined'}
                        borderColor={'transparent'}
                        backgroundColor={'transparent'}
                        focusedBackgroundColor={'transparent'}
                      />
                    </ContentContainer>
                  </ScrollView>
                </ContentContainer>
                <StoryWritingMenu keyboardVisible={isKeyboardVisible} />
              </ContentContainer>
            </KeyboardAvoidingView>
          </ContentContainer>
        </TouchableWithoutFeedback>
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default StoryWritingMainPage;
