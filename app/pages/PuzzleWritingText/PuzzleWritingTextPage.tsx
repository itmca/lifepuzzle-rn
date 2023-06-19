import React, {useEffect, useState} from 'react';

import {Dimensions, ScrollView, View} from 'react-native';
import styles from './styles';
import HelpQuestion from '../../components/help-question/HelpQuestion';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  storyTextState,
  writingStoryState,
} from '../../recoils/story-writing.recoil';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {StoryKeyboard} from '../../components/story/StoryKeyboard';
import SelectablePhoto from '../../components/photo/SelectablePhoto';
import {usePhotoLibrary} from '../../service/hooks/photo.hook';
import {
  mainSelectedPhotoState,
  selectedPhotoState,
} from '../../recoils/selected-photo.recoil';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {KeyboardContainer} from '../../components/styled/container/KeyboardContainer';

const DeviceWidth = Dimensions.get('window').width;

const PuzzleWritingTextPage = (): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');

  const writingStory = useRecoilValue(writingStoryState);
  const setStoryTextInfo = useSetRecoilState(storyTextState);

  const {photos} = usePhotoLibrary();
  const setSelectedPhotoList = useSetRecoilState(selectedPhotoState);
  const selectedPhotoList = useRecoilValue(selectedPhotoState);
  const selectedPhoto = useRecoilValue(mainSelectedPhotoState);

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
        <ContentContainer gap="16px" flex={1}>
          <HelpQuestion />
          <BasicTextInput
            customStyle={styles.titleInput}
            placeholder="제목을 입력해주세요."
            text={title}
            autoFocus={true}
            onChangeText={setTitle}
          />
          <BasicTextInput
            customStyle={styles.contentInput}
            placeholder="본문에 새로운 이야기를 작성해보세요!"
            text={storyText}
            onChangeText={setStoryText}
            multiline={true}
            mode={'outlined'}
            maxLength={5}
          />
          <ScrollView
            style={{height: 500}}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {selectedPhotoList?.map((photo, index) => {
              return (
                <SelectablePhoto
                  key={index}
                  onSelected={() => {}}
                  //! size 수정 필요
                  onDeselected={() => {}}
                  size={80}
                  photo={photo}
                />
              );
            })}
          </ScrollView>
        </ContentContainer>
      </ScreenContainer>
      <KeyboardContainer>
        <StoryKeyboard />
      </KeyboardContainer>
    </>
  );
};

export default PuzzleWritingTextPage;
