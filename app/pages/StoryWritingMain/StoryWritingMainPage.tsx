import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import styles from './styles';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  isModalOpening,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {
  NoOutLineFullScreenContainer,
  ScreenContainer,
} from '../../components/styled/container/ScreenContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {LargeText, SmallText} from '../../components/styled/components/Text';
import StoryDateInput from './StoryDateInput';
import {useKeyboardVisible} from '../../service/hooks/keyboard';
import {List} from 'react-native-paper';
import {StoryKeyboardPhotoRecord} from '../../components/story/StoryKeyboardPhotoRecord';
import {StoryKeyboardVideoRecord} from '../../components/story/StoryKeyboardVideoRecord';
import {StoryKeyboardVoiceRecord} from '../../components/story/StoryKeyboardVoiceRecord';
import {
  ContentContainer,
  OutLineContentContainer,
} from '../../components/styled/container/ContentContainer';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useIsStoryUploading} from '../../service/hooks/story.write.hook';
import {Color} from '../../constants/color.constant';
import {MediumImage} from '../../components/styled/components/Image';
import WriteCompletedModal from '../../components/alert/WriteCompletedModal';
import {heroState} from '../../recoils/hero.recoil';

const StoryWritingMainPage = (): JSX.Element => {
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

  return (
    <LoadingContainer isLoading={isStoryUploading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <NoOutLineFullScreenContainer>
          {!ishelpQuestionVisible ? (
            <>
              <OutLineContentContainer
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
              </OutLineContentContainer>
            </>
          ) : (
            <>
              <OutLineContentContainer style={styles.screenHTopContainer}>
                <StoryDateInput
                  value={writingStory.date}
                  onChange={(date: Date) => {
                    setWritingStory({date});
                  }}
                />
              </OutLineContentContainer>
              <OutLineContentContainer
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
              </OutLineContentContainer>
            </>
          )}
          <OutLineContentContainer height={'50px'} borderTopWidth={2}>
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
          </OutLineContentContainer>
          <OutLineContentContainer height={'100%'} flex={1} borderTopWidth={2}>
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
          </OutLineContentContainer>
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
                    <StoryKeyboardVoiceRecord />
                  </List.Section>
                  {!ishelpQuestionVisible && (
                    <MediumImage
                      width={55}
                      height={55}
                      source={require('../../assets/images/puzzle-character.png')}
                      style={{position: 'absolute', top: -40, right: 20}}
                    />
                  )}
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

          <WriteCompletedModal
            heroNickName={hero.heroNickName}
            isModalOpen={isModalOpen}
          />
        </NoOutLineFullScreenContainer>
      </TouchableWithoutFeedback>
    </LoadingContainer>
  );
};

export default StoryWritingMainPage;
