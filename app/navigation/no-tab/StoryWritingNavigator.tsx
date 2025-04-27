import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WritingHeaderLeft from '../../components/header/WritingHeaderLeft';
import WritingHeaderRight from '../../components/header/WritingHeaderRight';
import StoryWritingVoicePage from '../../pages/StoryWritingVoice/StoryWritingVoicePage';
import {useSaveStory} from '../../service/hooks/story.write.hook';
import Title from '../../components/styled/components/Title';
import StorySelectingGallery from '../../pages/StoryGallerySelector/StoryGallerySelector.tsx';
import {useRecoilValue} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import StoryWritingMainPage from '../../pages/StoryWritingMain/StoryWritingMainPage.tsx';
import {useUploadGallery} from '../../service/hooks/gallery.write.hook.ts';
import {TopBar} from '../../components/styled/components/TopBar.tsx';

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

  return (
    <Stack.Navigator
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="StoryWritingMain"
        component={StoryWritingMainPage}
        options={{
          header: () => (
            <TopBar
              title={selectedStoryKey ? '수정하기' : '작성하기'}
              right={
                <WritingHeaderRight
                  text={selectedStoryKey ? '완료' : '등록'}
                  customAction={saveStory}
                />
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="StoryGallerySelector"
        component={StorySelectingGallery}
        options={{
          header: () => (
            <TopBar
              title={'사진/비디오'}
              right={
                <WritingHeaderRight
                  text={'업로드'}
                  customAction={() => {
                    uploadGallery();
                  }}
                />
              }
            />
          ),
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
