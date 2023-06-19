import React, {useEffect, useState} from 'react';

import {Button, Dimensions, ScrollView, View} from 'react-native';
import styles from './styles';
import HelpQuestion from '../../components/help-question/HelpQuestion';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  storyTextState,
  writingStoryState,
} from '../../recoils/story-writing.recoil';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../../components/styled/container/ContentContainer';
import {StoryKeyboard} from '../../components/story/StoryKeyboard';
import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {usePhotoLibrary} from '../../service/hooks/photo.hook';
import {
  mainSelectedPhotoState,
  selectedPhotoState,
} from '../../recoils/selected-photo.recoil';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {KeyboardContainer} from '../../components/styled/container/KeyboardContainer';
import SelectedPhotoList from '../../components/photo/SelectedPhotoList';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useSaveStory} from '../../service/hooks/story.write.hook';
import WritingHeaderLeft from '../../components/header/WritingHeaderLeft';
import {helpQuestionTextState} from '../../recoils/help-question.recoil';

const DeviceWidth = Dimensions.get('window').width;

const PuzzleWritingTextPage = (): JSX.Element => {
  const helpQuestion = useRecoilValue(helpQuestionTextState);
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');

  const writingStory = useRecoilValue(writingStoryState);
  const setStoryTextInfo = useSetRecoilState(storyTextState);

  const selectedPhotoList = useRecoilValue(selectedPhotoState);
  const [saveStory, isLoading] = useSaveStory();
  useEffect(() => {
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
    <>
      <ScreenContainer>
        <HelpQuestion />
        <HorizontalContentContainer height={'24px'}>
          <ContentContainer flex={0.5}>
            <WritingHeaderLeft type="before" />
          </ContentContainer>
          <ContentContainer flex={10}>
            <BasicTextInput
              customStyle={styles.titleInput}
              placeholder="제목을 입력해주세요."
              text={title}
              autoFocus={true}
              onChangeText={setTitle}
              mode={'flat'}
            />
          </ContentContainer>
          <ContentContainer flex={1}>
            <LoadingContainer isLoading={isLoading}>
              <WritingHeaderRight
                text="등록"
                customAction={() => {
                  saveStory();
                }}
              />
            </LoadingContainer>
          </ContentContainer>
        </HorizontalContentContainer>
        <ContentContainer flex={10}>
          <BasicTextInput
            customStyle={styles.contentInput}
            placeholder="본문에 새로운 이야기를 작성해보세요!"
            text={storyText}
            onChangeText={setStoryText}
            multiline={true}
            mode={'outlined'}
            maxLength={500}
          />
          <SelectedPhotoList
            width={80}
            height={60}
            photoList={selectedPhotoList}
          />
        </ContentContainer>
      </ScreenContainer>
      <KeyboardContainer>
        <StoryKeyboard />
      </KeyboardContainer>
    </>
  );
};

export default PuzzleWritingTextPage;
