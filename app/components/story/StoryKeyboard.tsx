import {View} from 'react-native';
import React from 'react';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {recordFileState} from '../../recoils/story-writing.recoil';
import {StoryKeyboardPhotoRecord} from './StoryKeyboardPhotoRecord';
import {StoryKeyboardVideoRecord} from './StoryKeyboardVideoRecord';
import {StoryKeyboardVoiceRecord} from './StoryKeyboardVoiceRecord';
import {styles} from './styles';
import {VerticalLine} from '../styled/container/KeyboardContainer';

export const StoryKeyboard = (): JSX.Element => {
  const recordFileInfo = useRecoilValue(recordFileState);
  const resetRecord = useResetRecoilState(recordFileState);

  const hasRecordFile = function () {
    return recordFileInfo != undefined && recordFileInfo?.filePath != undefined;
  };

  const getFileName = function () {
    if (!hasRecordFile()) {
      return '';
    }

    const fileParts = recordFileInfo?.filePath?.split('/') || [];
    const recordName = fileParts[fileParts?.length - 1];

    return decodeURI(recordName);
  };

  return (
    <>
      <StoryKeyboardPhotoRecord></StoryKeyboardPhotoRecord>
      <VerticalLine></VerticalLine>
      <StoryKeyboardVideoRecord></StoryKeyboardVideoRecord>
      <VerticalLine></VerticalLine>
      <StoryKeyboardVoiceRecord></StoryKeyboardVoiceRecord>
    </>
  );
};
