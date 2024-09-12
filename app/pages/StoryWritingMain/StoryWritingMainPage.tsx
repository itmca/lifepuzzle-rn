import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import styles from './styles';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  isModalOpening,
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {LargeText} from '../../components/styled/components/Text';
import StoryDateInput from './StoryDateInput';
import {useKeyboardVisible} from '../../service/hooks/keyboard';
import {List} from 'react-native-paper';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useIsStoryUploading} from '../../service/hooks/story.write.hook';
import {MediumImage} from '../../components/styled/components/Image';
import ImageModal from '../../components/alert/ImageModal';
import {heroState} from '../../recoils/hero.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {StoryWritingMenu} from '../../components/story/StoryWritingMenu';
import SelectedPhotoList from '../../components/photo/SelectedPhotoList';
import {ScrollContainer} from '../../components/styled/container/ScrollContainer';
import {ScrollView} from 'react-native-gesture-handler';
import {Color} from '../../constants/color.constant';

const StoryWritingMainPage = (): JSX.Element => {
  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);

  const helpQuestion = writingStory?.helpQuestionText || '';
  const isKeyboardVisible = useKeyboardVisible();
  const ishelpQuestionVisible = helpQuestion.length != 0;
  const isStoryUploading = useIsStoryUploading();
  const [isModalOpen, setModalOpen] = useRecoilState(isModalOpening);
  const hero = useRecoilValue(heroState);

  const navigation = useNavigation<BasicNavigationProps>();
  const postStoryKey = useRecoilValue(PostStoryKeyState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);
  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <BottomSheetModalProvider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScreenContainer gap={0}>
            <ContentContainer withScreenPadding flex={1}>
              <ContentContainer>
                <StoryDateInput
                  value={writingStory.date}
                  onChange={(date: Date) => {
                    setWritingStory({date});
                  }}
                />
                {ishelpQuestionVisible ? (
                  <>
                    <List.Accordion
                      title={
                        <LargeText fontWeight={700}>{helpQuestion}</LargeText>
                      }
                      right={() => <></>}
                      onPress={() => {
                        numberOfLines == 1
                          ? setNumberOfLines(0)
                          : setNumberOfLines(1);
                      }}
                      titleNumberOfLines={numberOfLines}
                      titleStyle={{marginLeft: -5}}
                      style={styles.helpQuestionContainer}
                      theme={{
                        colors: {background: 'transparent'},
                      }}
                    />
                    <MediumImage
                      width={32}
                      height={32}
                      source={require('../../assets/images/puzzle-character.png')}
                      style={{position: 'absolute', top: 15, right: 20}}
                    />
                  </>
                ) : (
                  <></>
                )}
              </ContentContainer>
              <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps={'always'}>
                <ContentContainer gap={0}>
                  <BasicTextInput
                    customStyle={styles.titleInput}
                    placeholder="제목을 입력해주세요."
                    text={writingStory.title ?? ''}
                    onChangeText={text => {
                      setWritingStory({title: text});
                    }}
                    mode={'outlined'}
                    underlineColor={'transparent'}
                    activeUnderlineColor={'transparent'}
                    borderColor={'transparent'}
                    backgroundColor={'transparent'}
                  />
                </ContentContainer>
                <SelectedPhotoList
                  target={'all'}
                  size={120}
                  upload={false}
                  cancel={true}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  contentContainerStyle={{}}
                  keyboardVerticalOffset={5}
                  style={{flex: 1}}>
                  <ContentContainer expandToEnd>
                    <BasicTextInput
                      customStyle={{flex: 1}}
                      placeholder="글작성을 완료해서 퍼즐을 맞춰보세요!"
                      text={writingStory.storyText ?? ''}
                      onChangeText={text => {
                        setWritingStory({storyText: text});
                      }}
                      multiline={true}
                      mode={'outlined'}
                      borderColor={'transparent'}
                      backgroundColor={'transparent'}
                    />
                  </ContentContainer>
                </KeyboardAvoidingView>
              </ScrollView>
            </ContentContainer>
            <ContentContainer width={'100%'}>
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={{
                  borderTopWidth: 1,
                  borderTopColor: Color.LIGHT_GRAY,
                  backgroundColor: 'transparent',
                  width: '100%',
                }}>
                <StoryWritingMenu keyboardVisible={isKeyboardVisible} />
              </KeyboardAvoidingView>
            </ContentContainer>
            <ImageModal
              message={`${hero.heroNickName}님의 퍼즐이 맞춰졌습니다!`}
              leftBtnText="메인 바로 가기"
              rightBtnText="퍼즐 조각 보러가기"
              onLeftBtnPress={() => {
                navigation.navigate('HomeTab', {screen: 'Home'});
                setModalOpen(false);
              }}
              onRightBtnPress={() => {
                setPostStoryKey(postStoryKey);
                navigation.navigate('NoTab', {
                  screen: 'StoryViewNavigator',
                  params: {
                    screen: 'Story',
                  },
                });
                setModalOpen(false);
              }}
              imageSource={require('../../assets/images/celebration-character.png')}
              isModalOpen={isModalOpen}
            />
          </ScreenContainer>
        </TouchableWithoutFeedback>
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default StoryWritingMainPage;
