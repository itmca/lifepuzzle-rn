import React from 'react';
import {StoryKeyboardPhotoRecord} from './StoryKeyboardPhotoRecord';
import {StoryKeyboardVideoRecord} from './StoryKeyboardVideoRecord';
import {StoryKeyboardVoiceRecord} from './StoryKeyboardVoiceRecord';
import {List} from 'react-native-paper';
export const StoryKeyboard = (): JSX.Element => {
  return (
    <List.Section>
      <StoryKeyboardPhotoRecord></StoryKeyboardPhotoRecord>
      <StoryKeyboardVideoRecord></StoryKeyboardVideoRecord>
      <StoryKeyboardVoiceRecord></StoryKeyboardVoiceRecord>
    </List.Section>
  );
};
