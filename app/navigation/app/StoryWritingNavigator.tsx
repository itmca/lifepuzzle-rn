import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WritingHeaderRight from '../../components/ui/navigation/header/WritingHeaderRight';
import { useSaveStory } from '../../service/story/story.write.hook';
import StorySelectingGallery from '../../pages/GalleryPages/GallerySelector/StoryGallerySelector.tsx';
import FacebookGallerySelector from '../../pages/GalleryPages/FacebookGallerySelector/FacebookGallerySelectorPage.tsx';

import StoryWritingPage from '../../pages/StoryPages/StoryWriting/StoryWritingPage.tsx';
import { useUploadGalleryV2 } from '../../service/gallery/gallery.upload.hook.ts';
import { TopBar } from '../../components/ui/navigation/TopBar';
import PhotoEditor from '../../pages/GalleryPages/PhotoEditor/PhotoEditorPage.tsx';
import PhotoFilter from '../../pages/GalleryPages/PhotoFilter/PhotoFilterPage.tsx';
import { useStoryStore } from '../../stores/story.store';
import { useSelectionStore } from '../../stores/selection.store';
import { STORY_WRITING_SCREENS } from '../screens.constant';

export type StoryWritingParamList = {
  [STORY_WRITING_SCREENS.STORY_WRITING_MAIN]: undefined;
  [STORY_WRITING_SCREENS.STORY_GALLERY_SELECTOR]: undefined;
  [STORY_WRITING_SCREENS.FACEBOOK_GALLERY_SELECTOR]: undefined;
  [STORY_WRITING_SCREENS.PHOTO_EDITOR]: undefined;
  [STORY_WRITING_SCREENS.PHOTO_FILTER]: undefined;
};

const Stack = createNativeStackNavigator<StoryWritingParamList>();

const StoryWritingNavigator = (): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const selectedStoryKey = useStoryStore(state => state.selectedStoryKey);
  const editGalleryItems = useSelectionStore(state => state.editGalleryItems);
  const setSelectedGalleryItems = useSelectionStore(
    state => state.setSelectedGalleryItems,
  );

  // Custom hooks
  const [saveStory] = useSaveStory();
  const [uploadGallery] = useUploadGalleryV2();
  return (
    <Stack.Navigator
      screenOptions={{ headerShadowVisible: false, headerTitleAlign: 'center' }}
    >
      <Stack.Screen
        name={STORY_WRITING_SCREENS.STORY_WRITING_MAIN}
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
        name={STORY_WRITING_SCREENS.STORY_GALLERY_SELECTOR}
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
        name={STORY_WRITING_SCREENS.FACEBOOK_GALLERY_SELECTOR}
        component={FacebookGallerySelector}
        options={{
          header: () => <TopBar title={'페이스북 사진'} />,
        }}
      />
      <Stack.Screen
        name={STORY_WRITING_SCREENS.PHOTO_EDITOR}
        component={PhotoEditor}
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
        name={STORY_WRITING_SCREENS.PHOTO_FILTER}
        component={PhotoFilter}
        options={{
          header: () => <TopBar title={'사진 편집'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default StoryWritingNavigator;
