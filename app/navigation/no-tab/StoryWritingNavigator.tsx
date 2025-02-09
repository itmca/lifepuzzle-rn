import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WritingHeaderLeft from '../../components/header/WritingHeaderLeft';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import StoryWritingVoicePage from '../../pages/StoryWritingVoice/StoryWritingVoicePage';
import {useSaveStory} from '../../service/hooks/story.write.hook';
import Title, {SmallTitle} from '../../components/styled/components/Title';
import StoryWritingQuestionPage from '../../pages/StoryWritingQuestion/StoryWritingQuestionPage';
import StorySelectingGallery from '../../pages/StoryGallerySelector/StoryGallerySelector.tsx';
import {LegacyColor} from '../../constants/color.constant';
import {useRecoilValue} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {PostStoryKeyState} from '../../recoils/story-write.recoil';
import StoryWritingMainPage from '../../pages/StoryWritingMain/StoryWritingMainPage.tsx';
import {useUploadGallery} from '../../service/hooks/gallery.write.hook.ts';

// TODO(border-line): 화면 이름 적절하게 바꾸기 e.g. StoryWritingQuestion -> StoryRecommendQuestion
export type StoryWritingParamList = {
  StoryWritingQuestion: undefined;
  StoryWritingMain: undefined;
  StoryGallerySelector: undefined;
  StoryWritingVoice: undefined;
};

const Stack = createNativeStackNavigator<StoryWritingParamList>();

const StoryWritingNavigator = (): JSX.Element => {
  const [saveStory] = useSaveStory();
  const [uploadGallery] = useUploadGallery();
  const selectedStoryKey = useRecoilValue(SelectedStoryKeyState);
  const postStoryKey = useRecoilValue(PostStoryKeyState);

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
            <WritingHeaderRight
              text="다음"
              nextScreenName="StoryWritingVoice"
            />
          ),
        }}
      />
      <Stack.Screen
        name="StoryWritingMain"
        component={StoryWritingMainPage}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => (
            <SmallTitle color={LegacyColor.LIGHT_BLACK}>
              {selectedStoryKey ? '글수정' : postStoryKey ? '글작성' : '글작성'}
            </SmallTitle>
          ),
          headerRight: () => (
            <WritingHeaderRight
              text={selectedStoryKey ? '수정' : postStoryKey ? '등록' : '등록'}
              customAction={() => {
                saveStory();
              }}
            />
          ),
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="StoryGallerySelector"
        component={StorySelectingGallery}
        options={{
          headerLeft: () => <WritingHeaderLeft type="before" />,
          headerTitle: () => <Title>사진/비디오</Title>,
          headerRight: () => (
            <WritingHeaderRight
              text={'업로드'}
              customAction={() => {
                uploadGallery();
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
    </Stack.Navigator>
  );
};

export default StoryWritingNavigator;
