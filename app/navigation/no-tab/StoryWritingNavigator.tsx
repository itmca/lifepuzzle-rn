import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';
import {useSaveStory} from '../../service/hooks/story.write.hook';
import StorySelectingGallery from '../../pages/GalleryPages/GallerySelector/StoryGallerySelector.tsx';
import FacebookGallerySelector from '../../pages/GalleryPages/FacebookGallerySelector/FacebookGallerySelector.tsx';
import {useRecoilState, useRecoilValue} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import StoryWritingPage from '../../pages/StoryPages/StoryWriting/StoryWritingPage.tsx';
import {useUploadGalleryV2} from '../../service/hooks/gallery.upload.hook.ts';
import {TopBar} from '../../components/ui/navigation/TopBar';
import GalleryDetail from '../../pages/GalleryPages/GalleryDetail/GalleryDetailPage.tsx';
import GalleryDetailFilter from '../../pages/GalleryPages/GalleryDetailFilter/GalleryDetailFilterPage.tsx';
import {
  editedGalleryItemsState,
  selectedGalleryItemsState,
} from '../../recoils/gallery-write.recoil.ts';

// TODO(border-line): 화면 이름 적절하게 바꾸기 e.g. StoryWritingQuestion -> StoryRecommendQuestion
export type StoryWritingParamList = {
  StoryWritingQuestion: undefined;
  StoryWritingMain: undefined;
  StoryGallerySelector: undefined;
  FacebookGallerySelector: undefined;
  GalleryDetail: undefined;
  GalleryDetailFilter: undefined;
  StoryWritingVoice: undefined;
};

const Stack = createNativeStackNavigator<StoryWritingParamList>();

const StoryWritingNavigator = (): JSX.Element => {
  const [saveStory] = useSaveStory();
  const [uploadGallery] = useUploadGalleryV2();
  const selectedStoryKey = useRecoilValue(SelectedStoryKeyState);
  const [selectedGalleryItems, setSelectedGalleryItems] = useRecoilState(
    selectedGalleryItemsState,
  );
  const [editGalleryItems, setEditGalleryItems] = useRecoilState(
    editedGalleryItemsState,
  );
  return (
    <Stack.Navigator
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="StoryWritingMain"
        component={StoryWritingPage}
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
        name="FacebookPhotoSelector"
        component={FacebookGallerySelector}
        options={{
          header: () => <TopBar title={'페이스북 사진'} />,
        }}
      />
      <Stack.Screen
        name="GalleryDetail"
        component={GalleryDetail}
        options={{
          header: () => (
            <TopBar
              title={'사진 편집'}
              right={
                <WritingHeaderRight
                  text={'업로드'}
                  customAction={() => {
                    setSelectedGalleryItems([...editGalleryItems]);
                    uploadGallery();
                  }}
                />
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="GalleryDetailFilter"
        component={GalleryDetailFilter}
        options={{
          header: () => <TopBar title={'사진 편집'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default StoryWritingNavigator;
