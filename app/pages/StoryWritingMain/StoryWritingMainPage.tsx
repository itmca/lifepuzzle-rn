import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import styles from './styles';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  helpQuestionTextState,
  isModalOpening,
  storyDateState,
  storyTextState,
  writingStoryState,
} from '../../recoils/story-writing.recoil';
import {
  NoOutLineFullScreenContainer,
  ScreenContainer,
} from '../../components/styled/container/ScreenContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {LargeText, SmallText} from '../../components/styled/components/Text';
import StoryDateInput from '../../components/story/StoryDateInput';
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

const StoryWritingMainPage = (): JSX.Element => {
  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const helpQuestion = useRecoilValue(helpQuestionTextState);
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');
  const [storyDate, setStoryDate] = useRecoilState<Date | undefined>(
    storyDateState,
  );
  const [writingStory] = useRecoilState(writingStoryState);
  const setStoryTextInfo = useSetRecoilState(storyTextState);

  const isKeyboardVisible = useKeyboardVisible();
  const ishelpQuestionVisible = helpQuestion.length != 0;
  const isStoryUploading = useIsStoryUploading();
  const setIsModalOpening = useSetRecoilState(isModalOpening);

  useEffect(() => {
    setStoryDate(writingStory?.date || new Date());
    setTitle(writingStory?.title || '');
    setStoryText(writingStory?.storyText || '');
  }, []);

  useEffect(() => {
    setStoryTextInfo({
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
              <ScreenContainer
                style={StyleSheet.compose(styles.screenHTopContainer, {
                  height: 50,
                  backgroundColor: Color.WHITE,
                  borderBottomWidth: 0,
                })}>
                <StoryDateInput
                  date={storyDate}
                  onChange={setStoryDate}
                  style={styles.dateInput}
                  backgroundColor={Color.SECONDARY_LIGHT}
                  color={Color.PRIMARY_MEDIUM}
                />
              </ScreenContainer>
            </>
          ) : (
            <>
              <ScreenContainer style={styles.screenHTopContainer}>
                <StoryDateInput
                  date={storyDate}
                  onChange={setStoryDate}
                  style={styles.dateInput}
                />
                <SmallText
                  color={Color.WHITE}
                  fontWeight={700}
                  style={{marginLeft: 15}}>
                  이번달 추천질문
                </SmallText>
              </ScreenContainer>
              <OutLineContentContainer style={styles.screenLTopContainer}>
                <List.Accordion
                  title={
                    <LargeText fontWeight={700} lineHeight={'21px'}>
                      {helpQuestion}
                    </LargeText>
                  }
                  right={() => <></>}
                  onPress={() => {
                    numberOfLines == 1
                      ? setNumberOfLines(0)
                      : setNumberOfLines(1);
                  }}
                  titleNumberOfLines={numberOfLines}
                  style={styles.helpQuestionContainer}
                  theme={{
                    colors: {background: 'transparent'},
                  }}></List.Accordion>
              </OutLineContentContainer>
            </>
          )}
          <ScreenContainer style={styles.screenCenterContainer}>
            <BasicTextInput
              customStyle={styles.titleInput}
              placeholder="제목을 입력해주세요."
              text={title}
              onChangeText={setTitle}
              mode={'outlined'}
              underlineColor={'transparent'}
              activeUnderlineColor={'transparent'}
            />
          </ScreenContainer>
          <ScreenContainer style={styles.screenBottomContainer}>
            <BasicTextInput
              customStyle={{flex: 1}}
              placeholder="글작성을 완료해서 퍼즐을 맞춰보세요!"
              text={storyText}
              onChangeText={setStoryText}
              multiline={true}
              mode={'outlined'}
            />
          </ScreenContainer>
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
                    <StoryKeyboardPhotoRecord></StoryKeyboardPhotoRecord>
                    <StoryKeyboardVideoRecord></StoryKeyboardVideoRecord>
                    <StoryKeyboardVoiceRecord></StoryKeyboardVoiceRecord>
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
                  <MediumImage
                    width={64}
                    height={61}
                    source={require('../../assets/images/puzzle-character-reading.png')}
                    style={{position: 'absolute', top: -60, right: 20}}
                  />
                )
              )}
            </>
          </ContentContainer>
        </NoOutLineFullScreenContainer>
      </TouchableWithoutFeedback>
    </LoadingContainer>
  );
};

export default StoryWritingMainPage;
