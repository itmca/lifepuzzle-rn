import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WritingHeaderLeft from '../../components/header/WritingHeaderLeft';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import PuzzleWritingPhotoPage from '../../pages/PuzzleWritingPhoto/PuzzleWritingPhotoPage';
import PuzzleWritingTextPage from '../../pages/PuzzleWritingText/PuzzleWritingTextPage';
import PuzzleWritingVoicePage from '../../pages/PuzzleWritingVoice/PuzzleWritingVoicePage';
import PuzzleWritingDatePage from '../../pages/PuzzleWritingDate/PuzzleWritingDatePage';

import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useSaveStory} from '../../service/hooks/story.write.hook';
import Title from '../../components/styled/components/Title';

export type PuzzleWritingParamList = {
  PuzzleWritingDate: undefined;

  PuzzleWritingPhoto: undefined;
  PuzzleWritingText: undefined;
  PuzzleWritingVoice: undefined;
};

const Stack = createNativeStackNavigator<PuzzleWritingParamList>();

const PuzzleWritingNavigator = (): JSX.Element => {
  const [saveStory, isLoading] = useSaveStory();

  return (
    <Stack.Navigator
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="PuzzleWritingDate"
        component={PuzzleWritingDatePage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>조각 맞추기</Title>,
          headerBackVisible:false,
          headerRight: () => (
            <WritingHeaderRight
              text="다음"
              nextScreenName="PuzzleWritingPhoto"
            />
          ),
        }}
      />
      <Stack.Screen
        name="PuzzleWritingPhoto"
        component={PuzzleWritingPhotoPage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>조각 맞추기</Title>,
          headerBackVisible:false,
          headerRight: () => (
            <WritingHeaderRight
              text="다음"
              nextScreenName="PuzzleWritingText"
            />
          ),
        }}
      />
      <Stack.Screen
        name="PuzzleWritingText"
        component={PuzzleWritingTextPage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>조각 맞추기</Title>,
          headerBackVisible:false,
          headerRight: () => (
            <LoadingContainer isLoading={isLoading}>
              <WritingHeaderRight
                text="완료"
                customAction={() => {
                  saveStory();
                }}
              />
            </LoadingContainer>
          ),
        }}
      />
      <Stack.Screen
        name="PuzzleWritingVoice"
        component={PuzzleWritingVoicePage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>음성 녹음</Title>,
          headerBackVisible:false,
        }}
      />
    </Stack.Navigator>
  );
};

export default PuzzleWritingNavigator;
