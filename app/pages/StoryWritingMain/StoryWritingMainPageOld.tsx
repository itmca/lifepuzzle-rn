import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import styles from './styles';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  PostStoryKeyState,
  isModalOpening,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {LargeText, SmallText} from '../../components/styled/components/Text';
import StoryDateInput from './StoryDateInput';
import {useKeyboardVisible} from '../../service/hooks/keyboard';
import {List} from 'react-native-paper';
import {StoryKeyboardPhotoRecord} from '../../components/story/StoryKeyboardPhotoRecord';
import {StoryKeyboardVideoRecord} from '../../components/story/StoryKeyboardVideoRecord';
import {StoryKeyboardVoiceRecord} from '../../components/story/StoryKeyboardVoiceRecord';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useIsStoryUploading} from '../../service/hooks/story.write.hook';
import {Color} from '../../constants/color.constant';
import {MediumImage} from '../../components/styled/components/Image';
import ImageModal from '../../components/alert/ImageModal';
import {heroState} from '../../recoils/hero.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

const StoryWritingMainPageOld = (): JSX.Element => {
  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);

  const helpQuestion = writingStory?.helpQuestionText || '';
  const isKeyboardVisible = useKeyboardVisible();
  const ishelpQuestionVisible = helpQuestion.length != 0;
  const isStoryUploading = useIsStoryUploading();
  const [isModalOpen, setModalOpen] = useRecoilState(isModalOpening);

  const hero = useRecoilValue(heroState);
  useEffect(() => {
    setTitle(writingStory?.title || '');
    setStoryText(writingStory?.storyText || '');
  }, []);

  useEffect(() => {
    setWritingStory({
      title: title,
      storyText: storyText,
    });
  }, [title, storyText]);

  const navigation = useNavigation<BasicNavigationProps>();
  const postStoryKey = useRecoilValue(PostStoryKeyState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);

  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenContainer gap={0} withDebugBorder>
          {!ishelpQuestionVisible ? (
            <>
              <ContentContainer
                paddingHorizontal={16}
                style={StyleSheet.compose(styles.screenHTopContainer, {
                  height: 50,
                  backgroundColor: Color.WHITE,
                  borderBottomWidth: 0,
                })}>
                <StoryDateInput
                  value={writingStory?.date}
                  onChange={(date: Date) => {
                    setWritingStory({date});
                  }}
                  backgroundColor={Color.SECONDARY_LIGHT}
                  color={Color.PRIMARY_MEDIUM}
                />
              </ContentContainer>
            </>
          ) : (
            <>
              <ContentContainer style={styles.screenHTopContainer}>
                <StoryDateInput
                  value={writingStory.date}
                  onChange={(date: Date) => {
                    setWritingStory({date});
                  }}
                />
              </ContentContainer>
              <ContentContainer
                backgroundColor={Color.DARK_GRAY}
                borderTopWidth={0}>
                <SmallText
                  color={Color.WHITE}
                  fontWeight={700}
                  style={{marginLeft: 10}}>
                  이번달 추천질문
                </SmallText>
                <List.Accordion
                  title={<LargeText fontWeight={700}>{helpQuestion}</LargeText>}
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
              </ContentContainer>
            </>
          )}
          <ContentContainer height={'50px'}>
            <BasicTextInput
              customStyle={styles.titleInput}
              placeholder="제목을 입력해주세요."
              text={title}
              onChangeText={setTitle}
              mode={'outlined'}
              underlineColor={'transparent'}
              activeUnderlineColor={'transparent'}
              borderColor={'transparent'}
              backgroundColor={'transparent'}
            />
          </ContentContainer>
          <ContentContainer height={'100%'} flex={1}>
            <BasicTextInput
              customStyle={{flex: 1}}
              placeholder="글작성을 완료해서 퍼즐을 맞춰보세요!"
              text={storyText}
              onChangeText={setStoryText}
              multiline={true}
              mode={'outlined'}
              borderColor={'transparent'}
              backgroundColor={'transparent'}
            />
          </ContentContainer>
          {ishelpQuestionVisible && (
            <MediumImage
              width={55}
              height={55}
              source={require('../../assets/images/puzzle-character.png')}
              style={{position: 'absolute', top: 45, right: 20}}
            />
          )}
          <ContentContainer>
            <>
              {!isKeyboardVisible ? (
                <>
                  <List.Section
                    style={{
                      borderTopColor: Color.LIGHT_GRAY,
                      borderTopWidth: 8,
                    }}>
                    <StoryKeyboardPhotoRecord />
                    <StoryKeyboardVideoRecord />
                  </List.Section>
                </>
              ) : (
                !ishelpQuestionVisible && (
                  <KeyboardAccessoryView
                    behavior={Platform.OS === 'ios' && 'padding'}
                    style={{
                      flex: 1,
                      borderTopWidth: 0,
                      backgroundColor: 'transparent',
                      alignItems: 'flex-end',
                      paddingRight: 20,
                    }}>
                    <MediumImage
                      width={64}
                      height={61}
                      source={require('../../assets/images/puzzle-character-reading.png')}
                    />
                  </KeyboardAccessoryView>
                )
              )}
            </>
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
    </LoadingContainer>
  );
};

export default StoryWritingMainPageOld;
