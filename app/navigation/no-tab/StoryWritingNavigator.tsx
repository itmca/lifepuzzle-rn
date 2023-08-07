import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WritingHeaderLeft from '../../components/header/WritingHeaderLeft';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import StoryWritingMainPage from '../../pages/StoryWritingMain/StoryWritingMainPage';
import StoryWritingVoicePage from '../../pages/StoryWritingVoice/StoryWritingVoicePage';
import {useSaveStory} from '../../service/hooks/story.write.hook';
import Title from '../../components/styled/components/Title';
import StoryWritingQuestionPage from '../../pages/StoryWritingQuestion/StoryWritingQuestionPage';
import StorySelectingPhotoPage from '../../pages/StorySelectingPhoto/StorySelectingPhotoPage';
import StorySelectingVideoPage from '../../pages/StorySelectingVideo/StorySelectingVideoPage';

export type StoryWritingParamList = {
  StoryWritingQuestion: undefined;
  StoryWritingMain: undefined;
  StorySelectingPhoto: undefined;
  StorySelectingVideo: undefined;
  StoryWritingVoice: undefined;
};

const Stack = createNativeStackNavigator<StoryWritingParamList>();

const StoryWritingNavigator = (): JSX.Element => {
  const [saveStory] = useSaveStory();

  return (
    <Stack.Navigator
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="StoryWritingQuestion"
        component={StoryWritingQuestionPage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>월별추천질문</Title>,
          headerBackVisible: false,
          headerRight: () => (
            <WritingHeaderRight text="다음" nextScreenName="StoryWritingMain" />
          ),
        }}
      />
      <Stack.Screen
        name="StoryWritingMain"
        component={StoryWritingMainPage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>글작성</Title>,
          headerRight: () => (
            <WritingHeaderRight
              text="등록"
              customAction={() => {
                saveStory();
              }}
            />
          ),
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="StoryWritingVoice"
        component={StoryWritingVoicePage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>음성 녹음</Title>,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="StorySelectingPhoto"
        component={StorySelectingPhotoPage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>사진 업로드</Title>,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="StorySelectingVideo"
        component={StorySelectingVideoPage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>영상 업로드</Title>,
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default StoryWritingNavigator;
